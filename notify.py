"""Driver notifications for new ride reservations.

Channels (each enabled by environment variables):
  - Telegram          (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID)
    The one that needs no domain, no sender verification and no per-message
    cost, which is why it is tried first. A booking that reaches nobody is a
    booking lost, and email needs a verified sending domain before it delivers
    anything at all.
  - Email via Resend  (RESEND_API_KEY + DRIVER_EMAIL)
  - SMS   via Twilio  (TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_FROM)
    New rides are texted to EVERY registered driver with a phone number.
    Drivers claim by replying YES (handled by /sms/reply in app.py).

If a channel isn't configured it is skipped. Never raises, returns a summary
dict of which channels were used and their result.
"""
import os
import requests


def _twilio_cfg():
    return (os.environ.get("TWILIO_ACCOUNT_SID", "").strip(),
            os.environ.get("TWILIO_AUTH_TOKEN", "").strip(),
            os.environ.get("TWILIO_FROM", "").strip())


def to_e164(phone):
    """Normalize a phone number to E.164 (+1XXXXXXXXXX for US) so Twilio accepts it
    however the driver typed it (dashes, spaces, parentheses, no country code)."""
    p = (phone or "").strip()
    if not p:
        return ""
    if p.startswith("+"):
        return "+" + "".join(c for c in p[1:] if c.isdigit())
    digits = "".join(c for c in p if c.isdigit())
    if len(digits) == 10:            # US 10-digit -> add +1
        return "+1" + digits
    if len(digits) == 11 and digits.startswith("1"):
        return "+" + digits
    return "+" + digits if digits else ""


def send_sms(to_phone, body):
    """Send one SMS via Twilio. Returns 'sent' or an error string.
    Master kill-switch: set SMS_ENABLED=false in .env to stop ALL texting
    instantly (costs nothing, no Twilio calls) without changing any code."""
    if os.environ.get("SMS_ENABLED", "true").strip().lower() in ("false", "0", "no", "off"):
        return "sms_disabled"
    sid, tok, frm = _twilio_cfg()
    to_phone = to_e164(to_phone)
    if not (sid and tok and frm and to_phone):
        return "not_configured"
    try:
        r = requests.post(
            "https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json" % sid,
            auth=(sid, tok), timeout=15,
            data={"From": frm, "To": to_phone, "Body": body})
        return "sent" if r.status_code < 300 else ("error: %s" % r.text[:200])
    except Exception as e:
        return "error: %s" % e


def ride_offer_sms(reservation):
    """The text drivers receive when a new ride comes in."""
    t = reservation.get("trip", {})
    parts = ["New ride %s" % reservation.get("id"),
             "%s -> %s" % (t.get("pickup", ""), t.get("dropoff", ""))]
    if t.get("date") or t.get("time"):
        parts.append("When: %s %s" % (t.get("date", ""), t.get("time", "")))
    if t.get("flight"):
        parts.append("Flight: %s" % t.get("flight"))
    parts.append("Fare: $%s" % reservation.get("fare_usd"))
    parts.append("Reply YES to accept (first come first served), or open the driver panel.")
    return "\n".join(parts)


def sms_ride_offer_to_drivers(reservation, renters):
    """Text every registered driver about a new ride. Returns {phone: result}."""
    body = ride_offer_sms(reservation)
    results = {}
    for r in renters:
        phone = (r.get("phone") or "").strip()
        if phone:
            results[phone] = send_sms(phone, body)
    # Fallback single number if no drivers have phones yet
    if not results:
        fallback = os.environ.get("DRIVER_PHONE", "").strip()
        if fallback:
            results[fallback] = send_sms(fallback, body)
    return results


def sms_ride_taken(reservation, winner, renters):
    """The moment one driver wins a ride, tell every OTHER driver who was offered it
    that it's gone, so nobody wastes a reply and everyone knows the situation.
    Texts the drivers in reservation['offered_driver_ids'] (minus the winner). Falls
    back to all drivers-with-phones if the offer list wasn't recorded."""
    rid = reservation.get("id")
    offered = reservation.get("offered_driver_ids") or []
    winner_id = (winner or {}).get("id")
    msg = ("Ride %s has been taken by another driver. "
           "Thanks for the quick reply, we'll send the next one your way." % rid)
    results = {}
    for r in renters:
        if r.get("id") == winner_id:
            continue
        if offered and r.get("id") not in offered:
            continue
        phone = (r.get("phone") or "").strip()
        if not phone:
            continue
        results[phone] = send_sms(phone, msg)
    return results


