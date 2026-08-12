# -*- coding: utf-8 -*-
"""Read a business idea and work out which professionals it needs.

Version 2. The first version was a flat keyword list, and its failures were
not subtle. The owner posted an essay about an intellectual-property
marketplace in which the word "patent" appears nine times, and the engine
suggested an architect, an interior designer, an appraiser and a tourism
licensing specialist, while offering no patent attorney because it had
never heard of one. Three mechanical faults produced that:

  1. Phrases were invisible. "Intellectual property" matched the trigger
     "property" and fired the real-estate domain. "Provisional patent
     application" matched the prefix "app" and fired tech. "The unlock is
     a legal event" matched "event" and fired hospitality.
  2. One incidental word carried the same force as a theme. A single
     "marketplace" fired the whole retail domain alongside domains the
     text actually was about.
  3. Whole fields were missing: patents and licensing, raising money from
     the public, holding other people's money, hiring.

What changed, and why it fixes those:

  CONSUMPTION. Terms are matched longest first, and matched spans are
  consumed. Once "intellectual property" is claimed by the IP domain,
  there is no bare "property" left for real estate to find.

  SCORING. Every term has a weight (strong 2.0, normal 1.0, weak 0.5).
  A domain's score adds up its distinct matched terms, counts repetition
  gently, and gets a bonus when the theme reaches the title. Domains
  below a floor are dropped instead of shown. A theme is a pattern of
  evidence, not one word.

  TIERS. "likely" is what the text is plainly about. "possible" is a
  defensible reading. The reader sees the difference instead of one
  undifferentiated pile.

Still rules, still not a model, for the same reasons as v1: it runs on
every idea on a $7 box for nothing, every suggestion can show the exact
words that produced it, the owner can edit one table without a key or a
bill, and it gives the same answer twice. It will still miss things. That
is what the evidence line is for: a reader who can see WHY can see WRONG.
"""

import math
import re

# Bump this when the tables or the scoring change. Stored articles carry the
# version they were read with, and the server re-reads any article whose
# stamp is older, so an improvement here reaches old posts by itself.
PM_VERSION = 2

STRONG, NORMAL, WEAK = 2.0, 1.0, 0.5

# Every business needs these, whatever it is. Listed separately so they are
# never presented as if the text was clever enough to deduce them.
ALWAYS = [
    ("accountant", "CPA / accountant", "Entity choice, tax treatment, and what the setup actually costs."),
    ("business-attorney", "Business attorney", "Formation, contracts, and what licences the work requires."),
    ("insurance-broker", "Insurance broker", "The cover the business needs before it can legally trade."),
    ("bookkeeper", "Bookkeeper", "Keeping the books from day one, so the first tax year is not a rescue job."),
]

