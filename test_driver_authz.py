"""Can a stranger who guesses a driver id read customer data or act as them?

Driver ids are handed out in sequence, RTR_0001, RTR_0002, ..., so "guessing"
means counting. Every test below assumes the attacker knows a valid id, because
that is the realistic case, not a hard one.
"""
import os, sys, json, tempfile, shutil

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, "/home/user/plateau-strategy")
import app as A

tmp = tempfile.mkdtemp()
A.RES_PATH        = os.path.join(tmp, "reservations.json")
A.RENTERS_PATH    = os.path.join(tmp, "renters.json")
A.SIGNATURES_PATH = os.path.join(tmp, "signatures.json")
A.app.config["TESTING"] = True

PII = ["Whitfield", "dana.whitfield@example.com", "206-555-0142", "812 Pine St"]

def seed():
    json.dump([
        {"id": "R_OPEN", "status": "NEW", "pickup": "SeaTac", "fare": 75,
         "trip": {"date": "2027-01-01", "time": "09:00"},
         "client": {"name": "Dana Whitfield", "email": "dana.whitfield@example.com",
                    "phone": "206-555-0142", "address": "812 Pine St, Seattle WA"}},
        {"id": "R_MINE", "status": "ASSIGNED", "renter_id": "RTR_0001", "fare": 75,
         "trip": {"date": "2027-01-01", "time": "09:00"},
         "client": {"name": "Marcus Feld", "email": "mf@example.com",
                    "phone": "206-555-0199", "address": "5 Leary Way"}},
    ], open(A.RES_PATH, "w"))
    json.dump([{"id": "RTR_0001", "name": "Real Driver",
                "car": {"vin": "1" * 17}, "dob": "07031990",
                "insurance": {"expires": "2099-01-01"}}], open(A.RENTERS_PATH, "w"))
    json.dump([], open(A.SIGNATURES_PATH, "w"))

fails = []
def chk(label, cond):
    print(f"  {'OK  ' if cond else 'FAIL'} {label}")
    if not cond: fails.append(label)

GUESSED = "RTR_0001"

print("attacker knows a valid driver id, has no session:\n")
seed()
atk = A.app.test_client()

body = atk.get(f"/api/reservations?renter_id={GUESSED}").get_data(as_text=True)
chk("reservations: no customer PII leaks", not any(p in body for p in PII))
chk("reservations: other drivers' rides stay hidden", "Marcus" not in body)

r = atk.post("/api/reservations/R_OPEN/claim", json={"renter_id": GUESSED})
body = r.get_data(as_text=True)
chk(f"claim: rejected, not 200 (got {r.status_code})", r.status_code == 401)
chk("claim: response carries no PII", not any(p in body for p in PII))
chk("claim: the ride was NOT taken",
    json.load(open(A.RES_PATH))[0]["status"] == "NEW")

r = atk.post("/api/reservations/R_MINE/giveup", json={"renter_id": GUESSED})
chk(f"giveup: rejected (got {r.status_code})", r.status_code == 401)
chk("giveup: the driver still has their ride",
    json.load(open(A.RES_PATH))[1]["status"] == "ASSIGNED")

r = atk.post("/api/contract/sign", json={"renter_id": GUESSED, "typed_name": "Real Driver",
                                         "signature": "data:image/png;base64,AAA", "agree": True})
chk(f"contract: cannot be signed in another driver's name (got {r.status_code})",
    r.status_code == 401)
chk("contract: no forged signature was filed", json.load(open(A.SIGNATURES_PATH)) == [])

r = atk.get(f"/api/contract/status?renter_id={GUESSED}")
chk(f"contract status: not readable by a stranger (got {r.status_code})", r.status_code == 401)

print("\nthe real driver, properly signed in, can still work:\n")
seed()
drv = A.app.test_client()
r = drv.post("/api/renters/login", json={"vin": "1" * 17, "dob": "07031990"})
chk(f"driver can log in (got {r.status_code})", r.status_code == 200)

body = drv.get("/api/reservations").get_data(as_text=True)
chk("driver sees their own assigned ride in full", "Marcus Feld" in body)
chk("driver still gets the open board", "R_OPEN" in body)
chk("open board is still redacted for them", "Whitfield" not in body)

r = drv.post("/api/contract/sign", json={"typed_name": "Real Driver",
                                         "signature": "data:image/png;base64,AAA", "agree": True})
chk(f"driver can sign their own agreement (got {r.status_code})", r.status_code == 200)

r = drv.post("/api/reservations/R_OPEN/claim", json={})
chk(f"driver can claim an open ride (got {r.status_code})", r.status_code == 200)
chk("claiming releases the customer's details to THAT driver",
    "Whitfield" in r.get_data(as_text=True))

r = drv.get("/api/contract/status")
chk(f"driver reads their own contract status (got {r.status_code})", r.status_code == 200)

print("\nowner keeps full access:\n")
seed()
own = A.app.test_client()
with own.session_transaction() as s:
    s["owner"] = "sean"
body = own.get("/api/reservations").get_data(as_text=True)
chk("owner sees everything", all(p in body for p in PII))
chk("owner can query any driver's contract status",
    own.get(f"/api/contract/status?renter_id={GUESSED}").status_code == 200)

shutil.rmtree(tmp, ignore_errors=True)
print("\nHOLE CLOSED, APP STILL WORKS" if not fails else f"\nFAILED: {fails}")
raise SystemExit(1 if fails else 0)
