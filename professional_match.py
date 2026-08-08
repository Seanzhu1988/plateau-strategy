# -*- coding: utf-8 -*-
"""Read a business idea and work out which professionals it needs.

Why rules and not a model
-------------------------
This could call an LLM. It deliberately does not:

  · it runs on every idea, on a $7/month box, and costs nothing;
  · a founder can be shown *why* a trade was suggested — the words that
    triggered it — which a model cannot honestly do;
  · the owner can add a trade himself by editing one list, without a key,
    a bill, or a prompt to tune;
  · it gives the same answer twice, which matters when the output is
    shown publicly next to somebody's idea.

It is a lexicon, not an oracle. It will miss things. Everything it returns
is phrased as "likely needs", every idea gets the four professionals that
almost every business needs regardless, and the founder can always say the
list is wrong.
"""

import re

# Every business needs these, whatever it is. Listed separately so they are
# never presented as if the text was clever enough to deduce them.
ALWAYS = [
    ("accountant", "CPA / accountant", "Entity choice, tax treatment, and what the setup actually costs."),
    ("business-attorney", "Business attorney", "Formation, contracts, and what licences the work requires."),
    ("insurance-broker", "Insurance broker", "The cover the business needs before it can legally trade."),
    ("bookkeeper", "Bookkeeper", "Keeping the books from day one, so the first tax year is not a rescue job."),
]

# domain -> (trigger words, [(slug, label, why)])
DOMAINS = {
    "property": (
        ["real estate", "property", "building", "renovat", "remodel", "construct", "apartment",
         "duplex", "land", "lot", "zoning", "landlord", "tenant", "airbnb", "short-term rental",
         "mixed-use", "development", "house", "housing", "commercial space", "storefront", "lease"],
        [("real-estate-attorney", "Real estate attorney", "Title, zoning, purchase and lease agreements."),
         ("architect", "Architect", "Drawings, and whether the plan is buildable at all."),
         ("interior-designer", "Interior designer", "Layout, finish and how the space actually gets used."),
         ("general-contractor", "General contractor", "What the build costs and how long it takes."),
         ("appraiser", "Appraiser", "What it is worth, as opposed to what it is hoped to be worth."),
         ("mortgage-broker", "Mortgage broker", "How the purchase or build is financed.")],
    ),
    "food": (
        ["restaurant", "cafe", "café", "coffee", "bakery", "kitchen", "catering", "food truck",
         "menu", "brewery", "bar ", "dining", "chef", "grocery", "meal"],
        [("health-permit-consultant", "Health permit consultant", "Health department approval before opening."),
         ("kitchen-designer", "Commercial kitchen designer", "A kitchen that passes inspection and works at service."),
         ("liquor-license-attorney", "Liquor licence attorney", "If anything alcoholic is served."),
         ("food-safety-trainer", "Food safety trainer", "Required certification for staff.")],
    ),
    "transport": (
        ["rideshare", "driver", "fleet", "vehicle", "car ", "taxi", "limo", "shuttle", "delivery",
         "trucking", "logistics", "courier", "transport", "charter", "tour bus", "ev ", "charging"],
        [("commercial-insurance-broker", "Commercial auto insurance broker", "Commercial cover — personal policies do not apply."),
         ("transport-attorney", "Transportation attorney", "Operating authority, permits and driver classification."),
         ("fleet-manager", "Fleet manager", "Maintenance, scheduling and cost per mile.")],
    ),
    "retail": (
        ["retail", "store", "shop", "boutique", "e-commerce", "ecommerce", "online store", "sell products",
         "merchandise", "inventory", "wholesale", "dropship", "marketplace", "brand"],
        [("sales-tax-cpa", "Sales tax specialist", "Where you owe sales tax, which is rarely only your own state."),
         ("trademark-attorney", "Trademark attorney", "Securing the name before building on it."),
         ("logistics-consultant", "Logistics consultant", "Getting stock in and orders out."),
         ("packaging-designer", "Packaging designer", "What the customer physically receives.")],
    ),
    "tech": (
        ["app", "software", "platform", "website", "saas", "ai ", "algorithm", "data", "api",
         "marketplace app", "mobile", "automation", "crypto", "blockchain"],
        [("ip-attorney", "IP attorney", "Who owns the code, and what can be protected."),
         ("privacy-counsel", "Privacy counsel", "What you may collect and what you must disclose."),
         ("software-engineer", "Software engineer", "What it costs to build and to keep running.")],
    ),
    "health": (
        ["clinic", "medical", "health", "patient", "therapy", "dental", "wellness", "care ",
         "nursing", "pharmacy", "telehealth"],
        [("healthcare-attorney", "Healthcare attorney", "Licensing, and the rules on who may treat whom."),
         ("hipaa-consultant", "HIPAA compliance consultant", "Handling patient data lawfully."),
         ("medical-biller", "Medical billing specialist", "Getting paid by insurers.")],
    ),
    "manufacture": (
        ["manufactur", "factory", "produce", "product design", "prototype", "hardware", "supplier",
         "sourcing", "import", "export", "materials", "assembly"],
        [("industrial-designer", "Industrial designer", "Turning the idea into something that can be made."),
         ("sourcing-agent", "Sourcing agent", "Finding and vetting who makes it."),
         ("customs-broker", "Customs broker", "Getting it across the border legally."),
         ("product-liability-attorney", "Product liability attorney", "Exposure when a physical product reaches the public.")],
    ),
    "hospitality": (
        ["hotel", "motel", "guest", "hostel", "tourism", "tour ", "travel", "concierge", "booking",
         "vacation", "lodging", "event", "venue", "wedding"],
        [("hospitality-consultant", "Hospitality consultant", "Rates, occupancy and how the operation runs."),
         ("tourism-licensing", "Tourism licensing specialist", "Guide and operator licensing where you work.")],
    ),
    "trades": (
        # "electric" alone is a trap: it fires on "electric vehicle" and suggests
        # an electrician's licence for a car-rental app. Trades need the trade word.
        ["landscap", "cleaning", "plumbing", "plumber", "electrician", "electrical contractor",
         "hvac", "roofing", "handyman", "salon", "barber", "spa ", "janitorial", "pest control"],
        [("trade-licensing", "Trade licensing specialist", "The licence and bond the work requires."),
         ("bonding-agent", "Bonding agent", "Surety bonds, usually required before you can bid.")],
    ),
    "education": (
        ["school", "tutor", "course", "training", "teach", "educat", "workshop", "curriculum", "childcare"],
        [("education-attorney", "Education attorney", "Accreditation and rules on who may teach what."),
         ("curriculum-designer", "Curriculum designer", "Turning knowledge into something teachable.")],
    ),
}