# domain -> (triggers, professionals)
#
# Trigger convention: lowercase; a TRAILING SPACE means whole word ("lot "
# must not fire on "lots of"); anything else is a prefix ("renovat" catches
# renovate and renovation). Phrases are allowed and, because matching is
# longest-first with consumption, a phrase shields its parts: "intellectual
# property" prevents "property", "of course" prevents "course", "charging a
# fee" never existed as a trigger in the first place.
#
# Weight convention: STRONG words name the field outright (patent, zoning,
# restaurant). NORMAL words are solid but shared (lease, vehicle). WEAK words
# are common English that only counts in a crowd (house, store, platform).
DOMAINS = {
    "intellectual-property": (
        [("picked a name", STRONG), ("anyone else uses", STRONG), ("identical to mine", STRONG), ("name locked down", STRONG), ("copycat", STRONG), ("knockoff", STRONG), ("owns what", STRONG), ("who actually owns", STRONG), ("logo", NORMAL), ("who owns", STRONG), ("ownership", NORMAL), ("patent", STRONG), ("provisional patent", STRONG), ("provisional application", STRONG), ("uspto", STRONG), ("trademark", STRONG), ("copyright", STRONG), ("intellectual property", STRONG), ("infring*", STRONG), ("trade secret", STRONG), ("invention", STRONG), ("inventor", STRONG), ("royalty", STRONG), ("royalties", STRONG), ("license the", STRONG), ("license my", STRONG), ("license our", STRONG), ("license it", STRONG), ("licensing deal", STRONG), ("license", WEAK), ("licence", WEAK), ("licensing", WEAK), ("nda", NORMAL), ("confidentialit*", NORMAL), ("blueprint", WEAK), ("trade dress", STRONG), ("cease and desist", STRONG), ("counterfeit", STRONG), ("licensee", STRONG), ("licensor", STRONG), ("license agreement", STRONG), ("wipo", STRONG)],
        [("patent-attorney", "Patent attorney", "Whether it is patentable, and the filing that holds your place in line."),
         ("ip-attorney", "IP attorney", "Who owns it, and how it is licensed without being lost."),
         ("trademark-attorney", "Trademark attorney", "Securing the name before building on it.")],
    ),
    "fundraising": (
        [("piece of the company", STRONG), ("piece of the business", STRONG), ("stake in", STRONG), ("revenue-sharing", STRONG), ("revenue sharing", STRONG), ("times their money", STRONG), ("revenue-sharing notes", STRONG), ("investor", NORMAL), ("retail investor", STRONG), ("angel investor", STRONG), ("outside investors", STRONG), ("crowdfund*", STRONG), ("securities", STRONG), ("equity", NORMAL), ("venture capital", STRONG), ("fundrais*", STRONG), ("raise money", STRONG), ("raising money", STRONG), ("shareholder", STRONG), ("backer", NORMAL), ("seed round", STRONG), ("pitch deck", NORMAL), ("term sheet", STRONG), ("cap table", STRONG), ("convertible note", STRONG), ("safe note", STRONG), ("series a", STRONG), ("pre-seed", STRONG), ("ipo", STRONG), ("kickstarter", STRONG), ("gofundme", STRONG), ("private placement", STRONG)],
        [("securities-attorney", "Securities attorney", "The moment strangers fund it expecting a return, federal securities law applies.")],
    ),
    "payments": (
        [("escrow", NORMAL), ("escrow service", STRONG), ("hold in escrow", STRONG), ("money transmission", STRONG), ("money transmitter", STRONG), ("payment processing", STRONG), ("hold funds", STRONG), ("holding money", STRONG), ("digital wallet", STRONG), ("mobile wallet", STRONG), ("chargeback", STRONG), ("payout", WEAK), ("wallet", WEAK), ("payment", WEAK), ("refund", WEAK), ("kyc", STRONG), ("aml", STRONG), ("ach", STRONG), ("remittance", STRONG), ("stored value", STRONG), ("merchant account", STRONG), ("payment gateway", STRONG), ("prepaid card", STRONG), ("custodial", STRONG), ("gift card", NORMAL), ("stripe", NORMAL), ("paypal", NORMAL), ("venmo", NORMAL)],
        [("payments-counsel", "Payments counsel", "Holding or moving other people's money is licensed activity in most states.")],
    ),
    "employment": (
        [("as contractors", STRONG), ("part-time", NORMAL), ("day labor", STRONG), ("paying in cash", STRONG), ("w-2 crew", STRONG), ("employee", STRONG), ("payroll", STRONG), ("hiring", NORMAL), ("hire", NORMAL), ("independent contractor", STRONG), ("1099", STRONG), ("w-2", STRONG), ("wage", NORMAL), ("staff", WEAK), ("workers", WEAK), ("workers comp", STRONG), ("workers' compensation", STRONG), ("overtime", STRONG), ("minimum wage", STRONG), ("non-compete", STRONG), ("severance", STRONG), ("misclassif", STRONG), ("gig worker", STRONG), ("at-will", STRONG), ("freelancer", NORMAL), ("background check", NORMAL), ("recruit", WEAK), ("salar", WEAK)],
        [("employment-attorney", "Employment attorney", "Employee or contractor is a legal line with real penalties on the wrong side."),
         ("hr-payroll", "HR and payroll specialist", "Getting people paid, withheld and insured correctly from the first hire.")],
    ),
    "marketing": (
        [("marketing", STRONG), ("advertis*", STRONG), ("seo", STRONG), ("social media", NORMAL), ("customer acquisition", STRONG), ("branding", NORMAL), ("influencer", NORMAL), ("search engine optimization", STRONG), ("google ads", STRONG), ("facebook ads", STRONG), ("ppc", STRONG), ("lead generation", STRONG), ("ad campaign", STRONG), ("landing page", NORMAL), ("newsletter", NORMAL), ("press release", NORMAL), ("instagram", NORMAL), ("tiktok", NORMAL), ("conversion rate", NORMAL)],
        [("marketing-consultant", "Marketing consultant", "Getting customers, measured, without burning the budget.")],
    ),
    "property": (
        [("real estate", STRONG), ("zoning", STRONG), ("renovat*", STRONG), ("remodel*", STRONG), ("apartment", STRONG), ("duplex", STRONG), ("landlord", STRONG), ("tenant", STRONG), ("airbnb", STRONG), ("short-term rental", STRONG), ("vacation rental", STRONG), ("mixed-use", STRONG), ("commercial space", STRONG), ("mortgage", STRONG), ("square feet", NORMAL), ("square foot", NORMAL), ("construction", NORMAL), ("property", NORMAL), ("housing", NORMAL), ("lease", NORMAL), ("storefront", WEAK), ("house", WEAK), ("vacant lot", STRONG), ("corner lot", STRONG), ("title insurance", STRONG), ("closing costs", STRONG), ("hoa", STRONG), ("rental property", STRONG), ("house flipping", STRONG), ("fixer-upper", STRONG), ("coworking", STRONG), ("building permit", STRONG), ("office space", NORMAL), ("down payment", NORMAL), ("warehouse", NORMAL), ("acre", NORMAL)],
        [("real-estate-attorney", "Real estate attorney", "Title, zoning, purchase and lease agreements."),
         ("architect", "Architect", "Drawings, and whether the plan is buildable at all."),
         ("general-contractor", "General contractor", "What the build costs and how long it takes."),
         ("appraiser", "Appraiser", "What it is worth, as opposed to what it is hoped to be worth."),
         ("mortgage-broker", "Mortgage broker", "How the purchase or build is financed."),
         ("interior-designer", "Interior designer", "Layout, finish and how the space actually gets used.")],
    ),
    "food": (
        [("commissary", STRONG), ("permits", WEAK), ("permit", WEAK), ("food permit", STRONG), ("health permit", STRONG), ("restaurant", STRONG), ("cafe", STRONG), ("café", STRONG), ("bakery", STRONG), ("food truck", STRONG), ("brewery", STRONG), ("chef", STRONG), ("grocery", STRONG), ("commercial kitchen", STRONG), ("catering business", STRONG), ("catering company", STRONG), ("catering", NORMAL), ("coffee shop", STRONG), ("coffee truck", STRONG), ("coffee", WEAK), ("dining", NORMAL), ("kitchen", WEAK), ("menu", WEAK), ("meal", WEAK), ("bar", WEAK), ("food", WEAK), ("liquor", STRONG), ("winery", STRONG), ("distillery", STRONG), ("barista", STRONG), ("bartend", STRONG), ("food safety", STRONG), ("health department", STRONG), ("ghost kitchen", STRONG), ("meal prep", STRONG), ("food handler", STRONG), ("farm-to-table", STRONG), ("alcohol", NORMAL), ("takeout", NORMAL), ("cocktail", NORMAL)],
        [("health-permit-consultant", "Health permit consultant", "Health department approval before opening."),
         ("kitchen-designer", "Commercial kitchen designer", "A kitchen that passes inspection and works at service."),
         ("liquor-license-attorney", "Liquor licence attorney", "If anything alcoholic is served."),
         ("food-safety-trainer", "Food safety trainer", "Required certification for staff.")],
    ),
    "transport": (
        [("boat", WEAK), ("rideshare", STRONG), ("trucking", STRONG), ("fleet", STRONG), ("courier", STRONG), ("taxi", STRONG), ("limo", STRONG), ("shuttle", STRONG), ("charter bus", STRONG), ("boat charter", STRONG), ("charter service", STRONG), ("hire a car", STRONG), ("car hire", STRONG), ("delivery service", STRONG), ("delivery drivers", STRONG), ("food delivery", STRONG), ("logistics company", STRONG), ("ev charging", STRONG), ("charging station", STRONG), ("driver", WEAK), ("vehicle", WEAK), ("van", WEAK), ("car", WEAK), ("delivery", WEAK), ("logistics", WEAK), ("transport", WEAK), ("freight", STRONG), ("cdl", STRONG), ("chauffeur", STRONG), ("towing", STRONG), ("last-mile", STRONG), ("dot number", STRONG), ("moving company", STRONG), ("dispatch", NORMAL), ("uber", NORMAL), ("lyft", NORMAL), ("doordash", NORMAL)],
        [("commercial-insurance-broker", "Commercial auto insurance broker", "Commercial cover, because personal policies do not apply."),
         ("transport-attorney", "Transportation attorney", "Operating authority, permits and driver classification."),
         ("fleet-manager", "Fleet manager", "Maintenance, scheduling and cost per mile.")],
    ),
    "retail": (
        [("ship", WEAK), ("orders", WEAK), ("e-commerce", STRONG), ("ecommerce", STRONG), ("online store", STRONG), ("online storefront", STRONG), ("hardware store", STRONG), ("dropship*", STRONG), ("merchandise", STRONG), ("subscription box", STRONG), ("inventory", NORMAL), ("retail", NORMAL), ("wholesale", NORMAL), ("boutique", NORMAL), ("sell products", NORMAL), ("marketplace", WEAK), ("shop", WEAK), ("shipping", WEAK), ("hardware", WEAK), ("shopify", STRONG), ("etsy", STRONG), ("sku", STRONG), ("consignment", STRONG), ("pop-up shop", STRONG), ("brick-and-mortar", STRONG), ("vending machine", STRONG), ("direct-to-consumer", STRONG), ("d2c", STRONG), ("clothing line", STRONG), ("thrift", STRONG), ("fulfillment", NORMAL), ("point of sale", NORMAL), ("packaging", NORMAL), ("apparel", NORMAL)],
        [("sales-tax-cpa", "Sales tax specialist", "Where you owe sales tax, which is rarely only your own state."),
         ("trademark-attorney", "Trademark attorney", "Securing the name before building on it."),
         ("logistics-consultant", "Logistics consultant", "Getting stock in and orders out."),
         ("packaging-designer", "Packaging designer", "What the customer physically receives.")],
    ),
    "tech": (
        [("software", STRONG), ("saas", STRONG), ("mobile app", STRONG), ("web app", STRONG), ("api", STRONG), ("algorithm", STRONG), ("machine learning", STRONG), ("crypto", STRONG), ("blockchain", STRONG), ("app", NORMAL), ("ai", NORMAL), ("website", NORMAL), ("automation", NORMAL), ("platform", WEAK), ("data", WEAK), ("online", WEAK), ("artificial intelligence", STRONG), ("cybersecurity", STRONG), ("gdpr", STRONG), ("ccpa", STRONG), ("privacy policy", STRONG), ("software developer", STRONG), ("app store", NORMAL), ("terms of service", NORMAL), ("encryption", NORMAL), ("chatbot", NORMAL), ("open source", NORMAL), ("hosting", NORMAL), ("database", NORMAL), ("no-code", NORMAL)],
        [("software-engineer", "Software engineer", "What it costs to build and to keep running."),
         ("privacy-counsel", "Privacy counsel", "What you may collect and what you must disclose."),
         ("ip-attorney", "IP attorney", "Who owns the code, and what can be protected.")],
    ),
    "health": (
        [("clinic", STRONG), ("medical", STRONG), ("healthcare", STRONG), ("patients", STRONG), ("patient", NORMAL), ("telehealth", STRONG), ("dental", STRONG), ("pharmacy", STRONG), ("nursing", STRONG), ("concierge medicine", STRONG), ("therapist", NORMAL), ("therapy", WEAK), ("wellness", WEAK), ("concierge", WEAK), ("hipaa", STRONG), ("mental health", STRONG), ("physical therapy", STRONG), ("chiropract", STRONG), ("med spa", STRONG), ("home health", STRONG), ("senior care", STRONG), ("prescription", STRONG), ("medical device", STRONG), ("psycholog", STRONG), ("counseling", NORMAL), ("nurse", NORMAL)],
        [("healthcare-attorney", "Healthcare attorney", "Licensing, and the rules on who may treat whom."),
         ("hipaa-consultant", "HIPAA compliance consultant", "Handling patient data lawfully."),
         ("medical-biller", "Medical billing specialist", "Getting paid by insurers.")],
    ),
    "manufacture": (
        [("customs", STRONG), ("tariff", STRONG), ("overseas", NORMAL), ("port", WEAK), ("manufactur*", STRONG), ("factory", STRONG), ("product design", STRONG), ("injection mold*", STRONG), ("prototype", NORMAL), ("sourcing", NORMAL), ("supplier", NORMAL), ("import", NORMAL), ("export", NORMAL), ("hardware", WEAK), ("assembly", WEAK), ("materials", WEAK), ("3d print", STRONG), ("cnc", STRONG), ("supply chain", STRONG), ("bill of materials", STRONG), ("oem", STRONG), ("alibaba", NORMAL), ("tooling", NORMAL), ("handmade", NORMAL), ("textile", NORMAL), ("woodworking", NORMAL)],
        [("industrial-designer", "Industrial designer", "Turning the idea into something that can be made."),
         ("sourcing-agent", "Sourcing agent", "Finding and vetting who makes it."),
         ("customs-broker", "Customs broker", "Getting it across the border legally."),
         ("product-liability-attorney", "Product liability attorney", "Exposure when a physical product reaches the public.")],
    ),
    "hospitality": (
        [("boat", NORMAL), ("lodge", WEAK), ("visitors", WEAK), ("fishing charter", STRONG), ("charter fishing", STRONG), ("guide", NORMAL), ("hotel", STRONG), ("motel", STRONG), ("hostel", STRONG), ("tourism", STRONG), ("tourist", STRONG), ("event venue", STRONG), ("event planning", STRONG), ("wedding", STRONG), ("tour", NORMAL), ("lodging", WEAK), ("vacation", WEAK), ("concierge", WEAK), ("guest", WEAK), ("travel", WEAK), ("booking", WEAK), ("hospitality", STRONG), ("bed and breakfast", STRONG), ("vrbo", STRONG), ("glamping", STRONG), ("campground", STRONG), ("banquet", STRONG), ("nightly rate", STRONG), ("travel agency", STRONG), ("resort", NORMAL), ("occupancy", WEAK), ("venue", WEAK), ("itinerar", NORMAL)],
        [("hospitality-consultant", "Hospitality consultant", "Rates, occupancy and how the operation runs."),
         ("tourism-licensing", "Tourism licensing specialist", "Guide and operator licensing where you work.")],
    ),
    "trades": (
        [("landscaping", STRONG), ("landscaper", STRONG), ("lawn care", STRONG), ("plumbing", STRONG), ("plumber", STRONG), ("electrician", STRONG), ("electrical contractor", STRONG), ("hvac", STRONG), ("roofing", STRONG), ("handyman", STRONG), ("janitorial", STRONG), ("pest control", STRONG), ("salon", STRONG), ("barber", STRONG), ("spa", NORMAL), ("cleaning", WEAK), ("carpentr", STRONG), ("flooring", STRONG), ("welding", STRONG), ("drywall", STRONG), ("locksmith", STRONG), ("snow removal", STRONG), ("pressure washing", STRONG), ("power washing", STRONG), ("mechanic", STRONG), ("auto repair", STRONG), ("tattoo", STRONG), ("cosmetolog", STRONG), ("gutter", WEAK), ("painting", WEAK)],
        [("trade-licensing", "Trade licensing specialist", "The licence and bond the work requires."),
         ("bonding-agent", "Bonding agent", "Surety bonds, usually required before you can bid.")],
    ),
    "education": (
        [("tutor", STRONG), ("tutoring", STRONG), ("curriculum", STRONG), ("childcare", STRONG), ("daycare", STRONG), ("online course", STRONG), ("training course", STRONG), ("charter school", STRONG), ("students", WEAK), ("workshop", WEAK), ("teach", WEAK), ("school", WEAK), ("bootcamp", STRONG), ("e-learning", STRONG), ("montessori", STRONG), ("preschool", STRONG), ("summer camp", STRONG), ("after-school", STRONG), ("tuition", STRONG), ("webinar", NORMAL), ("enroll", NORMAL), ("lms", NORMAL), ("coaching", NORMAL)],
        [("education-attorney", "Education attorney", "Accreditation and rules on who may teach what."),
         ("curriculum-designer", "Curriculum designer", "Turning knowledge into something teachable.")],
    ),
    "cannabis": (
        [("cannabis", STRONG), ("marijuana", STRONG), ("dispensary", STRONG), ("cbd", STRONG), ("thc", STRONG), ("hemp", STRONG), ("edibles", STRONG)],
        [("cannabis-attorney", "Cannabis licensing attorney", "State licensing, and rules that change by the month."),
         ("cannabis-cpa", "Cannabis-specialist CPA", "Section 280E disallows ordinary deductions; normal accounting advice is wrong here.")],
    ),
    "gambling-gaming": (
        [("casino", STRONG), ("gambling", STRONG), ("betting", STRONG), ("sportsbook", STRONG), ("lottery", STRONG), ("raffle", STRONG), ("sweepstakes", STRONG), ("wager", STRONG)],
        [("gaming-attorney", "Gaming and gambling attorney", "State gaming licences before anything takes a bet."),
         ("promotions-counsel", "Sweepstakes and promotions counsel", "Raffles and giveaways are regulated even as marketing.")],
    ),
    "franchising": (
        [("franchise", STRONG), ("franchisee", STRONG), ("franchisor", STRONG), ("fdd", STRONG)],
        [("franchise-attorney", "Franchise attorney", "The FDD, before signing or before selling one.")],
    ),
    "nonprofit": (
        [("nonprofit", STRONG), ("non-profit", STRONG), ("501c3", STRONG), ("501(c)(3)", STRONG), ("charity", STRONG), ("charitable", STRONG), ("donation", STRONG), ("donor", STRONG)],
        [("nonprofit-attorney", "Nonprofit attorney", "Formation and tax-exempt status done in the right order."),
         ("grant-writer", "Grant writer", "Money that does not have to be paid back, if the paperwork is right.")],
    ),
    "lending-credit": (
        [("lending", STRONG), ("microloan", STRONG), ("buy now pay later", STRONG), ("bnpl", STRONG), ("interest rate", STRONG), ("installment", STRONG), ("credit repair", STRONG), ("loan", STRONG)],
        [("lending-attorney", "Consumer-lending attorney", "Usury caps and state lender licensing before the first loan.")],
    ),
    "regulated-products": (
        [("supplement", STRONG), ("cosmetic", STRONG), ("skincare", STRONG), ("vape", STRONG), ("nicotine", STRONG), ("tobacco", STRONG), ("nutraceutical", STRONG), ("fda", STRONG)],
        [("fda-consultant", "FDA regulatory consultant", "Which category the product falls into, and what that requires."),
         ("labeling-attorney", "Labeling and claims attorney", "What the package and the ads may lawfully say.")],
    ),
    "fitness-recreation": (
        [("gym", STRONG), ("fitness", STRONG), ("personal training", STRONG), ("personal trainer", STRONG), ("yoga", STRONG), ("pilates", STRONG), ("martial arts", STRONG), ("crossfit", STRONG), ("waiver", STRONG)],
        [("liability-attorney", "Liability attorney", "Waivers and releases that actually hold up.")],
    ),
    "pets-animals": (
        [("grooming", STRONG), ("kennel", STRONG), ("dog walking", STRONG), ("veterinar*", STRONG), ("pet", STRONG), ("pets", STRONG), ("animal boarding", STRONG)],
        [("animal-licensing", "Animal facility licensing specialist", "Kennel and boarding permits before the first guest dog.")],
    ),
    "agriculture": (
        [("farming", STRONG), ("livestock", STRONG), ("crops", STRONG), ("greenhouse", STRONG), ("usda", STRONG), ("organic certification", STRONG), ("poultry", STRONG), ("ranch", STRONG)],
        [("agricultural-attorney", "Agricultural attorney", "USDA rules, land use and water rights.")],
    ),
    "firearms": (
        [("firearm", STRONG), ("ammunition", STRONG), ("ffl", STRONG), ("gun shop", STRONG), ("gun range", STRONG), ("shooting range", STRONG)],
        [("firearms-attorney", "Firearms licensing attorney", "A federal FFL plus state and local overlays.")],
    ),
    "immigration-hiring": (
        [("immigration", STRONG), ("work visa", STRONG), ("h-1b", STRONG), ("h1b", STRONG), ("visa sponsorship", STRONG), ("foreign workers", STRONG)],
        [("immigration-attorney", "Immigration attorney", "Sponsoring or employing non-citizens lawfully.")],
    ),
    "insurance-sales": (
        [("insurance agency", STRONG), ("sell insurance", STRONG), ("insurance brokerage", STRONG), ("policyholder", STRONG)],
        [("insurance-regulatory-attorney", "Insurance regulatory attorney", "Selling insurance is licensed in every state.")],
    ),
    "environmental-waste": (
        [("recycling", STRONG), ("waste disposal", STRONG), ("hazardous waste", STRONG), ("junk removal", STRONG), ("composting", STRONG)],
        [("environmental-consultant", "Environmental compliance consultant", "Disposal permits and EPA rules.")],
    ),
}