def _summary(res, trip, client, invoice):
    return (
        "New ride reservation %s\n"
        "Client: %s (%s, %s)\n"
        "Pickup:  %s\n"
        "Drop-off: %s\n"
        "When: %s %s\n"
        "Fare: $%s\n"
        "Invoice: %s [%s]"
    ) % (
        res.get("id"),
        client.get("name", ""), client.get("email", ""), client.get("phone", ""),
        trip.get("pickup", ""), trip.get("dropoff", ""),
        trip.get("date", ""), trip.get("time", ""),
        res.get("fare_usd", ""),
        (invoice.get("url") or invoice.get("id", "")), invoice.get("status", ""),
    )


def send_telegram(text):
    """Push a message to the owner's Telegram. Returns a short status string.

    Never raises: a notification channel must not be able to break a booking.
    A reservation that is saved but unannounced is recoverable; a reservation
    that failed to save because the announcement threw is not.
    """
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
    if not token or not chat:
        return "not_configured"
    try:
        r = requests.post("https://api.telegram.org/bot%s/sendMessage" % token,
                          timeout=10,
                          json={"chat_id": chat, "text": text[:4000],
                                "disable_web_page_preview": True})
        if r.status_code < 300 and (r.json() or {}).get("ok"):
            return "sent"
        return "error: %s" % r.text[:160]
    except Exception as e:
        return "error: %s" % e


def notify_driver(reservation, invoice, renters=None):
    trip = reservation.get("trip", {})
    client = reservation.get("client", {})
    body = _summary(reservation, trip, client, invoice)
    channels = {"dashboard": True, "email": None, "sms": None, "telegram": None}

    # ---- Telegram first: it is the channel that actually delivers today ----
    # body already opens with "New ride reservation <id>", so it is sent as is
    # rather than with a heading repeated on top of its own heading.
    tg = send_telegram(body)
    if tg != "not_configured":
        channels["telegram"] = tg

    # ---- SMS ride offer to ALL registered drivers (reply YES to claim) ----
    if renters:
        sms_results = sms_ride_offer_to_drivers(reservation, renters)
        real = {p: s for p, s in sms_results.items() if s != "not_configured"}
        if real:
            channels["sms"] = real

    # ---- Email via Resend ----
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    driver_email = os.environ.get("DRIVER_EMAIL", "").strip()
    from_email = os.environ.get(
        "NOTIFY_FROM_EMAIL", "Plateau Strategy Solution Lab <onboarding@resend.dev>").strip()
    if api_key and driver_email:
        try:
            r = requests.post(
                "https://api.resend.com/emails", timeout=15,
                headers={"Authorization": "Bearer " + api_key,
                         "Content-Type": "application/json"},
                json={"from": from_email, "to": [driver_email],
                      "subject": "New ride reservation %s" % reservation.get("id"),
                      "text": body})
            channels["email"] = "sent" if r.status_code < 300 else ("error: %s" % r.text[:200])
        except Exception as e:
            channels["email"] = "error: %s" % e

    # ---- Fallback: single-number SMS when no drivers are registered ----
    if channels["sms"] is None:
        driver_phone = os.environ.get("DRIVER_PHONE", "").strip()
        result = send_sms(driver_phone, body)
        if result != "not_configured":
            channels["sms"] = result

    return channels


def email_owner(subject, body):
    """Send the owner a plain-text record of something that just happened.

    This exists because the live server's disk does not survive a deploy or a
    restart: anything written at runtime, a guide's listing, a traveller's
    request, can vanish before it is ever read. An email is the one copy that
    cannot be wiped by a redeploy, so every record worth keeping is mailed out
    at the moment it is created. Fails silently; it must never break the
    request that triggered it.
    """
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    to = (os.environ.get("OWNER_EMAIL", "").strip()
          or os.environ.get("DRIVER_EMAIL", "").strip())
    if not (api_key and to):
        return "not_configured"
    from_email = os.environ.get(
        "NOTIFY_FROM_EMAIL", "Plateau Strategy Solution Lab <onboarding@resend.dev>").strip()
    try:
        r = requests.post(
            "https://api.resend.com/emails", timeout=15,
            headers={"Authorization": "Bearer " + api_key, "Content-Type": "application/json"},
            json={"from": from_email, "to": [to], "subject": subject, "text": body})
        return "sent" if r.status_code < 300 else ("error: %s" % r.text[:200])
    except Exception as e:
        return "error: %s" % e
