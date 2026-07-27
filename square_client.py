"""Square invoice integration for Plateau Strategy Solution Lab ride bookings.

Creates and SENDS a Square invoice for a ride reservation. If no
SQUARE_ACCESS_TOKEN is configured, it returns a simulated ("mock") invoice so
the whole booking flow works end-to-end in demo mode with zero setup.

Real mode flow (Square REST API):
  1. Create / find the client as a Square customer
  2. Create an order with one line item (the ride) for the fare
  3. Create a draft invoice tied to that order + customer
  4. Publish the invoice  -> Square emails it to the client to pay by card
"""
import os
import uuid
import datetime
import requests

# Square API version (date-based). Bump if you need newer fields.
SQUARE_VERSION = "2024-10-17"


def _cfg():
    return {
        "token": os.environ.get("SQUARE_ACCESS_TOKEN", "").strip(),
        "location": os.environ.get("SQUARE_LOCATION_ID", "").strip(),
        "env": os.environ.get("SQUARE_ENV", "sandbox").strip().lower(),
        "currency": (os.environ.get("SQUARE_CURRENCY", "USD").strip() or "USD"),
    }


def _base_url(env):
    if env == "production":
        return "https://connect.squareup.com"
    return "https://connect.squareupsandbox.com"


def _bill(client, amount_usd, line_name, title, description,
          invoice_number=None, sale_date=None, due_date=None):
    """Core billing: customer -> order -> invoice -> publish (Square emails it).
    Simulates in demo mode when no credentials. Never raises.
    Returns {mode, id, url, status, amount_usd, [error], [note]}.
    """
    cfg = _cfg()
    amount = float(amount_usd or 0)
    amount_cents = int(round(amount * 100))
    client = client or {}

    # ---- Demo mode: no credentials -> simulate an invoice ----
    if not cfg["token"] or not cfg["location"]:
        return {
            "mode": "mock",
            "id": "MOCK-" + uuid.uuid4().hex[:8].upper(),
            "url": "",
            "status": "SIMULATED",
            "amount_usd": amount,
            "note": "Demo invoice — add SQUARE_ACCESS_TOKEN + SQUARE_LOCATION_ID "
                    "to .env to send a real one.",
        }

    base = _base_url(cfg["env"])
    headers = {
        "Square-Version": SQUARE_VERSION,
        "Authorization": "Bearer " + cfg["token"],
        "Content-Type": "application/json",
    }

    try:
        # 1) Customer — split the full name so Square shows first + last properly
        name_parts = (client.get("name") or "Customer").strip().split()
        given = name_parts[0] if name_parts else "Customer"
        family = " ".join(name_parts[1:]) if len(name_parts) > 1 else None
        r = requests.post(base + "/v2/customers", headers=headers, timeout=20, json={
            "idempotency_key": str(uuid.uuid4()),
            "given_name": given,
            "family_name": family,
            "email_address": (client.get("email") or None),
            "phone_number": (client.get("phone") or None),
        })
        r.raise_for_status()
        customer_id = r.json()["customer"]["id"]

        # 2) Order (one line item)
        r = requests.post(base + "/v2/orders", headers=headers, timeout=20, json={
            "idempotency_key": str(uuid.uuid4()),
            "order": {
                "location_id": cfg["location"],
                "customer_id": customer_id,
                "line_items": [{
                    "name": (line_name or "Charge")[:500],
                    "quantity": "1",
                    "base_price_money": {"amount": amount_cents, "currency": cfg["currency"]},
                }],
            },
        })
        r.raise_for_status()
        order_id = r.json()["order"]["id"]

        # 3) Draft invoice
        due = due_date or (datetime.date.today() + datetime.timedelta(days=3)).isoformat()
        invoice_body = {
            "location_id": cfg["location"],
            "order_id": order_id,
            "primary_recipient": {"customer_id": customer_id},
            "payment_requests": [{
                "request_type": "BALANCE",
                "due_date": due,
                "automatic_payment_source": "NONE",
            }],
            "delivery_method": "EMAIL",
            "accepted_payment_methods": {
                "card": True,
                "square_gift_card": False,
                "bank_account": False,
                "buy_now_pay_later": False,
            },
            "title": (title or "Plateau Strategy Solution Lab")[:255],
            "description": (description or "")[:1000],
        }
        if invoice_number:
            # Same number on the website confirmation and the Square invoice
            invoice_body["invoice_number"] = str(invoice_number)[:191]
        if sale_date:
            invoice_body["sale_or_service_date"] = sale_date
        r = requests.post(base + "/v2/invoices", headers=headers, timeout=20, json={
            "idempotency_key": str(uuid.uuid4()),
            "invoice": invoice_body,
        })
        r.raise_for_status()
        inv = r.json()["invoice"]
        invoice_id, version = inv["id"], inv["version"]

        # 4) Publish -> Square emails the invoice
        r = requests.post(base + "/v2/invoices/%s/publish" % invoice_id,
                          headers=headers, timeout=20, json={
            "idempotency_key": str(uuid.uuid4()),
            "version": version,
        })
        r.raise_for_status()
        pub = r.json()["invoice"]
        return {
            "mode": cfg["env"],
            "id": invoice_id,
            "url": pub.get("public_url", ""),
            "status": pub.get("status", "PUBLISHED"),
            "amount_usd": amount,
        }

    except requests.HTTPError as e:
        detail = ""
        try:
            detail = e.response.text[:500]
        except Exception:
            pass
        return {"mode": cfg["env"], "id": "", "url": "", "status": "ERROR",
                "amount_usd": amount, "error": detail or str(e)}
    except Exception as e:
        return {"mode": cfg["env"], "id": "", "url": "", "status": "ERROR",
                "amount_usd": amount, "error": str(e)}