# slug -> terms that must appear in the matched evidence before this
# professional is suggested. A domain firing does not mean every professional
# in it applies: a bakery is food, but a liquor attorney needs liquor.
REQUIRES = {
    "liquor-license-attorney": {"liquor", "alcohol", "wine", "beer", "brewery",
                                "distillery", "winery", "cocktail", "bartend",
                                "bar", "taproom"},
    "kitchen-designer": {"commercial kitchen", "restaurant", "cafe", "café",
                         "bakery", "ghost kitchen"},
    # The panel's ruling on the beat producer whose friends said "patent your
    # sound": bare "patent" is not invention context. The word alone caps the
    # domain evidence; this professional needs the real thing.
    "patent-attorney": {"provisional patent", "provisional application",
                        "invention", "inventor", "uspto", "prototype"},
    "trademark-attorney": {"trademark", "logo", "brand name", "copycat",
                           "knockoff", "branding", "picked a name",
                           "anyone else uses", "identical to mine",
                           "name locked down"},
    "architect": {"renovat*", "remodel*", "construction", "zoning",
                  "square feet", "square foot", "mixed-use", "duplex",
                  "apartment", "building permit", "addition"},
    "general-contractor": {"renovat*", "remodel*", "construction", "zoning",
                           "square feet", "square foot", "mixed-use", "duplex",
                           "apartment", "building permit", "buildout",
                           "build-out", "fixer-upper", "house flipping"},
    "interior-designer": {"renovat*", "remodel*", "interior", "airbnb",
                          "short-term rental", "vacation rental", "staging",
                          "apartment", "duplex"},
    "appraiser": {"appraisal", "mortgage", "purchase", "refinance",
                  "house flipping", "fixer-upper", "duplex", "apartment",
                  "under contract"},
    "mortgage-broker": {"mortgage", "down payment", "refinance", "purchase",
                        "under contract", "closing costs", "duplex",
                        "house flipping", "fixer-upper"},
    "customs-broker": {"import", "export", "customs", "overseas", "port",
                       "alibaba", "tariff"},
    "sourcing-agent": {"sourcing", "supplier", "import", "alibaba",
                       "overseas", "factory"},
    "industrial-designer": {"product design", "prototype", "injection mold*",
                            "manufactur*", "factory", "cnc", "3d print",
                            "tooling"},
    "tourism-licensing": {"tour", "tours", "tourism", "tourist", "guide",
                          "fishing charter", "charter fishing", "boat",
                          "travel agency"},
    "hipaa-consultant": {"patients", "patient", "hipaa", "health histories",
                         "medical records", "intake forms", "telehealth",
                         "clinic", "therapy", "therapist", "mental health"},
    "curriculum-designer": {"curriculum", "lesson plan", "lesson plans",
                            "workbook", "workbooks", "course materials",
                            "online course", "training course"},
    "education-attorney": {"childcare", "daycare", "preschool", "accredit",
                           "accreditation", "montessori", "tuition",
                           "summer camp", "charter school"},
    "medical-biller": {"insurance", "insurers", "billing", "superbill",
                       "reimbursement", "medicare", "medicaid", "patients"},
}