def _hits(text, words):
    """Which trigger words appear, so the founder can be shown the evidence."""
    found = []
    for w in words:
        if re.search(r"(?<![a-z])" + re.escape(w.strip()), text):
            found.append(w.strip())
    return found


def professionals_for(title="", body=""):
    """Return the trades an idea likely needs.

    Shape:
        {"always": [...], "matched": [...], "domains": [{"name","evidence"}],
         "summary": "one sentence a person can read"}

    Each professional is {"slug","label","why","domain"}. Nothing here is a
    verdict — the caller should present it as "likely needs".
    """
    text = " " + (str(title) + " " + str(body)).lower() + " "
    matched, domains, seen = [], [], set()

    for name, (words, pros) in DOMAINS.items():
        ev = _hits(text, words)
        if not ev:
            continue
        domains.append({"name": name, "evidence": ev[:6]})
        for slug, label, why in pros:
            if slug in seen:
                continue
            seen.add(slug)
            matched.append({"slug": slug, "label": label, "why": why, "domain": name})

    always = [{"slug": s, "label": l, "why": w, "domain": "any business"} for s, l, w in ALWAYS]

    if matched:
        names = [p["label"] for p in matched[:4]]
        lead = ", ".join(names[:-1]) + " and " + names[-1] if len(names) > 1 else names[0]
        summary = ("This idea likely needs " + lead
                   + " — plus the accountant, attorney, insurance and bookkeeping any business needs.")
    else:
        summary = ("Nothing in this idea points to a particular trade yet, so it starts with "
                   "the four any business needs. Add detail and more will be suggested.")

    return {"always": always, "matched": matched, "domains": domains,
            "summary": summary, "total": len(always) + len(matched)}
