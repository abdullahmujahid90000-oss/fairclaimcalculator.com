/**
 * State-by-state total-loss law facts, one record per state (50 + D.C.).
 *
 * Research: 2026-11-21, recorded in research/state-total-loss-thresholds.md.
 * Each record was built from the state's statute or regulation as published
 * on the official legislature/agency site (read through search excerpts of
 * those pages), checked against agency guidance and, for recent changes,
 * trade press. `check: "unconfirmed"` marks states where the core rule could
 * not be confirmed in the official wording; those pages stay noindex (see
 * src/lib/seo/indexing.mjs) and say so on the page.
 *
 * Writing rule: everything here is paraphrased in plain English. No fees,
 * phone numbers or processing times (they change often and were not all
 * confirmed). Nothing goes in a record unless the research supports it.
 */

export const THRESHOLD_FACTS_CHECKED = "2026-11-21";
export const THRESHOLD_FACTS_NEXT_REVIEW = "2027-05-21";

/** What the law governs. */
export type LawKind = "title" | "insurer" | "both";

export interface Link {
  name: string;
  url: string;
}

export interface StateChange {
  /** ISO date (YYYY-MM-DD, or YYYY when only the year is known) the change took effect, or the date of the event. */
  date: string;
  /** Plain-English summary. */
  text: string;
  /** "enacted" changes the law; "failed" is a bill that did not pass; "agency" is a procedure change. */
  status: "enacted" | "failed" | "agency";
  source: Link;
}

export interface StateLawFacts {
  /** What the law says, 1–3 sentences, plain English. */
  lawSays: string;
  /** What the percentage or test is measured against, as a phrase ("its retail value from a pricing guide"). */
  measuredAgainst?: string;
  kind: LawKind;
  /** Statute or regulation citation and a link to its text. */
  cite: Link;
  /** State-specific limits, exclusions and quirks. */
  details: string[];
  /** Keeping the car: what the owner has to do. */
  keeping: string;
  /** Title brands the state uses. */
  brands: string[];
  /** Agency that handles salvage and rebuilt titles. */
  titleAgency: Link;
  /** Insurance regulator (complaints). */
  regulator: Link;
  changes: StateChange[];
  /** Where popular threshold lists get this state wrong, if they do. */
  listsSay?: string;
  check: "confirmed" | "unconfirmed";
}