# Scoring floors. A domain below POSSIBLE_FLOOR is noise and is dropped;
# between the floors it is a defensible reading; at LIKELY_FLOOR and above
# the text is plainly about it. One normal word seen once scores 1.0 and is
# dropped, which is the fate the single "marketplace" deserved. One strong
# word seen once scores 2.0 and surfaces as possible, which is what a single
# mention of "patent" deserves.
LIKELY_FLOOR = 3.0
POSSIBLE_FLOOR = 1.5
TITLE_BONUS = 1.5


def _pattern(term):
    """Whole word by default, with an optional plural. Prefix only on request.

    The first draft matched prefixes by default, and the audit tore it
    apart with ordinary English: "fleeting" fired fleet, "patently" fired
    patent, "tutorials" fired tutor, "important" fired import,
    "constructive" fired construct. So the polarity flipped. A term ending
    in * is a deliberate prefix (renovat* catches renovate, renovation,
    renovating). Everything else matches the exact word or its simple
    plural, and nothing more.
    """
    if term.endswith("*"):
        return re.compile(r"(?<![a-z0-9])" + re.escape(term[:-1]))
    stem = re.escape(term.strip())
    return re.compile(r"(?<![a-z0-9])" + stem + r"(?:s|es)?(?![a-z0-9])")


