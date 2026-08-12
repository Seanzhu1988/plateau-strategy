"""PayPal Payouts client, sends a payout to an agent's PayPal email.

Configuration (in .env, never committed):
    PAYPAL_ENV=sandbox            # 'sandbox' until proven, then 'live'
    PAYPAL_CLIENT_ID=...          # from developer.paypal.com > My Apps
    PAYPAL_CLIENT_SECRET=...

Safety properties:
  * The owner explicitly clicks Pay in Dispatch, nothing pays automatically.
  * sender_batch_id = our payout id, and PayPal de-duplicates on it, so
    retrying the same payout can never double-pay.
  * Not configured -> every call returns a clear error and nothing moves.
"""
import os
import requests

_TIMEOUT = 20


def _base():
    env = (os.environ.get("PAYPAL_ENV") or "sandbox").strip().lower()
    return ("https://api-m.paypal.com" if env == "live"
            else "https://api-m.sandbox.paypal.com"), env


def is_configured():
    return bool((os.environ.get("PAYPAL_CLIENT_ID") or "").strip()
                and (os.environ.get("PAYPAL_CLIENT_SECRET") or "").strip())


def status():
    base, env = _base()
    return {"configured": is_configured(), "env": env}


def _token():
    base, _ = _base()
    r = requests.post(
        base + "/v1/oauth2/token",
        auth=(os.environ.get("PAYPAL_CLIENT_ID", "").strip(),
              os.environ.get("PAYPAL_CLIENT_SECRET", "").strip()),
        data={"grant_type": "client_credentials"},
        timeout=_TIMEOUT)
    r.raise_for_status()
    return r.json()["access_token"]


def send_payout(payout_id, receiver_email, amount_usd, note=""):
    """Send one payout. Returns {ok, batch_id, batch_status} or {ok:False, error}."""
    if not is_configured():
        return {"ok": False, "error": "PayPal isn't connected yet, add PAYPAL_CLIENT_ID / "
                                      "PAYPAL_CLIENT_SECRET to .env and restart."}
    if not receiver_email or "@" not in receiver_email:
        return {"ok": False, "error": "The agent hasn't added a PayPal email yet."}
    try:
        amount = "%.2f" % float(amount_usd)
    except Exception:
        return {"ok": False, "error": "Bad amount."}
    base, env = _base()
    try:
        tok = _token()
        r = requests.post(
            base + "/v1/payments/payouts",
            headers={"Authorization": "Bearer " + tok,
                     "Content-Type": "application/json"},
            json={
                "sender_batch_header": {
                    # our payout id = the idempotency key; PayPal rejects re-sends
                    "sender_batch_id": str(payout_id),
                    "email_subject": "You've been paid, Plateau Strategy Solution Lab",
                    "email_message": note or "Your commission payout from Plateau Strategy Solution Lab.",
                },
                "items": [{
                    "recipient_type": "EMAIL",
                    "receiver": receiver_email,
                    "amount": {"value": amount, "currency": "USD"},
                    "note": note or "Commission payout",
                    "sender_item_id": str(payout_id),
                }],
            },
            timeout=_TIMEOUT)
        if r.status_code >= 300:
            try:
                detail = r.json()
                msg = detail.get("message") or detail.get("name") or r.text[:200]
                if detail.get("name") == "USER_BUSINESS_ERROR" or "DUPLICATE" in r.text:
                    msg = "PayPal reports this payout id was already sent (no double-pay). Check the PayPal dashboard."
            except Exception:
                msg = r.text[:200]
            return {"ok": False, "error": "PayPal (%s): %s" % (env, msg)}
        d = r.json()
        hdr = d.get("batch_header", {})
        return {"ok": True, "env": env,
                "batch_id": hdr.get("payout_batch_id", ""),
                "batch_status": hdr.get("batch_status", "")}
    except requests.RequestException as e:
        return {"ok": False, "error": "PayPal connection failed: %s" % e}