def create_invoice(reservation):
    """Create (and send) a Square invoice for a ride reservation.
    The invoice mirrors the website confirmation: same reservation number,
    same ride details, same driver-arrival promise."""
    trip = reservation.get("trip", {})
    rid = str(reservation.get("id") or "")
    fare = float(reservation.get("fare_usd") or 0)
    line_name = "Reservation Ride: %s -> %s" % (trip.get("pickup", "?"), trip.get("dropoff", "?"))

    # Description = the same boxes the customer filled in on the website
    parts = ["Reservation %s" % rid if rid else None,
             "%s -> %s" % (trip.get("pickup", ""), trip.get("dropoff", ""))]
    if trip.get("date") or trip.get("time"):
        parts.append("Scheduled: %s %s" % (trip.get("date", ""), trip.get("time", "")))
    if trip.get("passengers"):
        parts.append("Passengers: %s" % trip.get("passengers"))
    if trip.get("flight"):
        parts.append("Flight: %s" % trip.get("flight"))
    parts.append("Your driver will arrive 15 minutes before your departure time.")
    desc = "\n".join(p for p in parts if p)

    # Ride date on the invoice; if the ride is sooner than the default 3-day
    # due date, payment is due by the ride date instead.
    sale_date, due_date = None, None
    try:
        d = datetime.date.fromisoformat((trip.get("date") or "").strip())
        if d >= datetime.date.today():
            sale_date = d.isoformat()
            due_date = min(d, datetime.date.today() + datetime.timedelta(days=3)).isoformat()
    except Exception:
        pass

    result = _bill(reservation.get("client", {}), fare, line_name,
                   "Plateau Strategy Solution Lab Ride", desc,
                   invoice_number=rid or None, sale_date=sale_date, due_date=due_date)
    if result.get("status") == "ERROR" and "invoice_number" in (result.get("error") or ""):
        # Square requires invoice numbers to be unique forever; retry with a suffix.
        alt = "%s-%s" % (rid, uuid.uuid4().hex[:4].upper())
        result = _bill(reservation.get("client", {}), fare, line_name,
                       "Plateau Strategy Solution Lab Ride", desc,
                       invoice_number=alt, sale_date=sale_date, due_date=due_date)
    if result.get("mode") == "mock":
        result["id"] = "MOCK-" + rid
    return result


def create_charge(client, amount_usd, item_name, description=""):
    """Generic one-time charge (e.g. AI Debt Eliminator subscription enrollment).
    `client` = {name, email, phone}. Returns the same shape as create_invoice.
    """
    return _bill(client, amount_usd, item_name, item_name, description)


def list_invoices():
    """Fetch all invoices for our location, keyed by invoice_number (our RES_/FIN_ ids).
    Used by the Books & Taxes page for true paid/unpaid status. Never raises."""
    cfg = _cfg()
    if not cfg["token"] or not cfg["location"]:
        return {"mode": "mock", "invoices": {}}
    base = _base_url(cfg["env"])
    headers = {"Square-Version": SQUARE_VERSION,
               "Authorization": "Bearer " + cfg["token"]}
    out, cursor = {}, None
    try:
        for _ in range(20):  # up to 20 pages x 200
            params = {"location_id": cfg["location"], "limit": 200}
            if cursor:
                params["cursor"] = cursor
            r = requests.get(base + "/v2/invoices", headers=headers, params=params, timeout=20)
            r.raise_for_status()
            data = r.json()
            for inv in data.get("invoices", []):
                num = inv.get("invoice_number")
                if num:
                    amt = None
                    try:
                        amt = inv["payment_requests"][0]["computed_amount_money"]["amount"] / 100.0
                    except Exception:
                        pass
                    out[num] = {"status": inv.get("status"),
                                "updated_at": inv.get("updated_at", "")[:10],
                                "created_at": inv.get("created_at", "")[:10],
                                "amount": amt}
            cursor = data.get("cursor")
            if not cursor:
                break
        return {"mode": cfg["env"], "invoices": out}
    except Exception as e:
        return {"mode": cfg["env"], "invoices": out, "error": str(e)}


def cancel_invoice(invoice_id):
    """Cancel a published Square invoice so the customer is no longer asked to pay.
    Returns {ok, status, [error]}. Never raises."""
    cfg = _cfg()
    if not invoice_id:
        return {"ok": True, "status": "NO_INVOICE"}
    if str(invoice_id).startswith("MOCK-") or not cfg["token"] or not cfg["location"]:
        return {"ok": True, "status": "SIMULATED_CANCEL"}

    base = _base_url(cfg["env"])
    headers = {
        "Square-Version": SQUARE_VERSION,
        "Authorization": "Bearer " + cfg["token"],
        "Content-Type": "application/json",
    }
    try:
        r = requests.get(base + "/v2/invoices/%s" % invoice_id, headers=headers, timeout=20)
        r.raise_for_status()
        inv = r.json()["invoice"]
        status = inv.get("status", "")
        if status in ("PAID", "REFUNDED", "PARTIALLY_REFUNDED"):
            return {"ok": False, "status": status,
                    "error": "Invoice was already paid — issue a refund from your Square Dashboard."}
        if status == "CANCELED":
            return {"ok": True, "status": "CANCELED"}
        r = requests.post(base + "/v2/invoices/%s/cancel" % invoice_id,
                          headers=headers, timeout=20,
                          json={"version": inv["version"]})
        r.raise_for_status()
        return {"ok": True, "status": "CANCELED"}
    except requests.HTTPError as e:
        detail = ""
        try:
            detail = e.response.text[:300]
        except Exception:
            pass
        return {"ok": False, "status": "ERROR", "error": detail or str(e)}
    except Exception as e:
        return {"ok": False, "status": "ERROR", "error": str(e)}
