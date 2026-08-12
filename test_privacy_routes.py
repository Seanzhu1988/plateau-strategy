# -*- coding: utf-8 -*-
"""The consent routes and the privacy policy, over HTTP.

test_consent.py proves the rules inside the module. This proves the wiring:
that the feature does not exist until it is switched on, that the policy will
not publish without a working contact, and that the endpoint refuses a
coordinate however a caller dresses one up.

    python3 test_privacy_routes.py
"""
import importlib
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                           # noqa: E402
import consent as C                                       # noqa: E402

A.app.config["TESTING"] = True
tmp = tempfile.mkdtemp()
A.CONSENT = C.ConsentStore(os.path.join(tmp, "consents.json"),
                           os.path.join(tmp, "places.json"))
V = C.CONSENT_TEXTS["map_place"]["version"]

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


print("switched off, none of it exists:")
os.environ.pop("LOCATION_CONSENT_ENABLED", None)
c = A.app.test_client()
for path in ("/api/consent/text?purpose=map_place", "/api/consent/me",
             "/api/consent/cities"):
    chk("GET %s is 404, not 403" % path, c.get(path).status_code == 404)
for path in ("/api/consent/grant", "/api/consent/place", "/api/consent/withdraw"):
    chk("POST %s is 404" % path,
        c.post(path, json={"purpose": "map_place", "granted": True}).status_code == 404)
chk("and nothing was written", not os.path.exists(A.CONSENT.places_path))

print("\nthe privacy policy will not publish without a way to reach a human:")
A.PRIVACY_CONTACT = ""
chk("/privacy is withheld (404)", c.get("/privacy").status_code == 404)
A.PRIVACY_CONTACT = "privacy@example.com"
r = c.get("/privacy")
chk("with a contact set it serves (%d)" % r.status_code, r.status_code == 200)
page = r.get_data(as_text=True)
chk("it is served from the API, not baked into the HTML",
    "privacy@example.com" not in page)
chk("the endpoint supplies it",
    c.get("/api/privacy/contact").get_json()["contact"] == "privacy@example.com")

print("\nand the policy says the things it must:")
# Read the prose, not the source. The page carries HTML comments explaining why
# certain things are absent, and those comments name the very words being
# checked for. A comment is not something a visitor reads.
import re                                                 # noqa: E402
low = re.sub(r"<!--.*?-->", "", page, flags=re.S).lower()
for must, why in [
        ("do not sell", "no sale of personal information"),
        ("my health my data", "the Washington notice"),
        ("consumer health data", "named as the statute names it"),
        ("openstreetmap", "the third party the BROWSER calls directly"),
        ("square", "the payment processor"),
        ("twilio", "the SMS processor"),
        ("/not-a-traveler", "the working opt-out"),
        ("deletion", "the right to be deleted")]:
    chk("it mentions %s (%s)" % (must, why), must in low)
# photo_intake.py exists but is wired to no route. A policy describing it would
# be a false statement in a legal document, the exact failure mode that makes
# privacy policies worthless.
chk("it does NOT describe photo GPS, which is not wired to any route",
    "exif" not in low and "photo" not in low)

print("\nswitched on, the flow works:")
os.environ["LOCATION_CONSENT_ENABLED"] = "1"
c = A.app.test_client()
t = c.get("/api/consent/text?purpose=map_place").get_json()
chk("the wording is served with its version", t["ok"] and t["version"] == V)
chk("and a hash of it", len(t["sha256"]) == 64)
chk("an unknown purpose gets no wording",
    c.get("/api/consent/text?purpose=research").status_code == 400)

r = c.post("/api/consent/place", json={"city": "Tacoma"})
chk("filing a place before consenting is refused (%d)" % r.status_code,
    r.status_code == 403)

chk("granting without granted:true is refused",
    c.post("/api/consent/grant",
           json={"purpose": "map_place", "version": V}).status_code == 400)
chk("a truthy string is not consent",
    c.post("/api/consent/grant",
           json={"purpose": "map_place", "version": V,
                 "granted": "yes"}).status_code == 400)
chk("nor is an unknown purpose",
    c.post("/api/consent/grant",
           json={"purpose": "research", "version": V,
                 "granted": True}).status_code == 400)

r = c.post("/api/consent/grant",
           json={"purpose": "map_place", "version": V, "granted": True})
chk("a proper grant is accepted (%d)" % r.status_code, r.status_code == 200)
r = c.post("/api/consent/place",
           json={"city": "Tacoma", "region": "Washington", "country": "United States"})
chk("now a city can be filed (%d)" % r.status_code, r.status_code == 200)

print("\nthe endpoint refuses a coordinate, however it arrives:")
for body, how in [
        ({"city": "Tacoma", "lat": 47.2529, "lon": -122.4443}, "the obvious way"),
        ({"city": "Tacoma", "coords": [47.25, -122.44]}, "in a list"),
        ({"city": "Tacoma", "where": "47.2529"}, "as a string under a bland name"),
        ({"city": "Tacoma", "meta": {"gps": {"a": 1}}}, "nested under a alias"),
        ({"city": "Tacoma", "accuracy": 12.5}, "as an accuracy reading")]:
    r = c.post("/api/consent/place", json=body)
    chk("refused %s (%d)" % (how, r.status_code), r.status_code == 400)

import json                                               # noqa: E402
rows = json.load(open(A.CONSENT.places_path))
chk("and after all that, the file holds only city names (%s)"
    % sorted({k for r in rows for k in r}),
    C.looks_like_coordinate(rows) is None)

print("\none browser cannot touch another's:")
other = A.app.test_client()
r = other.get("/api/consent/me").get_json()
chk("a different browser sees nothing", r["consents"] == [] and r["places"] == [])
chk("and withdrawing from it deletes nothing",
    other.post("/api/consent/withdraw",
               json={"purpose": "map_place"}).get_json()["deleted"] == 0)
chk("the first browser's contribution survives",
    len(json.load(open(A.CONSENT.places_path))) == 1)

print("\nwithdrawal over HTTP deletes:")
mine = c.get("/api/consent/me").get_json()
chk("the browser can see its own (%d place)" % len(mine["places"]),
    len(mine["places"]) == 1 and mine["places"][0]["city"] == "Tacoma")
chk("and its copy never contains the linking key",
    all("contrib_key" not in x for x in mine["consents"]))
d = c.post("/api/consent/withdraw", json={"purpose": "map_place"}).get_json()
chk("withdrawing removes it (%d)" % d["deleted"], d["deleted"] == 1)
chk("the places file is empty", json.load(open(A.CONSENT.places_path)) == [])
chk("filing again is refused",
    c.post("/api/consent/place", json={"city": "Olympia"}).status_code == 403)

print("\nthe city tally is not public:")
chk("a stranger cannot read it (%d)" % c.get("/api/consent/cities").status_code,
    c.get("/api/consent/cities").status_code in (401, 403))

os.environ.pop("LOCATION_CONSENT_ENABLED", None)
shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