# Phrases that are consumed and score nothing, because they are ordinary
# English wearing a trigger word. "brand new" must never count for brand,
# "a lot" must never count for a building lot.
SHIELDS = [("medical supply", 0.0), ("medical supplies", 0.0), ("surgical kits", 0.0), ("brand new", 0.0), ("a lot", 0.0), ("lots of", 0.0), ("recipe for success", 0.0), ("secret sauce", 0.0), ("menu of options", 0.0), ("fast lane", 0.0), ("wages war", 0.0), ("food for thought", 0.0), ("old school", 0.0), ("school of thought", 0.0), ("retail therapy", 0.0), ("royalty-free", 0.0), ("coffee table", 0.0), ("over coffee", 0.0), ("in-house", 0.0), ("new lease on life", 0.0), ("multi-tenant", 0.0), ("guest checkout", 0.0), ("guest post", 0.0), ("data cleaning", 0.0), ("backend plumbing", 0.0), ("product tour", 0.0), ("tour of the app", 0.0), ("sweat equity", 0.0), ("home equity", 0.0), ("brand equity", 0.0), ("investment vehicle", 0.0), ("mother of invention", 0.0), ("blueprint for", 0.0), ("marketing materials", 0.0), ("training materials", 0.0), ("medical-grade", 0.0), ("paying my mortgage", 0.0), ("pay my mortgage", 0.0), ("catering to", 0.0), ("high bar", 0.0), ("progress bar", 0.0), ("bar exam", 0.0), ("lodging a complaint", 0.0), ("lodging complaints", 0.0), ("half-baked", 0.0), ("driver of", 0.0), ("main driver", 0.0), ("key driver", 0.0)]