export const STATE_LAW_FACTS: Record<string, StateLawFacts> = {
  Alabama: {
    lawSays:
      "A car becomes salvage in Alabama when an insurer (or anyone else) pays a settlement for damage equal to at least 75% of its fair retail value before the loss. The owner then has 72 hours to apply for a salvage certificate of title.",
    measuredAgainst: "its fair retail value before the damage, from a recognized pricing guide",
    kind: "title",
    cite: { name: "Ala. Code § 32-8-87", url: "https://alison.legislature.state.al.us/code-of-alabama?section=32-8-87" },
    details: [
      "The rule is written around the settlement: it is the payment for damage at or above 75% that triggers the salvage title.",
      "A salvage car cannot be registered or driven until it is rebuilt, inspected and issued a rebuilt title.",
    ],
    keeping:
      "You can keep the car, but you must apply for a salvage title within 72 hours of the total loss. After repairs, the Department of Revenue inspects the car before it issues a rebuilt title.",
    brands: ["Salvage", "Rebuilt", "Parts only"],
    titleAgency: { name: "Alabama Department of Revenue, Motor Vehicle Division", url: "https://www.revenue.alabama.gov/motor-vehicle/salvage-and-rebuilt-vehicles/" },
    regulator: { name: "Alabama Department of Insurance", url: "https://aldoi.gov/" },
    changes: [
      {
        date: "2025-04-10",
        text: "SB 96 passed, letting Alabama owners get an Alabama salvage title when the car was declared a total loss in another state.",
        status: "enacted",
        source: { name: "Alabama SB 96 (2025), enrolled text on LegiScan", url: "https://legiscan.com/AL/text/SB96/id/3199043/Alabama-2025-SB96-Enrolled.pdf" },
      },
    ],
    listsSay:
      "Popular lists show 75%, which is right. They rarely mention that the figure is measured against retail value from a pricing guide, or that it decides the title brand rather than when an insurer must total the car.",
    check: "confirmed",
  },
  Alaska: {
    lawSays:
      "Alaska sets no percentage. A Division of Motor Vehicles regulation treats a car as a constructive total loss when repairs would cost more than the car is worth or its insured value, and an insurer that takes such a car must mark the title \"junk\".",
    measuredAgainst: "what the car is worth, or its insured value",
    kind: "title",
    cite: { name: "2 AAC 92.170", url: "https://www.law.cornell.edu/regulations/alaska/2-AAC-92.170" },
    details: [
      "The test compares the repair cost alone with the car's worth. There is no salvage-value term, so it is stricter than the Total Loss Formula.",
      "A car restored to street-legal condition gets a \"reconstructed\" brand on its title and registration.",
    ],
    keeping:
      "You can keep the car. Since August 1, 2025 the DMV can issue a \"Salvage\" title for a junk-branded car that has not been rebuilt, which makes it easier to sell or move. Once it is restored, it is retitled as reconstructed.",
    brands: ["Junk", "Salvage", "Reconstructed"],
    titleAgency: { name: "Alaska Division of Motor Vehicles", url: "https://dmv.alaska.gov/vehicle-services/salvage-vehicle-titles/" },
    regulator: { name: "Alaska Division of Insurance", url: "https://www.commerce.alaska.gov/web/ins/" },
    changes: [
      {
        date: "2025-08-01",
        text: "The DMV began issuing \"Salvage\" titles for junk-branded cars that have not been reconstructed.",
        status: "agency",
        source: { name: "Alaska DMV, Salvage Vehicle Titles", url: "https://dmv.alaska.gov/vehicle-services/salvage-vehicle-titles/" },
      },
    ],
    listsSay:
      "Most lists call Alaska a Total Loss Formula state. The DMV rule compares repair cost alone with the car's value, so in practice the insurer's own method decides most claims.",
    check: "confirmed",
  },
  Arizona: {
    lawSays:
      "Arizona has no percentage. A car is salvage when its owner or insurer considers it uneconomical to repair, and the statute leaves that judgment to them. After a total-loss settlement the title becomes a salvage title.",
    kind: "title",
    cite: { name: "A.R.S. § 28-2091", url: "https://www.azleg.gov/ars/28/02091.htm" },
    details: [
      "Arizona also issues separate \"nonrepairable\" and \"stolen vehicle\" titles.",
      "A rebuilt car needs a Level III inspection by a certified ADOT officer before it can get a restored salvage title and be registered.",
    ],
    keeping:
      "You can keep the car on a salvage title. It can only be driven after repair, a Level III inspection and a restored salvage title, apart from short trips on a temporary permit.",
    brands: ["Salvage", "Restored salvage", "Nonrepairable"],
    titleAgency: { name: "Arizona Department of Transportation, Motor Vehicle Division", url: "https://azdot.gov/salvage-vehicles" },
    regulator: { name: "Arizona Department of Insurance and Financial Institutions", url: "https://difi.az.gov/" },
    changes: [],
    listsSay:
      "Lists call Arizona a Total Loss Formula state. The statute uses no formula; it leaves the call to the owner or insurer. The formula describes how many insurers decide, not what the law requires.",
    check: "confirmed",
  },
  Arkansas: {
    lawSays:
      "A car is salvage in Arkansas when a collision, theft, flood, storm or similar event causes damage of at least 70% of its average retail value, and the title must be branded.",
    measuredAgainst: "its average retail value in a pricing guide approved by the state",
    kind: "title",
    cite: { name: "Ark. Code § 27-14-2301 et seq.", url: "https://law.justia.com/codes/arkansas/title-27/subtitle-2/chapter-14/subchapter-23/section-27-14-2301/" },
    details: [
      "Cars more than seven model years old before the year of the damage are exempt if they were registered in Arkansas at the time.",
      "That age exemption does not wipe out a brand from another state: an out-of-state salvage brand carries over whatever the car's age.",
    ],
    keeping:
      "You can keep the car with a salvage-branded title. After repair, you file the state's affidavit of reconstruction and, once the car is inspected, it gets a title branded \"Rebuilt\".",
    brands: ["Salvage", "Rebuilt", "Parts only"],
    titleAgency: { name: "Arkansas DFA Office of Motor Vehicle", url: "https://www.dfa.arkansas.gov/office/motor-vehicle/motor-vehicle-forms/" },
    regulator: { name: "Arkansas Insurance Department", url: "https://insurance.arkansas.gov/" },
    changes: [],
    listsSay: "Lists show 70%, which matches, but most leave out the seven-model-year exemption.",
    check: "confirmed",
  },
  California: {
    lawSays:
      "California has no percentage. Vehicle Code § 544 defines a total loss salvage vehicle as one its owner or insurer judges uneconomical to repair, or one on which an insurer paid an agreed total-loss settlement. The insurer must report it to the DMV.",
    kind: "title",
    cite: { name: "Cal. Veh. Code § 544", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=VEH&sectionNum=544" },
    details: [
      "An unrecovered stolen car is not a total loss salvage vehicle under DMV guidance.",
      "If you sell a car with total loss salvage status, you must tell the buyer.",
    ],
    keeping:
      "You can keep the car; the DMV record shows it as salvage retained. To drive it again you go through the revived salvage process, which includes a CHP vehicle verification and, since 2024, a Bureau of Automotive Repair safety systems inspection. The title is then branded salvage.",
    brands: ["Salvage (revived salvage)", "Nonrepairable", "Junk"],
    titleAgency: { name: "California DMV", url: "https://dmv.ca.gov/portal/vehicle-registration/new-registration/junk-revived-salvage-vehicles/" },
    regulator: { name: "California Department of Insurance", url: "https://www.insurance.ca.gov/" },
    changes: [
      {
        date: "2024-09-27",
        text: "The Bureau of Automotive Repair's Vehicle Safety Systems Inspection replaced the old brake and lamp certificates for revived salvage cars.",
        status: "agency",
        source: { name: "Bureau of Automotive Repair, fall 2024 newsletter", url: "https://www.bar.ca.gov/arsc/newsletters/newsletter/fall-2024/vehicle-safety-system-inspections-begin-statewide" },
      },
    ],
    listsSay:
      "Most lists put California under the Total Loss Formula. The Vehicle Code has no formula; it relies on the owner's or insurer's judgment, and insurers then apply their own method.",
    check: "confirmed",
  },
  Colorado: {
    lawSays:
      "A car is salvage in Colorado when the cost to repair it is more than its retail fair market value just before the damage. That is effectively a 100% test, applied by the owner or the insurer acting for the owner.",
    measuredAgainst: "its retail fair market value just before the damage, from sources the insurance industry generally accepts",
    kind: "title",
    cite: { name: "C.R.S. § 42-6-102(17)", url: "https://leg.colorado.gov/colorado-revised-statutes" },
    details: [
      "Because the bar is the car's full value, insurers often total Colorado cars well below it when repairs plus salvage come close to that value.",
      "A rebuilt car needs a Colorado State Patrol certified VIN inspection before it is retitled \"Rebuilt from Salvage\".",
    ],
    keeping:
      "You can keep a salvage-titled car. To drive it again you repair it, keep the parts receipts, pass a State Patrol VIN inspection and apply for a \"Rebuilt from Salvage\" title.",
    brands: ["Salvage", "Rebuilt from salvage", "Nonrepairable"],
    titleAgency: { name: "Colorado Division of Motor Vehicles", url: "https://dmv.colorado.gov/salvage-vehicles" },
    regulator: { name: "Colorado Division of Insurance", url: "https://doi.colorado.gov/" },
    changes: [
      {
        date: "2025-06-03",
        text: "HB25-1189 was signed. It adds salvage title disclosure requirements, including the reason a car is salvage, and a \"Lemon Law Buyback\" brand from January 1, 2027.",
        status: "enacted",
        source: { name: "Colorado General Assembly, HB25-1189", url: "https://leg.colorado.gov/bills/HB25-1189" },
      },
    ],
    listsSay: "Lists show 100%, which matches the statute's \"repair cost exceeds value\" wording.",
    check: "confirmed",
  },
  Connecticut: {
    lawSays:
      "Connecticut's insurance law defines a constructive total loss as one where the cost to repair, the cost to salvage, or both, equals or exceeds the car's value at the time of the loss. A separate title law makes an insurer that takes a totaled car stamp the title \"SALVAGE\".",
    measuredAgainst: "the car's value at the time of the loss",
    kind: "both",
    cite: { name: "Conn. Gen. Stat. § 38a-353", url: "https://www.cga.ct.gov/current/pub/chap_700.htm#sec_38a-353" },
    details: [
      "If 10 or more major component parts are beyond repair, the title is stamped \"SALVAGE PARTS ONLY\" instead.",
      "The insurer must show you how it calculated the settlement and tell you in writing that you can dispute it with the Insurance Department.",
    ],
    keeping:
      "You can keep the car, but its registration is cancelled and it cannot be driven. After repairs it must pass a DMV salvage inspection before it gets a title printed \"Rebuilt\".",
    brands: ["Salvage", "Salvage parts only", "Rebuilt"],
    titleAgency: { name: "Connecticut DMV", url: "https://portal.ct.gov/dmv/vehicle-services/get-vehicle-inspection/salvaged-totaled-vehicles" },
    regulator: { name: "Connecticut Insurance Department", url: "https://portal.ct.gov/cid/knowledge-base/articles/repairs-to-your-vehicle" },
    changes: [],
    listsSay:
      "Lists call Connecticut a Total Loss Formula state, which is close. The statute's wording compares \"the cost to repair or salvage\" with value, rather than adding salvage value to repairs word for word.",
    check: "confirmed",
  },
  Delaware: {
    lawSays:
      "Delaware sets no percentage or formula. Its law starts from the insurer's total-loss settlement: the insurer must send the title to the DMV for a salvage certificate, and an owner who keeps the car needs an owner-retained salvage certificate.",
    kind: "title",
    cite: { name: "21 Del. C. § 2512", url: "https://delcode.delaware.gov/title21/c025/index.html" },
    details: [
      "If the insurer cannot get the signed title within 30 days of settlement, it may apply for the salvage certificate with other proof, such as proof of payment.",
      "Photos of the damage are needed before repairs start if you plan to put the car back on the road.",
    ],
    keeping:
      "You can keep the car with an owner-retained salvage certificate. It cannot be driven until it is rebuilt, inspected by the Delaware State Police auto theft unit, passes safety inspection and is retitled.",
    brands: ["Salvage"],
    titleAgency: { name: "Delaware Division of Motor Vehicles", url: "https://www.dmv.de.gov/" },
    regulator: { name: "Delaware Department of Insurance", url: "https://insurance.delaware.gov/" },
    changes: [],
    listsSay:
      "Lists call Delaware a Total Loss Formula state. No Delaware statute or regulation sets the formula or any threshold; the formula is simply the method many insurers use.",
    check: "confirmed",
  },
  "Washington, D.C.": {
    lawSays:
      "D.C. treats a car as salvage when the estimated or actual cost to rebuild it for road use is more than 75% of its retail value before the damage.",
    measuredAgainst: "its retail value before the damage, from a recognized pricing guide approved by the DMV",
    kind: "title",
    cite: { name: "D.C. Code § 50-1331.01", url: "https://code.dccouncil.gov/us/dc/council/code/sections/50-1331.01" },
    details: [
      "An insurer that settles and takes the car must apply for a salvage title within 30 days.",
      "Flood-damaged cars are marked as flood vehicles, and the owner must tell a buyer in writing before selling.",
    ],
    keeping:
      "You can keep the car, but you must apply for a salvage title within 30 days and before repairs. After repair it needs D.C. inspection and a Metropolitan Police anti-theft check, and is then titled \"Rebuilt Salvage\".",
    brands: ["Salvage", "Rebuilt salvage", "Non-repairable", "Flood vehicle"],
    titleAgency: { name: "DC Department of Motor Vehicles", url: "https://dmv.dc.gov/service/salvage-vehicle-titleregistration" },
    regulator: { name: "DC Department of Insurance, Securities and Banking", url: "https://disb.dc.gov/" },
    changes: [],
    listsSay: "Lists show 75%, which matches. It is a title rule measured against retail value, not a rule insurers must use.",
    check: "confirmed",
  },
  Florida: {
    lawSays:
      "Florida's title law makes a car a total loss in two ways: when an insurer pays a total-loss claim on it, or, for an uninsured car, when repairs would cost 80% or more of replacing it with a car of like kind and quality.",
    measuredAgainst: "for uninsured cars, the cost of replacing it with a similar car",
    kind: "title",
    cite: { name: "Fla. Stat. § 319.30", url: "https://www.flsenate.gov/Laws/Statutes/2025/319.30" },
    details: [
      "For insured cars there is no percentage: the insurer's total-loss payment is what makes the car a total loss.",
      "A car is not a total loss if the insurer and owner agree to repair it rather than replace it.",
      "For late-model cars, the state uses a separate, higher test to decide whether a wreck can ever be rebuilt.",
    ],
    keeping:
      "You can keep the car. Since July 1, 2024 the salvage title can be issued straight to you, and the title has to be sent to the state within 72 hours of agreeing to keep the car. A rebuilt car must pass a state rebuilt inspection.",
    brands: ["Salvage", "Rebuilt", "Certificate of destruction"],
    titleAgency: { name: "Florida Department of Highway Safety and Motor Vehicles", url: "https://www.flhsmv.gov/pdf/proc/tl/tl-36.pdf" },
    regulator: { name: "Florida Department of Financial Services, consumer help", url: "https://www.myfloridacfo.com/division/consumers" },
    changes: [
      {
        date: "2024-07-01",
        text: "Chapter 2024-218 took effect: owner-retained salvage titles go directly to the owner, with 72-hour deadlines for forwarding the title.",
        status: "enacted",
        source: { name: "Florida Senate, CS/SB 1350 (2024)", url: "https://flsenate.gov/Session/Bill/2024/1350" },
      },
    ],
    listsSay:
      "Nearly every list says \"Florida: 80%\". In the statute, the 80% test applies to uninsured cars. When an insurer pays the claim, the payment itself makes the car a total loss, whatever the percentage.",
    check: "confirmed",
  },
  Georgia: {
    lawSays:
      "Georgia's title law uses no percentage. A car is salvage when an insurer has paid a total-loss claim on it and it has not been repaired, or when restoring it would need more than one major component part replaced.",
    kind: "title",
    cite: { name: "O.C.G.A. § 40-3-2", url: "https://law.justia.com/codes/georgia/title-40/chapter-3/article-1/section-40-3-2/" },
    details: [
      "Cosmetic-only damage does not make a car salvage, unless it was caused by fire or flood.",
      "A separate Insurance Commissioner rule (120-2-52-.06) controls how a total loss is valued, including comparable cars, taxes and fees, but not when a car must be totaled.",
    ],
    keeping:
      "You can keep the car. The insurer applies for a salvage title in your name and the plate goes back to the county tag office. After repair, and before painting, the car needs a state inspection for a rebuilt title.",
    brands: ["Salvage", "Rebuilt"],
    titleAgency: { name: "Georgia Department of Revenue, Motor Vehicle Division", url: "https://dor.georgia.gov/motor-vehicles/title-motor-vehicles/salvage-titles" },
    regulator: { name: "Georgia Office of Commissioner of Insurance and Safety Fire", url: "https://oci.georgia.gov/" },
    changes: [
      {
        date: "2021-09-01",
        text: "HB 207 required insurers to file total-loss and salvage title paperwork electronically for claims from this date.",
        status: "enacted",
        source: { name: "Office of the Governor, 2021 signed legislation, HB 207", url: "https://gov.georgia.gov/document/2021-signed-legislation/hb-207/download" },
      },
    ],
    listsSay:
      "Lists call Georgia a Total Loss Formula state. Georgia law contains no such formula; the insurer decides, and the title follows that decision.",
    check: "confirmed",
  },
  Hawaii: {
    lawSays:
      "For titling, Hawaii counts an insurer-declared total loss only when the projected repair cost exceeds the car's market value and the car has material damage to its electronics, frame, unibody or suspension, flood damage included. Only then does the title get a \"Rebuilt Vehicle\" brand after repair.",
    measuredAgainst: "its market value at the time of the incident",
    kind: "title",
    cite: { name: "HRS § 286-2", url: "https://www.capitol.hawaii.gov/hrscurrent/vol05_ch0261-0319/hrs0286/HRS_0286-0002.htm" },
    details: [
      "A total loss without that structural, electronic or flood damage does not trigger the rebuilt brand.",
      "The flood and electronics wording was added in 2019.",
    ],
    keeping:
      "The county motor vehicle office issues a salvage certificate when the title, registration and plates are surrendered. To register the car again, the bonded repair dealer who rebuilt it must certify an inspection, and the new title reads \"Rebuilt Vehicle\".",
    brands: ["Salvage certificate", "Rebuilt vehicle"],
    titleAgency: { name: "HRS § 286-48 (salvage certificates, administered by county motor vehicle offices)", url: "https://data.capitol.hawaii.gov/hrscurrent/Vol05_Ch0261-0319/HRS0286/HRS_0286-0048.htm" },
    regulator: { name: "Hawaii Insurance Division", url: "https://cca.hawaii.gov/ins/" },
    changes: [
      {
        date: "2026-06-05",
        text: "SB 2053 was signed as Act 92 (2026), letting owners transfer totaled cars to insurers with electronic signatures and no notary.",
        status: "enacted",
        source: { name: "Hawaii State Legislature, SB 2053 CD1", url: "https://data.capitol.hawaii.gov/sessions/session2026/bills/SB2053_CD1_.PDF" },
      },
    ],
    listsSay:
      "Lists call Hawaii a Total Loss Formula state. The statute instead uses repair cost above market value plus a structural-damage condition, and only to decide the title brand.",
    check: "confirmed",
  },
  Idaho: {
    lawSays:
      "Idaho has no fixed percentage. A car is salvage if the owner or insurer decides repair is uneconomical once the wreck's salvage value is taken into account, or if an insurer has paid a total-loss settlement on it.",
    kind: "title",
    cite: { name: "Idaho Code § 49-123", url: "https://legislature.idaho.gov/statutesrules/idstat/Title49/T49CH1/SECT49-123" },
    details: [
      "Idaho's \"uneconomical once salvage value is counted\" test is the closest any title law in the region comes to the Total Loss Formula.",
      "There is no age or value exemption: every total loss needs a salvage certificate.",
    ],
    keeping:
      "You can keep the car. The insurer must tell the Idaho Transportation Department about the payout within 30 days, and you need a salvage certificate before selling it. After repair it cannot be driven until it gets a title branded \"Rebuilt Salvage\".",
    brands: ["Salvage certificate", "Rebuilt salvage"],
    titleAgency: { name: "Idaho Transportation Department, Division of Motor Vehicles", url: "https://itd.idaho.gov/dmv/registrations-plates-titles/salvage-vehicles/" },
    regulator: { name: "Idaho Department of Insurance", url: "https://doi.idaho.gov/" },
    changes: [],
    listsSay:
      "Lists call Idaho a Total Loss Formula state, which roughly matches the statute's test. Some sites quote a 75–80% \"Idaho threshold\"; that is insurer practice, not law.",
    check: "confirmed",
  },
  Illinois: {
    lawSays:
      "In Illinois, once an insurer pays a total-loss claim the car is salvage, whatever the damage percentage; the decision is the insurer's. A separate 70% test applies only to self-insured owners and a few others, not to ordinary insured claims.",
    kind: "title",
    cite: { name: "625 ILCS 5/3-117.1", url: "https://www.ilga.gov/legislation/ilcs/fulltext.asp?DocName=062500050K3-117.1" },
    details: [
      "You can keep a totaled car only by agreement with the insurer, and only if the damage is hail alone and does not affect safety, or the car is nine or more model years old.",
      "A stolen car that is totaled and later recovered needs a salvage certificate only if the recovered car's damage would itself make it a total loss.",
    ],
    keeping:
      "Keeping the car is limited to the hail-only and nine-model-year cases above, with the insurer's agreement. A salvage car must pass an inspection before it can get a rebuilt title and go back on the road.",
    brands: ["Salvage certificate", "Junking certificate", "Rebuilt"],
    titleAgency: { name: "Illinois Secretary of State, Vehicle Services", url: "https://www.ilsos.gov/departments/vehicles/home.html" },
    regulator: { name: "Illinois Department of Insurance", url: "https://idoi.illinois.gov/" },
    changes: [
      {
        date: "2025-04-11",
        text: "HB 2671, which would have changed total-loss rules for cars nine or more model years old, was sent back to the Rules Committee and died.",
        status: "failed",
        source: { name: "Illinois General Assembly, HB 2671 status", url: "https://ilga.gov/ftp/legislation/104/BillStatus/HTML/10400HB2671.html" },
      },
    ],
    listsSay:
      "Lists either call Illinois a Total Loss Formula state or quote a 70% threshold. Neither fits ordinary insured claims: the insurer decides, and the 70% test covers only self-insured and certain other owners.",
    check: "confirmed",
  },
  Indiana: {
    lawSays:
      "Indiana requires a salvage title for cars from the last seven model years when an insurer decides repair is economically impractical, when the car is flood-damaged, or when repairs cost more than 70% of its fair market value.",
    measuredAgainst: "its fair market value immediately before the damage",
    kind: "title",
    cite: { name: "Ind. Code § 9-22-3-3", url: "https://iga.in.gov/ic/2025/Title_9/Article_22.pdf" },
    details: [
      "Only cars from the last seven model years must get a salvage title; the BMV can issue one for an older car if the owner asks.",
      "For most insured claims, the insurer's \"economically impractical\" decision is the trigger that matters; the 70% test is one of several.",
      "Rebuilt flood cars carry the words \"Rebuilt Flood Damaged Vehicle\".",
    ],
    keeping:
      "You can keep the car, but it cannot be registered on a salvage title. After repair, a police officer inspects it as part of the BMV's affidavit of restoration, and the new title is branded \"Rebuilt Vehicle\".",
    brands: ["Salvage", "Rebuilt vehicle", "Rebuilt flood damaged vehicle"],
    titleAgency: { name: "Indiana Bureau of Motor Vehicles", url: "https://secure.in.gov/bmv/titles/special-titling-circumstances" },
    regulator: { name: "Indiana Department of Insurance", url: "https://www.in.gov/idoi/" },
    changes: [],
    listsSay:
      "Lists say \"Indiana: 70%\" as if it were the insurer's threshold. The law applies only to the last seven model years, and the insurer's own decision usually triggers the salvage title first.",
    check: "confirmed",
  },
  Iowa: {
    lawSays:
      "Iowa treats a car as wrecked or salvage when the cost of repair is more than 70% of its fair market value before the damage. The rule applies only to cars worth $500 or more before the damage.",
    measuredAgainst: "its fair market value before the damage",
    kind: "title",
    cite: { name: "Iowa Code § 321.52(4)", url: "https://www.legis.iowa.gov/docs/code/321.52.pdf" },
    details: [
      "The threshold was 50% until July 1, 2021. Salvage titles issued before that date for damage between 50% and 70% keep their brand.",
      "A repaired car must pass a salvage theft examination before it gets a regular title marked \"REBUILT-IA\".",
    ],
    keeping:
      "You can keep the car on a salvage title. To drive it again you repair it, pass a salvage theft examination by a listed law enforcement agency, and receive a title marked \"REBUILT-IA\".",
    brands: ["Salvage", "Rebuilt-IA"],
    titleAgency: { name: "Iowa DOT Motor Vehicle Division", url: "https://iowadot.gov/registration-plates/other-vehicle-services/salvage-vehicles" },
    regulator: { name: "Iowa Insurance Division", url: "https://iid.iowa.gov/" },
    changes: [
      {
        date: "2021-07-01",
        text: "Senate File 230 raised the salvage threshold from 50% to 70% of fair market value.",
        status: "enacted",
        source: { name: "Iowa Legislature, SF 230 (2021)", url: "https://www.legis.iowa.gov/docs/publications/LGE/89/attachments/SF230.html" },
      },
    ],
    listsSay: "Current lists show 70%, which matches. Older pages still say 50%, the rule before July 2021.",
    check: "confirmed",
  },
  Kansas: {
    lawSays:
      "Kansas treats a late-model car (the current model year plus the six before it) as salvage when repairs reach 75% or more of its fair market value just before the damage. Any car an insurer totals and takes title to is also salvage.",
    measuredAgainst: "its fair market value just before the damage, from a recognized pricing guide or a survey of comparable cars",
    kind: "both",
    cite: { name: "K.S.A. 8-197", url: "https://ksrevisor.gov/statutes/chapters/ch08/008_001_0097.html" },
    details: [
      "Damage that is only cosmetic exterior hail or windstorm damage does not count toward the 75%.",
      "The Kansas Insurance Department's Bulletin 2015-1 reads the law as requiring insurers to declare a total loss when a late-model car meets the test, and says actual repair costs should be used where known.",
    ],
    keeping: "You can keep the car on a salvage title. Once it is rebuilt and inspected, it can get a \"rebuilt salvage\" title.",
    brands: ["Salvage", "Rebuilt salvage", "Nonhighway"],
    titleAgency: { name: "Kansas Department of Revenue, Division of Vehicles", url: "https://www.ksrevenue.gov/dovindex.html" },
    regulator: { name: "Kansas Insurance Department", url: "https://insurance.kansas.gov/" },
    changes: [],
    listsSay: "Lists show 75%, which matches, but leave out that it covers only late-model cars and ignores cosmetic hail damage.",
    check: "confirmed",
  },
  Kentucky: {
    lawSays:
      "Kentucky requires a salvage title when the cost of parts and labor to restore a car is more than 75% of its retail value in a nationally accepted used-car guide. Insurers may not pay a claim at that level until the title is surrendered or a salvage title is applied for.",
    measuredAgainst: "its retail value in a nationally accepted used-car guide",
    kind: "both",
    cite: { name: "KRS 186A.520, as amended by 2026 Ky. Acts ch. 100", url: "https://apps.legislature.ky.gov/law/acts/26RS/documents/0100.pdf" },
    details: [
      "The cost of reinstalling deployed airbags is left out of the 75% test.",
      "Hail-damaged cars follow a separate statute (KRS 186A.555).",
    ],
    keeping:
      "You can keep the car on a salvage title, but it cannot be registered for the road. After repair, a Kentucky certified inspector checks it and you apply for a rebuilt title with your parts receipts.",
    brands: ["Salvage", "Rebuilt", "Water damaged", "Junk"],
    titleAgency: { name: "Kentucky Transportation Cabinet, Division of Motor Vehicle Licensing", url: "https://transportation.ky.gov/" },
    regulator: { name: "Kentucky Department of Insurance", url: "https://insurance.ky.gov/" },
    changes: [
      {
        date: "2026-07-15",
        text: "HB 144 (2026 Ky. Acts ch. 100) amended the salvage title statute.",
        status: "enacted",
        source: { name: "Kentucky General Assembly, 2026 Acts ch. 100", url: "https://apps.legislature.ky.gov/law/acts/26RS/documents/0100.pdf" },
      },
    ],
    listsSay:
      "Lists show 75%, which matches the number. Some say \"75% of actual cash value\"; the statute measures against retail value in a used-car guide and leaves out airbag costs.",
    check: "confirmed",
  },
  Louisiana: {
    lawSays:
      "Louisiana's title law defines a total loss as damage equal to 75% or more of a car's market value under the current NADA guide. A car declared a total loss in an insurance settlement must get a salvage title.",
    measuredAgainst: "its market value in the current NADA guide (now published as J.D. Power)",
    kind: "title",
    cite: { name: "La. R.S. 32:702", url: "https://legis.la.gov/Legis/Law.aspx?d=88513" },
    details: [
      "Within 30 days of settling, the insurer, its agent or the owner must send the signed title and salvage title application to the Office of Motor Vehicles.",
      "Cosmetic hail damage gets its own brand instead of salvage, and water damage to the drivetrain, computer or electrical system gets a water-damaged brand.",
    ],
    keeping: "After a salvage title is issued, you may sell, dismantle or rebuild the car. A rebuilt salvage car is retitled as \"reconstructed\".",
    brands: ["Salvage", "Reconstructed", "Water damaged", "Hail damage", "Certificate of destruction"],
    titleAgency: { name: "Louisiana Office of Motor Vehicles", url: "https://www.expresslane.org/" },
    regulator: { name: "Louisiana Department of Insurance", url: "https://www.ldi.la.gov/" },
    changes: [],
    listsSay:
      "Lists show 75% but often say \"of actual cash value\". The statute uses market value from the NADA guide, and it is a title definition rather than an insurer mandate.",
    check: "confirmed",
  },
  Maine: {
    lawSays:
      "Maine law sets no damage percentage. A car is salvage when an insurer or the owner declares it a total loss, and an insurer that settles a claim on a titled car it treats as salvage must apply for a salvage certificate within 30 days.",
    kind: "title",
    cite: { name: "29-A M.R.S. § 667", url: "https://legislature.maine.gov/statutes/29-A/title29-Asec667.html" },
    details: [
      "The Maine Bureau of Insurance says most insurers total a car at about 75% of its actual cash value. That is company practice, not a legal threshold.",
      "Depending on the work done, a repaired car is titled \"rebuilt salvage\", \"rebuilt\" or \"repaired\".",
    ],
    keeping:
      "You can keep the car. The insurer applies for the salvage title, gives it to you and deducts the salvage value from your payment. The car cannot be driven until it is repaired, inspected and retitled.",
    brands: ["Salvage", "Rebuilt salvage", "Rebuilt", "Repaired"],
    titleAgency: { name: "Maine Bureau of Motor Vehicles", url: "https://www.maine.gov/sos/bmv/vehicles/titles/types-of-title-certificates" },
    regulator: { name: "Maine Bureau of Insurance", url: "https://www.maine.gov/pfr/insurance/frequently-asked-questions/auto-claims" },
    changes: [],
    listsSay:
      "Lists call Maine a Total Loss Formula state, and some say 75%. Maine's statute contains neither; the 75% figure is the Bureau of Insurance describing common insurer practice.",
    check: "confirmed",
  },
  Maryland: {
    lawSays:
      "Maryland treats a car as salvage when repairing it for legal road use would cost more than 75% of its fair market value before the damage, or when an insurer acquires it in a total-loss settlement.",
    measuredAgainst: "its fair market value before the damage",
    kind: "both",
    cite: { name: "Md. Code, Transp. § 11-152", url: "https://mgaleg.maryland.gov/2026RS/Statute_Web/gtr/11-152.pdf" },
    details: [
      "Towing, storage, rental car and purely cosmetic repair costs are left out of the 75% calculation.",
      "The Maryland Insurance Administration uses the same 75% figure in its consumer guidance on total losses.",
      "Flood damage is a separate salvage trigger and is noted on the title.",
    ],
    keeping:
      "You can keep the car. The insurer tells the MVA, and you apply for a salvage certificate. After repair the car must pass inspection before a new title is issued.",
    brands: ["Salvage", "Rebuilt", "Flood damaged"],
    titleAgency: { name: "Maryland Motor Vehicle Administration", url: "https://mva.maryland.gov/title-registration/title-vehicle/salvaged-vehicles" },
    regulator: { name: "Maryland Insurance Administration", url: "https://insurance.maryland.gov/Consumer/Pages/total-loss.aspx" },
    changes: [],
    listsSay: "Lists show 75%, which matches. The statute says repairs must exceed 75%, so a repair bill of exactly 75% does not qualify.",
    check: "confirmed",
  },
  Massachusetts: {
    lawSays:
      "Massachusetts has no fixed percentage. Its appraiser regulation says an insurer may treat a car as a total loss when the appraised repair cost plus the estimated salvage value can reasonably be expected to exceed actual cash value, and it bars deciding a total loss by a percentage formula.",
    measuredAgainst: "actual cash value",
    kind: "both",
    cite: { name: "212 CMR 2.04; M.G.L. c. 90D, § 20", url: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXIV/Chapter90D/Section20" },
    details: [
      "A licensed appraiser must inspect or appraise the car before it can be declared a total loss, and it cannot be moved to a holding area without your consent.",
      "The insurer decides whether a totaled car is branded \"parts only\", meaning it can never be rebuilt.",
    ],
    keeping:
      "You can keep the car. The insurer notifies the Registry of Motor Vehicles and you apply for an owner-retained title. If the car instead gets a salvage title, it must pass a salvage inspection before it can be registered again.",
    brands: ["Salvage", "Parts only", "Owner retained"],
    titleAgency: { name: "Massachusetts RMV, total loss and salvage vehicles", url: "https://www.mass.gov/info-details/total-loss-and-salvage-vehicles" },
    regulator: { name: "Massachusetts Division of Insurance regulations (211 CMR)", url: "https://www.mass.gov/law-library/211-cmr" },
    changes: [],
    listsSay:
      "Some lists show Massachusetts at 75%. The regulation expressly rules out a percentage formula; its test works like the Total Loss Formula.",
    check: "confirmed",
  },
  Michigan: {
    lawSays:
      "Michigan's rule is a title-branding rule for late-model cars. When repairs are estimated at roughly 75% up to 91% of the car's pre-damage cash value, the title must become a salvage title; above that band it becomes a scrap title.",
    measuredAgainst: "its cash value before the damage",
    kind: "title",
    cite: { name: "MCL 257.217c", url: "https://legislature.mi.gov/documents/mcl/pdf/MCL-257-217C.pdf" },
    details: [
      "\"Late model\" means the current model year plus the five before it for cars up to 8,000 pounds. Older cars are outside this rule.",
      "A scrap-titled car can never be retitled for road use.",
    ],
    keeping:
      "A salvage-titled car can return to the road after a salvage inspection by a specially trained officer, with a licensed mechanic's certification. The new title carries the legend \"rebuilt salvage\".",
    brands: ["Salvage", "Scrap", "Rebuilt salvage"],
    titleAgency: { name: "Michigan Secretary of State", url: "https://www.michigan.gov/sos/vehicle/titles" },
    regulator: { name: "Michigan Department of Insurance and Financial Services", url: "https://www.michigan.gov/difs" },
    changes: [],
    listsSay: "Lists show 75%, which is the salvage trigger, but leave out the late-model limit and the scrap-title band near the top.",
    check: "confirmed",
  },
  Minnesota: {
    lawSays:
      "Under Minnesota's title law a car is a salvage vehicle when an insurer has declared or paid it as a total loss, or when repairs cost more than 80% of its value just before the damage.",
    measuredAgainst: "its value just before the damage",
    kind: "title",
    cite: { name: "Minn. Stat. § 168A.01, subd. 17b", url: "https://www.revisor.mn.gov/statutes/cite/168A.01" },
    details: [
      "An insurer that takes ownership must get a \"salvage\" brand only for a late-model car (within about five model years) or a high-value car (worth over $9,000 before the damage). Other cars get a \"prior salvage\" brand.",
      "Since January 1, 2023, a stolen car that was paid as a total loss and later recovered with damage of 80% or less is not a salvage vehicle.",
    ],
    keeping:
      "You can keep and repair a salvage car. To drive it, it must pass a Driver and Vehicle Services salvage inspection, which is an anti-theft check rather than a safety inspection. The title is then branded \"prior salvage\".",
    brands: ["Salvage", "Prior salvage"],
    titleAgency: { name: "Minnesota Driver and Vehicle Services", url: "https://dps.mn.gov/divisions/dvs/vehicle/vehicle-titles/vehicle-title-salvage-vehicle-process" },
    regulator: { name: "Minnesota Department of Commerce", url: "https://mn.gov/commerce/" },
    changes: [
      {
        date: "2023-01-01",
        text: "2022 Minn. Laws ch. 57 excluded recovered stolen cars with damage of 80% or less from the salvage definition and rewrote the salvage title rules.",
        status: "enacted",
        source: { name: "Minnesota Revisor, Laws 2022 ch. 57", url: "https://www.revisor.mn.gov/laws/2022/0/57" },
      },
      {
        date: "2012",
        text: "A 2012 law raised the salvage threshold from 70% to 80%.",
        status: "enacted",
        source: { name: "Minnesota Revisor, Minn. Stat. § 168A.01", url: "https://www.revisor.mn.gov/statutes/cite/168A.01" },
      },
    ],
    listsSay: "Many lists still show 70%, the figure before 2012. The statute says 80%, and it is a title rule, not an insurer threshold.",
    check: "confirmed",
  },
  Mississippi: {
    lawSays:
      "We could not find a damage percentage in Mississippi law. Based on the title code, a car becomes salvage when an insurer takes it after paying a total-loss claim, and the insurer then gets a salvage title. When to total a car is left to the insurer.",
    kind: "title",
    cite: { name: "Miss. Code § 63-21-33", url: "https://law.justia.com/codes/mississippi/title-63/chapter-21/article-1/" },
    details: ["A salvage-titled car must pass a Department of Public Safety salvage inspection before it can get a rebuilt title."],
    keeping:
      "If you keep the car, you can rebuild it and have it inspected in your own name, then apply to the county tax collector for a rebuilt title.",
    brands: ["Salvage", "Rebuilt"],
    titleAgency: { name: "Mississippi Department of Revenue", url: "https://dor.ms.gov/motor-vehicle/salvage-vehicles" },
    regulator: { name: "Mississippi Insurance Department", url: "https://www.mid.ms.gov/" },
    changes: [],
    listsSay: "Lists call Mississippi a Total Loss Formula state. We found no formula or percentage in the statute; treat the formula as insurer practice.",
    check: "unconfirmed",
  },
  Missouri: {
    lawSays:
      "Missouri defines a salvage vehicle to include one whose repair cost is more than 80% of its fair market value just before the damage, as well as any car an insurer declares salvage in a claim settlement.",
    measuredAgainst: "its fair market value just before the damage",
    kind: "title",
    cite: { name: "RSMo § 301.010", url: "https://revisor.mo.gov/main/OneSection.aspx?section=301.010" },
    details: [
      "Airbags, tires, sound systems, hail damage and sales tax on parts are left out of the repair total.",
      "The threshold was 75% before 2007.",
    ],
    keeping:
      "If the insurer pays a total loss and you keep the car, it gives you a notice (DOR Form 5043) and sends a copy to the Department of Revenue. You apply for a salvage or \"prior salvage\" title, and the car must pass an examination before it goes back on the road.",
    brands: ["Salvage", "Prior salvage"],
    titleAgency: { name: "Missouri Department of Revenue", url: "https://dor.mo.gov/forms/5043.pdf" },
    regulator: { name: "Missouri Department of Commerce and Insurance", url: "https://insurance.mo.gov/" },
    changes: [],
    listsSay: "Lists show 80%, which matches. Older pages say 75%, and few mention the items left out of the repair total.",
    check: "confirmed",
  },
  Montana: {
    lawSays:
      "Montana sets no damage percentage. A salvage vehicle is one damaged so badly that the owner or insurer decides repair is uneconomical, and an insurer that acquires one must apply for a salvage certificate.",
    kind: "title",
    cite: { name: "Mont. Code Ann. § 61-3-210", url: "https://archive.legmt.gov/bills/MCA/title_0610/chapter_0030/part_0020/section_0100/0610-0030-0020-0100.html" },
    details: [
      "The insurer's salvage certificate duty covers cars less than 15 years old.",
      "When you keep the car, the insurer files a Notice of Total Loss Payoff for an owner-retained salvage vehicle (Form MV205).",
    ],
    keeping:
      "You can keep the car. After the insurer's notice, you get a salvage certificate; after repairs and an inspection, the new title is marked \"rebuilt salvage\".",
    brands: ["Salvage", "Rebuilt salvage"],
    titleAgency: { name: "Montana Motor Vehicle Division", url: "https://mvdmt.gov/wp-content/uploads/2023/10/MV205-Notice-of-Total-Loss-Payoff-Owner-Retained-Salvage-Vehicle.pdf" },
    regulator: { name: "Montana Commissioner of Securities and Insurance", url: "https://csimt.gov/" },
    changes: [],
    listsSay: "Some lists give Montana a formula or a percentage. The statute sets neither; the call is the owner's or insurer's.",
    check: "confirmed",
  },
  Nebraska: {
    lawSays:
      "Nebraska requires a salvage brand on a late-model car damaged so that repairs reach 75% of its retail value. \"Late model\" means seven model years old or newer, or a car worth more than a set value floor.",
    measuredAgainst: "its retail value at the time of the damage",
    kind: "title",
    cite: { name: "Neb. Rev. Stat. § 60-171", url: "https://nebraskalegislature.gov/laws/statutes.php?statute=60-171" },
    details: [
      "The value floor rose to $12,500 on January 1, 2025, under the statute's automatic five-year step.",
      "Owners may choose a salvage title voluntarily, whatever the damage, age or value.",
    ],
    keeping:
      "You can keep the car, but it must be inspected through the Nebraska State Patrol and retitled with a \"previously salvaged\" brand before it goes back on the road.",
    brands: ["Salvage", "Previously salvaged", "Flood damaged"],
    titleAgency: { name: "Nebraska DMV", url: "https://dmv.nebraska.gov/node/463" },
    regulator: { name: "Nebraska Department of Insurance", url: "https://doi.nebraska.gov/" },
    changes: [
      {
        date: "2025-01-01",
        text: "The late-model value floor rose from $12,000 to $12,500.",
        status: "enacted",
        source: { name: "Nebraska DMV, salvage titles", url: "https://dmv.nebraska.gov/node/463" },
      },
    ],
    listsSay: "Lists show 75% but rarely mention the late-model and value limits; some quote out-of-date value floors.",
    check: "confirmed",
  },
  Nevada: {
    lawSays:
      "Nevada defines a total loss vehicle as one whose repair cost is 65% or more of its fair market value just before the damage. Paint, certain electronic parts and towing are left out of the repair cost.",
    measuredAgainst: "its fair market value just before the damage",
    kind: "title",
    cite: { name: "NRS 487.790", url: "https://www.leg.state.nv.us/NRS/NRS-487.html#NRS487Sec790" },
    details: [
      "A car 10 or more model years old is not a total loss vehicle if it only needs certain outer parts, such as a hood, trunk lid or fender.",
      "Some recovered stolen cars with no structural damage are also excluded.",
    ],
    keeping:
      "If you keep the car, the insurer applies for a salvage title for you. It cannot be registered until it is rebuilt, inspected by a registered garage and checked at a DMV inspection station. The \"Rebuilt\" brand is permanent.",
    brands: ["Salvage", "Rebuilt", "Nonrepairable"],
    titleAgency: { name: "Nevada DMV", url: "https://dmv.nv.gov/salvage.htm" },
    regulator: { name: "Nevada Division of Insurance", url: "https://doi.nv.gov/" },
    changes: [],
    listsSay: "Lists show 65%, which matches. A 2017 bill to raise it to 80% did not change the law.",
    check: "confirmed",
  },
  "New Hampshire": {
    lawSays:
      "New Hampshire requires an insurer that declares a car a total loss to apply for a salvage certificate within 20 days. Secondary sources say a damaged car counts as a total loss when repairs reach 75% of its fair market value, but we could not confirm that percentage in the current statute text.",
    kind: "title",
    cite: { name: "RSA 261:22", url: "https://gc.nh.gov/rsa/html/xxi/261/261-22.htm" },
    details: ["A salvage car cannot be registered until it is restored and the owner shows it is safe for the road."],
    keeping: "You can keep the car on a salvage certificate. Before it can be registered again, you have to document the rebuild and show the car is safe.",
    brands: ["Salvage"],
    titleAgency: { name: "New Hampshire DMV", url: "https://dmv.nh.gov/vehicles-boats-or-titles/salvage-and-rebuilt-vehicles" },
    regulator: { name: "New Hampshire Insurance Department", url: "https://www.insurance.nh.gov/" },
    changes: [],
    listsSay: "Lists show 75%, citing RSA 261:22. The official text we could check did not show that figure, and an older version limited it to newer cars.",
    check: "unconfirmed",
  },
  "New Jersey": {
    lawSays:
      "New Jersey sets no fixed percentage. The Department of Banking and Insurance describes a total loss as repair cost equal to or more than the car's actual cash value, and notes that insurers often total cars at around 80% in practice.",
    measuredAgainst: "actual cash value on the date of loss",
    kind: "both",
    cite: { name: "N.J.A.C. 13:21-22 (salvage titles)", url: "https://www.nj.gov/mvc/pdf/business/salvage-regs.pdf" },
    details: [
      "The Motor Vehicle Commission treats a car as salvage when the insurer considers it uneconomical to repair.",
      "You must surrender the title within 10 working days of settling a total-loss claim.",
    ],
    keeping:
      "The insurer does not have to let you keep the car. If it does, it deducts the salvage value. A salvage car must pass an MVC salvage inspection before it can be titled for the road again.",
    brands: ["Salvage"],
    titleAgency: { name: "New Jersey Motor Vehicle Commission", url: "https://www.nj.gov/mvc/vehicles/salvage.htm" },
    regulator: { name: "New Jersey Department of Banking and Insurance", url: "https://www.nj.gov/dobi/ins_ombudsman/wysk1.htm" },
    changes: [],
    listsSay: "Lists variously give New Jersey as the Total Loss Formula, 75% or 80%. None of these is in a statute or regulation; 80% is described as common insurer practice.",
    check: "confirmed",
  },
  "New Mexico": {
    lawSays:
      "The New Mexico statute text we found treats a car as salvage when an insurer or other party decides repair would be economically wasteful, with no fixed percentage. An older version used a 75% test. We could not confirm the current wording.",
    kind: "title",
    cite: { name: "NMSA 1978 § 66-1-4.16", url: "https://law.justia.com/codes/new-mexico/2018/chapter-66/article-1/section-66-1-4.16/" },
    details: ["A salvage car keeps its salvage brand on every later transfer."],
    keeping: "After repair, the car needs an MVD inspection before it can get a title branded \"rebuilt\".",
    brands: ["Salvage", "Rebuilt", "Nonrepairable"],
    titleAgency: { name: "New Mexico MVD", url: "https://www.mvd.newmexico.gov/chapter-9-reconstructed-rebuilt-salvage-and-nonrepairable-vehicles/" },
    regulator: { name: "New Mexico Office of Superintendent of Insurance", url: "https://www.osi.state.nm.us/" },
    changes: [],
    listsSay: "Lists call New Mexico a Total Loss Formula state. The statute text we found uses an \"economically wasteful\" test instead.",
    check: "unconfirmed",
  },
  "New York": {
    lawSays:
      "New York's 75% figure is a DMV title-branding rule: a car eight model years old or newer whose repair cost is more than 75% of its retail value gets a \"REBUILT SALVAGE: NY\" brand once it is repaired and inspected.",
    measuredAgainst: "its retail value at the time of loss",
    kind: "title",
    cite: { name: "15 NYCRR § 20.20", url: "https://www.law.cornell.edu/regulations/new-york/15-NYCRR-20.20" },
    details: [
      "Cars older than eight model years are not branded under this rule.",
      "How insurers value a total loss is set by Regulation 64 (11 NYCRR 216.7), which has no percentage trigger.",
      "The DMV examines every rebuilt salvage car for stolen parts before it can be registered, and the brand is permanent.",
    ],
    keeping:
      "You can keep and repair the car, but it must pass a DMV salvage examination before it can be titled and registered. The title is then branded \"REBUILT SALVAGE\" for good.",
    brands: ["Salvage", "Rebuilt salvage: NY"],
    titleAgency: { name: "New York DMV", url: "https://dmv.ny.gov/salvage/salvage-vehicles" },
    regulator: { name: "New York Department of Financial Services", url: "https://www.dfs.ny.gov/" },
    changes: [],
    listsSay: "Lists say New York's threshold is 75% as if it binds insurers. It is a title rule for cars up to eight model years old; some sites wrongly say nine.",
    check: "confirmed",
  },
  "North Carolina": {
    lawSays:
      "North Carolina uses 75% in two places. The DMV statutes treat a car as salvage when repairs cost more than 75% of its fair market retail value, and a Department of Insurance rule requires the insurer to declare a total loss when damage equals or exceeds 75% of the car's actual cash value before the accident.",
    measuredAgainst: "fair market retail value for the title rule, actual cash value for the insurer rule",
    kind: "both",
    cite: { name: "N.C. Gen. Stat. § 20-4.01(33); 11 NCAC 04 .0418", url: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_20/GS_20-71.3.html" },
    details: [
      "The insurance rule forbids arrangements that keep a repair estimate artificially under 75%.",
      "If you choose to keep the car, the insurer deducts its salvage value from your payment.",
    ],
    keeping:
      "Tell the insurer you want to keep the car; it gives you an owner-retained salvage form, which it sends to the DMV within 10 days of paying the claim. A rebuilt car is titled with a \"salvage rebuilt\" brand.",
    brands: ["Salvage", "Salvage rebuilt", "Reconstructed", "Flood"],
    titleAgency: { name: "NCDMV damage disclosure form (MVR-181)", url: "https://www.ncdot.gov/dmv/downloads/Documents/MVR-181.pdf" },
    regulator: { name: "North Carolina Department of Insurance", url: "https://www.ncdoi.gov/" },
    changes: [],
    listsSay: "Some insurance blogs say North Carolina uses the Total Loss Formula. Both the statute and the insurance rule use 75%.",
    check: "confirmed",
  },
  "North Dakota": {
    lawSays:
      "North Dakota's 75% rule is a title rule: the owner of a car damaged beyond 75% of its retail value must send the title to the Department of Transportation within 10 days for a salvage certificate.",
    measuredAgainst: "its retail value in the NADA guide",
    kind: "title",
    cite: { name: "N.D.C.C. § 39-05-20.2", url: "https://ndlegis.gov/cencode/t39c05.pdf" },
    details: [
      "Hail and glass damage are left out of the 75% calculation.",
      "No age exemption was found; the salvage rules apply to all model years.",
    ],
    keeping: "After reconstruction, you can get a regular title by presenting the salvage title and an inspection certificate. The new title carries a \"previously salvaged\" brand.",
    brands: ["Salvage", "Previously salvaged"],
    titleAgency: { name: "North Dakota DOT damage and salvage disclosure (SFN 18609)", url: "https://dot.nd.gov/forms/sfn18609.pdf" },
    regulator: { name: "North Dakota Insurance Department", url: "https://www.insurance.nd.gov/" },
    changes: [],
    listsSay: "Some sites say insurers must total at 75%. The statute is a title rule only, and it leaves out hail and glass damage.",
    check: "confirmed",
  },
  Ohio: {
    lawSays:
      "Ohio sets no total-loss percentage. A salvage title follows the insurer's decision to total the car and pay the claim, and a repaired salvage car must pass a State Highway Patrol inspection before it gets a title marked \"REBUILT SALVAGE\".",
    kind: "title",
    cite: { name: "Ohio Rev. Code § 4505.11", url: "https://codes.ohio.gov/ohio-revised-code/section-4505.11" },
    details: [
      "A salvage car may not be driven on Ohio roads except to its inspection appointment.",
      "If you keep the car, the insurer may not pay you until you get a salvage title and give it a copy.",
    ],
    keeping:
      "You can keep the car if the insurer agrees. You get a salvage title first; after repairs you book a State Highway Patrol salvage inspection, and the clerk of courts then issues a title marked \"REBUILT SALVAGE\".",
    brands: ["Salvage", "Rebuilt salvage"],
    titleAgency: { name: "Ohio Bureau of Motor Vehicles", url: "https://www.bmv.ohio.gov/" },
    regulator: { name: "Ohio Department of Insurance", url: "https://insurance.ohio.gov/" },
    changes: [],
    listsSay: "Many lists call Ohio a Total Loss Formula state. No statute sets the formula; Ohio leaves the decision to the insurer.",
    check: "confirmed",
  },
  Oklahoma: {
    lawSays:
      "Oklahoma brands a car salvage when repairs reach 70% of its fair market value. The threshold rose from 60% to 70% on November 1, 2026.",
    measuredAgainst: "the higher of a guidebook value and the car's actual cash value",
    kind: "title",
    cite: { name: "47 Okla. Stat. § 1111, as amended by SB 1920 (2026)", url: "https://www.oklegislature.gov/BillInfo.aspx?Bill=sb1920&Session=2600" },
    details: [
      "The rule applies to cars 10 model years old or newer.",
      "Flood-damaged cars get a \"flood damaged\" brand.",
      "Rebuilt titles also show the car's salvage, flood or recovered-theft history and the salvage date.",
    ],
    keeping:
      "You can keep the car. Once repaired, a salvage car 10 model years old or newer must pass a rebuilt inspection before it can be used.",
    brands: ["Salvage", "Rebuilt", "Flood damaged", "Recovered theft"],
    titleAgency: { name: "Service Oklahoma rules, OAC 670:20-35-6", url: "https://www.law.cornell.edu/regulations/oklahoma/OAC-670-20-35-6" },
    regulator: { name: "Oklahoma Insurance Department", url: "https://www.oid.ok.gov/" },
    changes: [
      {
        date: "2026-11-01",
        text: "SB 1920 took effect, raising the salvage threshold from 60% to 70%. It became law without the governor's signature on May 13, 2026.",
        status: "enacted",
        source: { name: "Oklahoma Legislature, SB 1920 (2026)", url: "https://www.oklegislature.gov/BillInfo.aspx?Bill=sb1920&Session=2600" },
      },
    ],
    listsSay: "Most lists still show 60%, which was right until October 31, 2026.",
    check: "confirmed",
  },
  Oregon: {
    lawSays:
      "Oregon treats a car as totaled for title purposes when an insurer declares it a total loss or takes title to it, whatever the percentage. The 80% test (repairs of at least 80% of the car's retail value) applies only to damage no insurer covers.",
    measuredAgainst: "for uninsured damage, its retail value before the damage",
    kind: "title",
    cite: { name: "ORS 801.527", url: "https://oregon.public.law/statutes/ors_801.527" },
    details: [
      "An insurer that declares a total loss must get the title from you as a condition of settlement, or notify the DMV within 30 days.",
      "A stolen car not recovered within 30 days, with no insurer covering it, also counts as totaled.",
    ],
    keeping:
      "You can keep the car, but even an unrepaired totaled car has to be retitled. If it is repaired, the title is branded \"Totaled\" along with a word such as \"Reconstructed\", and a DMV VIN inspection is required.",
    brands: ["Totaled", "Salvage", "Reconstructed", "Assembled", "Replica"],
    titleAgency: { name: "Oregon DMV", url: "https://www.oregon.gov/odot/DMV/docs/Chapter_J.pdf" },
    regulator: { name: "Oregon Division of Financial Regulation", url: "https://dfr.oregon.gov/" },
    changes: [],
    listsSay: "Lists say \"Oregon: 80%\" as an insurer threshold. The 80% test is only for uninsured damage; an insurer's declaration settles it otherwise.",
    check: "confirmed",
  },
  Pennsylvania: {
    lawSays:
      "Pennsylvania has no fixed percentage. An insurance appraisal rule treats the loss as a total when repairs would cost more than the car's appraised value minus its salvage value, which works like the Total Loss Formula.",
    measuredAgainst: "the appraised value minus the salvage value",
    kind: "both",
    cite: { name: "31 Pa. Code § 62.3(e)", url: "https://www.law.cornell.edu/regulations/pennsylvania/31-Pa-Code-SS-62-3" },
    details: [
      "The Vehicle Code separately defines a salvage vehicle as one whose repair cost would be more than its value once repaired.",
      "Antique and classic cars that only need restoration are not salvage vehicles.",
    ],
    keeping:
      "If you keep a car that qualifies for a total-loss payment, you must apply for a certificate of salvage right away. After repair it must pass an Enhanced Vehicle Safety Inspection by someone other than you before it can get a reconstructed title.",
    brands: ["Salvage", "Reconstructed", "Flood", "Recovered theft"],
    titleAgency: { name: "PennDOT, Enhanced Vehicle Safety Inspections", url: "https://www.pa.gov/agencies/dmv/vehicle-services/inspection-and-safety-requirements/enhanced-vehicle-safety-inspections.html" },
    regulator: { name: "Pennsylvania Insurance Department", url: "https://www.pa.gov/agencies/insurance" },
    changes: [],
    listsSay: "Lists call Pennsylvania a Total Loss Formula state, which matches the appraisal rule; there is no percentage.",
    check: "confirmed",
  },
  "Rhode Island": {
    lawSays:
      "Rhode Island's claims law stops an insurer from declaring a car a total loss unless the damage reaches 85% of its fair market value before the accident. You can still ask, in writing, for a total loss when the damage is between 75% and 85%.",
    measuredAgainst: "its fair market value before the accident, from a recognized retail value guide",
    kind: "both",
    cite: { name: "R.I. Gen. Laws § 27-9.1-4", url: "https://webserver.rilegislature.gov/Statutes/TITLE27/27-9.1/27-9.1-4.htm" },
    details: [
      "This is one of the few rules in the country that limits the insurer rather than branding the title: below 85%, the insurer generally has to pay for repairs unless you ask for a total loss.",
      "A separate title statute (R.I. Gen. Laws § 31-46-3) still uses 75% for salvage titles on cars under seven years old.",
      "The 85% figure dates from June 26, 2026. If your claim started before then, ask the insurer which version applied.",
    ],
    keeping:
      "If you keep the car, you return the title to the DMV for a salvage certificate. Rebuilding requires a licensed rebuilder and a DMV salvage inspection before the car can be registered again.",
    brands: ["Salvage"],
    titleAgency: { name: "Rhode Island DMV, salvage inspections", url: "https://dmv.ri.gov/registrations-plates-titles/safety-emissions-inspections/salvage-inspections" },
    regulator: { name: "Rhode Island Department of Business Regulation, Insurance Division", url: "https://dbr.ri.gov/" },
    changes: [
      {
        date: "2026-06-26",
        text: "S 3115 (P.L. 2026, ch. 286) took effect without the governor's signature, raising the insurer threshold from 80% to 85%, with a written owner option from 75% to 85%.",
        status: "enacted",
        source: { name: "CollisionWeek, July 9, 2026", url: "https://collisionweek.com/2026/07/09/rhode-island-bills-raising-total-loss-threshold-85-become-law-without-governors-signature/" },
      },
      {
        date: "2025-07-05",
        text: "H 6053 took effect without the governor's signature, raising the insurer threshold from 75% to 80%.",
        status: "enacted",
        source: { name: "LegiScan, Rhode Island H 6053 (2025)", url: "https://legiscan.com/RI/bill/H6053/2025" },
      },
    ],
    listsSay: "Most lists still show Rhode Island at 75%, or call it a Total Loss Formula state. Since June 26, 2026 the insurer threshold is 85%.",
    check: "confirmed",
  },
  "South Carolina": {
    lawSays:
      "South Carolina treats a car as a total loss when the repair cost, parts plus reasonable labor, reaches 75% or more of its fair market value before the loss. A car totaled at that level gets a salvage brand.",
    measuredAgainst: "its fair market value just before the loss",
    kind: "both",
    cite: { name: "S.C. Code § 56-19-480", url: "https://www.scstatehouse.gov/code/t56c019.php" },
    details: [
      "The rule does not apply to cars worth $2,000 or less, or to antique vehicles.",
      "The state DMV's own guidance says cars with a loss of 75% or more of fair market value must be declared a total loss.",
    ],
    keeping:
      "You can keep the car. The insurer files the paperwork for a salvage-branded title in your name. After repair, you can apply for a rebuilt title.",
    brands: ["Salvage", "Salvage rebuilt", "Junk"],
    titleAgency: { name: "South Carolina DMV, total loss claims", url: "https://dmv.sc.gov/vehicle-owners/titles/total-loss-claim" },
    regulator: { name: "South Carolina Department of Insurance", url: "https://doi.sc.gov/" },
    changes: [],
    listsSay: "Lists show 75%, which matches, but leave out the $2,000 value floor and the antique exemption.",
    check: "confirmed",
  },
  "South Dakota": {
    lawSays:
      "South Dakota has no fixed damage percentage in law. A salvage vehicle is one an insurer or self-insurer declares a total loss, and its title must then be converted to a salvage title.",
    kind: "title",
    cite: { name: "SDCL § 32-3-51.19", url: "https://sdlegislature.gov/Statutes/32-3-51.19" },
    details: [
      "Insurers decide totals by their own methods, commonly the Total Loss Formula.",
      "A 2026 bill (SB 227) would have barred insurers from totaling a car unless repairs reached 75% of its actual cash value. It passed the Senate 27–6 but was tabled in the House Transportation Committee, so it is not law.",
    ],
    keeping:
      "If the insurer declares a total loss but does not take the car, you must get a salvage title, and selling the car without one is a misdemeanor. The Department of Revenue inspects a rebuilt car before it can get a rebuilt title.",
    brands: ["Salvage", "Rebuilt"],
    titleAgency: { name: "South Dakota Department of Revenue, Motor Vehicle Division", url: "https://dor.sd.gov/individuals/motor-vehicle/rebuilt-vehicles/" },
    regulator: { name: "South Dakota Division of Insurance", url: "https://dlr.sd.gov/insurance/" },
    changes: [
      {
        date: "2026-02-24",
        text: "SB 227 (a 75% floor before an insurer may total a car) was tabled 8–3 by the House Transportation Committee after passing the Senate on February 17. It did not become law.",
        status: "failed",
        source: { name: "South Dakota Legislature, House Transportation minutes, Feb. 24, 2026", url: "https://mylrc.sdlegislature.gov/api/Documents/Minutes/304024.pdf?Year=2026" },
      },
    ],
    listsSay: "Some 2026 articles described SB 227 as setting a South Dakota threshold. It was tabled and is not law.",
    check: "confirmed",
  },
  Tennessee: {
    lawSays:
      "Tennessee's title law defines a salvage vehicle as a passenger car damaged so badly that repairs, parts plus labor, would cost more than 75% of its retail value. Cars fit only for parts or scrap are \"nonrepairable\".",
    measuredAgainst: "its retail value",
    kind: "title",
    cite: { name: "Tenn. Code § 55-3-201", url: "https://www.tn.gov/revenue/title-and-registration/vehicle-titling/salvage.html" },
    details: [
      "When an insurer totals a car, its original title and registration become void under Department of Revenue guidance.",
      "A nonrepairable car can never be rebuilt for road use.",
    ],
    keeping:
      "If you keep the car, you apply by mail for a salvage certificate; the car cannot be driven. To use it again, it must be rebuilt, pass a state anti-theft inspection and be retitled as rebuilt.",
    brands: ["Salvage", "Rebuilt", "Nonrepairable"],
    titleAgency: { name: "Tennessee Department of Revenue, Vehicle Services", url: "https://www.tn.gov/revenue/title-and-registration/vehicle-titling/salvage.html" },
    regulator: { name: "Tennessee Department of Commerce and Insurance", url: "https://www.tn.gov/commerce/insurance.html" },
    changes: [],
    listsSay: "Many lists say 75% of \"fair market value\" or \"actual cash value\". Tennessee's own sources say retail value, and it is a title rule.",
    check: "confirmed",
  },
  Texas: {
    lawSays:
      "Texas defines a salvage motor vehicle as one whose estimated repair cost, not counting repainting or sales tax, is more than its actual cash value just before the damage. That is a 100% test, used for titles.",
    measuredAgainst: "its actual cash value (market value) just before the damage",
    kind: "title",
    cite: { name: "Tex. Transp. Code § 501.091", url: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.501.htm#501.091" },
    details: [
      "Sudden hail damage does not count toward the salvage definition, though TxDMV allows voluntary salvage titles for hail-damaged and stolen cars.",
      "A \"nonrepairable\" car, worth something only as parts or scrap, can never be titled for the road again.",
      "Because the title bar is the car's full value, insurers often total Texas cars well below it when repairs plus salvage come close to the car's value.",
    ],
    keeping:
      "You can keep the car, but you need a salvage or nonrepairable title from TxDMV. A salvage car can be repaired and retitled with a rebuilt notation; a nonrepairable car cannot return to the road.",
    brands: ["Salvage", "Nonrepairable", "Rebuilt"],
    titleAgency: { name: "Texas DMV, Salvage/Nonrepairable Motor Vehicle Manual", url: "https://www.txdmv.gov/sites/default/files/body-files/Salvage_Nonrepairable_Manual.pdf" },
    regulator: { name: "Texas Department of Insurance", url: "https://www.tdi.texas.gov/" },
    changes: [],
    listsSay: "Lists show 100%, which matches, but often describe it as an insurer threshold. It is the salvage title definition, and hail damage is left out.",
    check: "confirmed",
  },
  Utah: {
    lawSays:
      "Utah's title law ties salvage status to an insurer's total-loss declaration. Older versions of the code also treated a car as salvage when repairs would cost more than its fair market value. We could not confirm the current wording, and found no fixed percentage.",
    kind: "title",
    cite: { name: "Utah Code § 41-1a-1001", url: "https://le.utah.gov/xcode/Title41/Chapter1A/41-1A-S1001.html" },
    details: ["Utah does not remove brands from salvage titles, and brands from other states carry over."],
    keeping: "A totaled car gets a salvage certificate and cannot be driven. After repair it must pass inspection before it can be titled as rebuilt and registered.",
    brands: ["Salvage", "Rebuilt/restored"],
    titleAgency: { name: "Utah Division of Motor Vehicles", url: "https://dmv.utah.gov/titles-overview/salvage-vehicles/" },
    regulator: { name: "Utah Insurance Department", url: "https://insurance.utah.gov/" },
    changes: [
      {
        date: "2027-01-01",
        text: "H.B. 228 (2026, Vehicle Sales Amendments) rewrites title-brand procedures from January 1, 2027.",
        status: "enacted",
        source: { name: "Utah Legislature, H.B. 228 (2026), enrolled", url: "https://le.utah.gov/Session/2026/bills/enrolled/HB0228.pdf" },
      },
    ],
    listsSay: "Lists put Utah under the Total Loss Formula. That is insurer practice; we found no formula in the code.",
    check: "unconfirmed",
  },
  Vermont: {
    lawSays:
      "Vermont law sets no damage percentage. A totaled motor vehicle is simply one an insurer has declared a total loss, and that insurer must apply for a salvage certificate of title. When to total a car is left to the insurer.",
    kind: "title",
    cite: { name: "23 V.S.A. § 2001", url: "https://legislature.vermont.gov/statutes/section/23/021/02001" },
    details: ["Bills that would have set a percentage (65% in 2020, and another in 2021–22) were not enacted."],
    keeping: "If you keep the car, it goes through the salvage certificate process. Check the DMV's salvage and rebuilt title page for the inspection steps before you repair it.",
    brands: ["Salvage", "Rebuilt"],
    titleAgency: { name: "Vermont DMV, salvage or rebuilt title", url: "https://dmv.vermont.gov/tax-title/vehicle-title/salvage-or-rebuilt-title" },
    regulator: { name: "Vermont Department of Financial Regulation", url: "https://dfr.vermont.gov/" },
    changes: [
      {
        date: "2026-06-16",
        text: "Act 153 (S.326) was signed. It lets the documents that transfer a totaled car to the insurer be signed electronically; it does not change any threshold.",
        status: "enacted",
        source: { name: "Vermont Legislature, S.326 (2026)", url: "https://legislature.vermont.gov/bill/status/2026/S.326" },
      },
    ],
    listsSay: "Some lists show Vermont at 80%. That figure is not in the statute.",
    check: "confirmed",
  },
  Virginia: {
    lawSays:
      "Virginia's main salvage test is a formula: a car is salvage when its repair estimate is more than its actual cash value minus its salvage value. A 75% test applies to recovered stolen cars an insurer acquires and to uninsured or self-insured late-model cars the owner keeps.",
    measuredAgainst: "its actual cash value (retail value before the damage) minus its current salvage value",
    kind: "title",
    cite: { name: "Va. Code § 46.2-1600", url: "https://law.lis.virginia.gov/vacode/title46.2/chapter16/section46.2-1600/" },
    details: [
      "\"Late model\" means the current model year plus the five before it, or any car worth at least $10,000 before the damage.",
      "When no insurer sets a salvage value, the law uses 25% of the car's actual cash value.",
      "Any owner may declare a car salvage voluntarily.",
    ],
    keeping:
      "You can keep the car. A repaired salvage car needs a DMV rebuilt-vehicle examination before it gets a rebuilt title.",
    brands: ["Salvage", "Nonrepairable", "Rebuilt"],
    titleAgency: { name: "Virginia DMV, salvage vehicle law", url: "https://www.dmv.virginia.gov/vehicles/title/sal-veh-law-req/declar-salvage" },
    regulator: { name: "Virginia State Corporation Commission, Bureau of Insurance", url: "https://www.scc.virginia.gov/pages/Bureau-of-Insurance" },
    changes: [],
    listsSay: "Most lists say \"Virginia: 75%\". The main test is the formula above; 75% applies to specific cases.",
    check: "confirmed",
  },
  Washington: {
    lawSays:
      "Washington defines a salvage vehicle as one that has been declared a total loss, or one the owner or insurer finds uneconomical to repair because parts and labor plus salvage value make repair uneconomical. Insurers must report total losses to the Department of Licensing.",
    kind: "title",
    cite: { name: "RCW 46.04.514", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=46.04.514" },
    details: [
      "Cars six or more model years old are generally excluded unless their value before the loss met the state's market value threshold, which is adjusted every year.",
      "Since June 11, 2026, the papers transferring a car to the insurer do not need a notary and may be signed electronically.",
    ],
    keeping: "You can keep the car; the total loss is still reported to the Department of Licensing. A rebuilt car can be retitled with a \"WA REBUILT\" brand.",
    brands: ["Salvage", "WA rebuilt"],
    titleAgency: { name: "Washington Department of Licensing, salvaged vehicles", url: "https://dol.wa.gov/vehicles-and-boats/vehicles/vehicle-registration/vehicle-title/salvaged-vehicles" },
    regulator: { name: "Washington Office of the Insurance Commissioner", url: "https://www.insurance.wa.gov/" },
    changes: [
      {
        date: "2026-06-11",
        text: "HB 2604 removed the notary requirement for documents transferring a totaled car to the insurer.",
        status: "enacted",
        source: { name: "Washington Legislature, HB 2604 session law", url: "https://lawfilesext.leg.wa.gov/biennium/2025-26/Pdf/Bills/Session%20Laws/House/2604.SL.pdf" },
      },
    ],
    listsSay: "Lists call Washington a Total Loss Formula state, which roughly matches its wording, but omit the six-year exclusion and the market value threshold.",
    check: "confirmed",
  },
  "West Virginia": {
    lawSays:
      "West Virginia defines a total loss as a car with damage equal to 75% or more of its market value in a nationally accepted used-car guide, or one that is flood-damaged. When an insurer pays a total-loss claim, it must send the title to the DMV within 10 days.",
    measuredAgainst: "its market value in a nationally accepted used-car guide",
    kind: "title",
    cite: { name: "W. Va. Code § 17A-4-10", url: "https://code.wvlegislature.gov/17A-4-10/" },
    details: [
      "Flood-damaged cars are total losses whatever the percentage.",
      "The state has a separate \"cosmetic total loss\" title for cars whose damage is only cosmetic.",
    ],
    keeping: "Owners may keep certain totaled cars. A rebuilt salvage car is titled \"reconstructed\" and cannot be titled or registered until it is inspected.",
    brands: ["Salvage", "Cosmetic total loss", "Reconstructed", "Flood"],
    titleAgency: { name: "West Virginia Division of Motor Vehicles", url: "https://transportation.wv.gov/DMV/Pages/default.aspx" },
    regulator: { name: "West Virginia Offices of the Insurance Commissioner", url: "https://www.wvinsurance.gov/" },
    changes: [],
    listsSay: "Lists show 75%, which matches, but usually say \"actual cash value\" and leave out the flood and cosmetic-total-loss categories.",
    check: "confirmed",
  },
  Wisconsin: {
    lawSays:
      "Wisconsin defines a salvage vehicle as one less than seven years old whose repair cost is more than 70% of its fair market value. If an insurer pays a claim over 70% of fair market value and you keep the car, the insurer must notify the state so a salvage title is issued.",
    measuredAgainst: "its fair market value",
    kind: "both",
    cite: { name: "Wis. Stat. § 340.01(55g) and § 342.065", url: "https://docs.legis.wisconsin.gov/statutes/statutes/342/065" },
    details: [
      "Cars seven or more years old are outside the salvage definition.",
      "The salvage title carries the words \"This is a salvage vehicle\".",
    ],
    keeping:
      "You can keep the car. The insurer files WisDOT form MV2849 with the \"owner is retaining the vehicle\" option, and WisDOT issues a salvage title.",
    brands: ["Salvage"],
    titleAgency: { name: "Wisconsin DOT", url: "https://www.wisconsindot.gov/Documents/formdocs/mv2849.pdf" },
    regulator: { name: "Wisconsin Office of the Commissioner of Insurance", url: "https://oci.wi.gov/" },
    changes: [],
    listsSay: "Lists show 70%, which matches, but most leave out the under-seven-years limit.",
    check: "confirmed",
  },
  Wyoming: {
    lawSays:
      "Wyoming treats a car as salvage when an insurer declares it a total loss or, when no insurer is involved, when its damage is more than 75% of its actual retail cash value.",
    measuredAgainst: "for uninsured damage, its actual retail cash value",
    kind: "title",
    cite: { name: "Wyo. Stat. § 31-2-107", url: "https://wyoleg.gov/statutes/compress/title31.pdf" },
    details: [
      "The 75% test is a fallback for cases with no insurer. When an insurer is involved, its total-loss declaration alone makes the car salvage.",
      "Salvage titles are issued through the county clerk.",
    ],
    keeping:
      "You or the insurer apply to the county clerk for a title branded \"Salvage\", using the original title and the insurer's letter saying the car was declared a total loss.",
    brands: ["Salvage"],
    titleAgency: { name: "Wyoming DOT, salvage vehicles", url: "https://dot.state.wy.us/home/titles_plates_registration/salvage_vehicles.html" },
    regulator: { name: "Wyoming Department of Insurance", url: "https://doi.wyo.gov/" },
    changes: [],
    listsSay: "Lists show Wyoming at 75% as if insurers must use it. The statute applies 75% only where no insurer is involved.",
    check: "confirmed",
  },
};

export function getStateLawFacts(state: string): StateLawFacts {
  const facts = STATE_LAW_FACTS[state];
  if (!facts) throw new Error(`No total-loss law facts for ${state}`);
  return facts;
}

/** Every dated change across all states, newest first. */
export function getAllThresholdChanges(): (StateChange & { state: string })[] {
  return Object.entries(STATE_LAW_FACTS)
    .flatMap(([state, f]) => f.changes.map((c) => ({ ...c, state })))
    .sort((a, b) => b.date.localeCompare(a.date));
}