def _consume(text, terms):
    """Match every term against the text, longest first, consuming spans.

    Returns {term: count}. Consumption is the phrase shield: once a longer
    term has claimed a span, no shorter term can match inside it, so
    "intellectual property" leaves nothing behind for "property".
    """
    buf = list(text)
    counts = {}
    # A negator anywhere earlier in the clause negates the term: "we don't
    # write any curriculum of our own" is a disclaimer, not a need. The
    # window stops at sentence punctuation so a negative sentence cannot
    # bleed into the next one.
    neg = re.compile(r"(?:\bno|\bnot|n't|\bnever|\bwithout|\bzero)\b(?![^.!?;]*[.!?;])[^.!?;]*$")
    for term, _w in sorted(terms, key=lambda t: -len(t[0].strip())):
        pat = _pattern(term)
        n = 0
        for m in pat.finditer("".join(buf)):
            # "There's no app, no software, no tech anything" is a person
            # saying what their business is NOT. A negated mention is
            # consumed so nothing shorter can claim it, but it scores zero.
            negated = bool(neg.search(text[max(0, m.start() - 40):m.start()]))
            if not negated:
                n += 1
            for i in range(m.start(), m.end()):
                buf[i] = "\x01"
        if n:
            counts[term] = n
    return counts


def _score(counts, title_counts, weights):
    """One domain's score, and the evidence that produced it."""
    score = 0.0
    evidence = []
    for term, n in sorted(counts.items(), key=lambda kv: (-weights[kv[0]] * kv[1], kv[0])):
        contrib = weights[term] * (1 + 0.4 * min(n - 1, 3))
        score += contrib
        # a reader gets the word, never the stem marker
        evidence.append(term.strip().rstrip("*") + (" ×%d" % n if n > 1 else ""))
    in_title = any(t in title_counts for t in counts)
    if counts and in_title:
        score += TITLE_BONUS
        evidence.insert(0, "named in the title")
    return score, evidence


def professionals_for(title="", body=""):
    """Return the trades an idea likely needs, with the evidence.

    Shape (superset of v1, so stored v1 results still render):
      {"always": [...], "matched": [...], "domains": [...],
       "summary": str, "total": int, "version": PM_VERSION}
    matched entries carry tier: "likely" or "possible". domains carry
    score, tier and the evidence terms with their counts.
    """
    title_l = " " + str(title).lower() + " "
    text = title_l + " " + str(body).lower() + " "

    # One consumption pass over ALL terms from ALL domains together, so the
    # longest phrase wins regardless of which domain owns it.
    all_terms = list(SHIELDS)
    owner = {}
    weights = {}
    for name, (terms, _pros) in DOMAINS.items():
        for term, w in terms:
            all_terms.append((term, w))
            owner.setdefault(term, []).append(name)
            weights[term] = max(weights.get(term, 0), w)
    body_counts = _consume(text, all_terms)
    title_counts = _consume(title_l, all_terms)

    scored = []
    for name, (terms, pros) in DOMAINS.items():
        mine = {t: n for t, n in body_counts.items()
                if name in owner.get(t, ()) and any(t == tt for tt, _ in terms)}
        if not mine:
            continue
        score, evidence = _score(mine, title_counts, weights)
        if score < POSSIBLE_FLOOR:
            continue
        # A pile of weak words can add up to a big number without the text
        # ever naming the field. "Likely" requires at least one strong term
        # or the theme reaching the title; anything else caps at possible.
        has_strong = any(weights[t] >= STRONG for t in mine)
        in_title = any(t in title_counts for t in mine)
        tier = ("likely" if score >= LIKELY_FLOOR and (has_strong or in_title)
                else "possible")
        scored.append({"name": name, "score": round(score, 2),
                       "tier": tier, "evidence": evidence[:6], "pros": pros})
    scored.sort(key=lambda d: -d["score"])

    matched, seen = [], set()
    for d in scored:
        ev_terms = set()
        for name2, (terms2, _p2) in DOMAINS.items():
            if name2 == d["name"]:
                ev_terms = {t for t, _w in terms2 if t in body_counts}
        for slug, label, why in d["pros"]:
            if slug in seen:
                continue
            need = REQUIRES.get(slug)
            if need and not (need & ev_terms):
                continue
            seen.add(slug)
            matched.append({"slug": slug, "label": label, "why": why,
                            "domain": d["name"], "tier": d["tier"]})

    # The panel's three cross-cutting rules.
    #
    # LICENSOR CAP: someone licensing a design OUT is not importing or
    # manufacturing anything, whatever nouns the pitch used while saying so.
    # The manufacturing chain can still appear, one tier down, evidence
    # visible, where it is cheap to dismiss.
    LICENSOR = {"license the", "license my", "license our", "license it",
                "licensing deal", "royalty", "royalties"}
    if LICENSOR & set(body_counts):
        for m in matched:
            if m["slug"] in ("customs-broker", "sourcing-agent",
                             "industrial-designer") and m["tier"] == "likely":
                m["tier"] = "possible"

    # COMPANIONS: some trades imply another one the text never names.
    # A guided-experience business that needs tourism licensing is carrying
    # paying passengers; childcare is licensed and inspected by the state.
    seen_slugs = {m["slug"] for m in matched}
    if "tourism-licensing" in seen_slugs and "commercial-insurance-broker" not in seen_slugs:
        t = next(m["tier"] for m in matched if m["slug"] == "tourism-licensing")
        matched.append({"slug": "commercial-insurance-broker",
                        "label": "Commercial auto insurance broker",
                        "why": "Taking paying passengers is commercial exposure a personal policy will not cover.",
                        "domain": "hospitality", "tier": t})
    if {"childcare", "daycare", "preschool"} & set(body_counts) and "trade-licensing" not in seen_slugs:
        matched.append({"slug": "trade-licensing",
                        "label": "Trade licensing specialist",
                        "why": "Childcare runs on a state licence and inspections before the first child arrives.",
                        "domain": "education", "tier": "likely"})

    always = [{"slug": s, "label": l, "why": w, "domain": "any business"}
              for s, l, w in ALWAYS]

    likely = [p["label"] for p in matched if p["tier"] == "likely"]
    if likely:
        head = likely[:4]
        lead = ", ".join(head[:-1]) + " and " + head[-1] if len(head) > 1 else head[0]
        summary = ("This idea likely needs " + lead
                   + ", plus the accountant, attorney, insurance and bookkeeping any business needs.")
    elif matched:
        summary = ("Nothing here is certain, but the text touches "
                   + matched[0]["label"].lower()
                   + " territory. It starts with the four every business needs.")
    else:
        summary = ("Nothing in this idea points to a particular trade yet, so it starts with "
                   "the four any business needs. Add detail and more will be suggested.")

    return {"always": always, "matched": matched,
            "domains": [{"name": d["name"], "score": d["score"], "tier": d["tier"],
                         "evidence": d["evidence"]} for d in scored],
            "summary": summary, "total": len(always) + len(matched),
            "version": PM_VERSION}
