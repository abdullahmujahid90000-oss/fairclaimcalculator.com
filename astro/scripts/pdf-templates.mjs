// Content for the free fillable PDF templates at /downloads/*.pdf. Each
// template is a list of blocks rendered by scripts/generate-pdfs.mjs.
// Block types:
//   { h: "Heading" }                       section heading
//   { p: "Paragraph text" }                instructions / body text
//   { field: "Label", lines?: n }          fillable text box (lines > 1 = multi-line)
//   { row: ["Label A", "Label B", ...] }   several short fields side by side
//   { check: "Checklist item" }            fillable checkbox
//   { table: ["Col A", "Col B"], rows: n } fillable grid
//
// These are original templates written for this site — not copies of any
// insurer's or state agency's form. Official state crash-report forms are
// linked from each state's page instead of being re-hosted, because states
// revise them and an old copy can be rejected.

export const PDF_TEMPLATES = [
  {
    slug: "accident-information-worksheet",
    title: "Car Accident Information Worksheet",
    intro:
      "Print this and keep it in your glove box. After a crash, once everyone is safe, fill it in at the scene. It covers what insurers and state crash reports usually ask for.",
    blocks: [
      { h: "The crash" },
      { row: ["Date", "Time", "Weather / road conditions"] },
      { field: "Exact location (street, cross street, city, state)" },
      { row: ["Police called? (yes/no)", "Police agency", "Report / case number"] },
      { row: ["Officer name", "Badge number", "Towed? Where to?"] },
      { h: "Other driver" },
      { row: ["Full name", "Phone"] },
      { field: "Address" },
      { row: ["Driver's license # and state", "Plate # and state"] },
      { row: ["Vehicle year / make / model / color", "Owner (if not the driver)"] },
      { row: ["Insurance company", "Policy number"] },
      { h: "Witnesses" },
      { row: ["Witness 1 name", "Phone"] },
      { row: ["Witness 2 name", "Phone"] },
      { h: "What happened and the damage" },
      { field: "Describe what happened, in order", lines: 4 },
      { field: "Damage to your vehicle", lines: 2 },
      { field: "Injuries (anyone, however minor)", lines: 2 },
      { h: "Before you leave the scene" },
      { check: "Photos of all vehicles, plates, damage, the scene, road signs and skid marks" },
      { check: "Photo of the other driver's license and insurance card (with permission)" },
      { check: "Checked your state's crash-reporting rule (fairclaimcalculator.com/guides/accident-reporting/)" },
      { check: "Did not admit fault or sign anything except a police form" },
    ],
  },
  {
    slug: "claim-communication-log",
    title: "Insurance Claim Communication Log",
    intro:
      "Record every call, email and letter about your claim. A dated log is the simplest evidence that you responded on time and what you were told.",
    blocks: [
      { row: ["Claim number", "Insurance company", "Date of loss"] },
      { row: ["Adjuster name", "Adjuster phone", "Adjuster email"] },
      { h: "Contact log" },
      { table: ["Date", "Who (name / role)", "How (call / email / letter)", "What was said or agreed", "Next step / due date"], rows: 24 },
    ],
  },
  {
    slug: "total-loss-valuation-dispute-letter",
    title: "Total-Loss Valuation Review Request Letter",
    intro:
      "Use this to ask your insurer, in writing, to review a total-loss valuation you think is too low. Keep it factual and attach your evidence. Edit any sentence that doesn't fit your situation.",
    blocks: [
      { row: ["Your name", "Date"] },
      { field: "Your address" },
      { row: ["Insurance company", "Adjuster name"] },
      { row: ["Claim number", "Policy number", "Date of loss"] },
      { field: "Vehicle (year, make, model, trim, VIN, mileage)" },
      { p: "Re: Request for review of total-loss valuation" },
      { p: "I received your valuation of my vehicle, which states an actual cash value (ACV) of the amount below. I am asking you to review it for the reasons listed, and to send me a copy of the full valuation report, including the comparable vehicles and every condition and option adjustment used." },
      { row: ["Your offered ACV ($)", "ACV I believe is supported ($)"] },
      { field: "Facts in the report that don't match my vehicle (trim, options, mileage, condition)", lines: 3 },
      { field: "Comparable vehicles I found (year/make/model, mileage, price, where listed, date)", lines: 4 },
      { field: "Other items to review (taxes, title and registration fees, prior repairs, aftermarket parts)", lines: 3 },
      { p: "Please reply in writing with your decision and the basis for it. If you need anything else from me, let me know what and I will send it promptly." },
      { row: ["Signature", "Phone / email"] },
      { h: "Attachments" },
      { check: "Copy of the insurer's valuation report" },
      { check: "Comparable vehicle listings (with dates and URLs)" },
      { check: "Maintenance and repair receipts / recent upgrades" },
      { check: "Photos of the vehicle before the loss" },
    ],
  },
  {
    slug: "diminished-value-claim-letter",
    title: "Diminished Value Claim Letter",
    intro:
      "Use this to present a diminished-value claim — the loss in resale value after a vehicle is repaired. Rules differ by state and by whether the claim is against the at-fault driver's insurer or your own. Read our diminished-value guides first.",
    blocks: [
      { row: ["Your name", "Date"] },
      { field: "Your address" },
      { row: ["Insurance company", "Adjuster name"] },
      { row: ["Claim number", "Their insured's name (if third-party)", "Date of loss"] },
      { field: "Vehicle (year, make, model, trim, VIN, mileage at time of loss)" },
      { p: "Re: Diminished value claim" },
      { p: "My vehicle was damaged in the loss above and has been repaired. Because the vehicle now has an accident and repair history, its market value is lower than it would have been without the loss. I am presenting a claim for that diminished value and have enclosed the supporting evidence listed below." },
      { row: ["Pre-loss value ($)", "Post-repair value ($)", "Diminished value claimed ($)"] },
      { field: "How these values were determined (appraisal, dealer quotes, market listings)", lines: 3 },
      { field: "Repair summary (repair cost, structural or frame repairs, parts replaced)", lines: 3 },
      { p: "Please review the enclosed documents and respond in writing. I am happy to provide anything else you need to evaluate this claim." },
      { row: ["Signature", "Phone / email"] },
      { h: "Attachments" },
      { check: "Final repair invoice and photos" },
      { check: "Independent appraisal or dealer trade-in quotes (with and without accident history)" },
      { check: "Vehicle history report showing the accident" },
      { check: "Diminished value calculation (fairclaimcalculator.com/calculators/diminished-value-baseline/)" },
    ],
  },
  {
    slug: "comparable-vehicles-worksheet",
    title: "Comparable Vehicles Worksheet",
    intro:
      "Gather listings for vehicles as close to yours as possible: same year, make, model and trim, similar mileage, sold or listed near you, recently. Record each one here, then compare with the comparables in your insurer's report.",
    blocks: [
      { row: ["Your vehicle (year / make / model / trim)", "Your mileage", "Your ZIP code"] },
      { h: "Comparable vehicles" },
      { table: ["Year / make / model / trim", "Mileage", "Asking or sold price", "Dealer / seller and distance", "Listing date and URL"], rows: 10 },
      { h: "Summary" },
      { row: ["Average price of your comparables ($)", "Insurer's ACV ($)", "Difference ($)"] },
      { field: "Notes on why any comparable is better or worse than your vehicle", lines: 3 },
    ],
  },
  {
    slug: "rental-loss-of-use-log",
    title: "Rental Car and Loss-of-Use Expense Log",
    intro:
      "Track every day you were without your vehicle and every cost that came with it. Keep receipts. Most policies cap rental coverage per day and in total — note those limits at the top.",
    blocks: [
      { row: ["Claim number", "Date vehicle became unusable", "Date repaired / settled"] },
      { row: ["Policy rental limit per day ($)", "Policy rental limit total ($)", "Rental company"] },
      { h: "Daily log" },
      { table: ["Date", "Rental cost ($)", "Other transport (rideshare, transit) ($)", "Receipt? (Y/N)", "Notes"], rows: 16 },
      { row: ["Total rental ($)", "Total other transport ($)", "Total claimed ($)"] },
    ],
  },
  {
    slug: "insurance-complaint-worksheet",
    title: "State Insurance Department Complaint Worksheet",
    intro:
      "If your insurer won't respond or you believe your claim was handled unfairly, you can file a free complaint with your state insurance department. Fill this in first so the complaint is complete, dated and easy to follow.",
    blocks: [
      { row: ["Your name", "Phone", "Email"] },
      { row: ["Insurance company", "Claim number", "Policy number"] },
      { row: ["Date of loss", "Date claim filed", "Adjuster name"] },
      { h: "What happened" },
      { field: "Timeline of the claim (dates of each contact, offer and response)", lines: 5 },
      { field: "What you believe was handled unfairly or not answered", lines: 4 },
      { field: "What outcome you are asking for", lines: 2 },
      { h: "Documents to attach" },
      { check: "Your claim communication log" },
      { check: "Every letter and email from the insurer" },
      { check: "Valuation report or repair estimate" },
      { check: "Your written requests and any responses" },
      { p: "Find your state insurance department: content.naic.org/state-insurance-departments. How to file: fairclaimcalculator.com/guides/claim-process/filing-a-complaint-with-your-state-insurance-department/" },
    ],
  },
  {
    slug: "claim-evidence-checklist",
    title: "Auto Claim Evidence Checklist",
    intro:
      "Tick off each item as you collect it. Stronger evidence means fewer back-and-forth requests and a clearer basis for any disagreement with the insurer.",
    blocks: [
      { h: "The crash" },
      { check: "Police crash report or report number" },
      { check: "Your state's driver crash report, if one was required" },
      { check: "Photos of the scene, all vehicles, plates and damage" },
      { check: "Witness names and phone numbers" },
      { h: "Your vehicle" },
      { check: "Title and registration" },
      { check: "Window sticker or build sheet (trim and options)" },
      { check: "Maintenance and repair records" },
      { check: "Receipts for recent tires, brakes, upgrades or aftermarket parts" },
      { check: "Photos of the vehicle before the loss" },
      { h: "The claim" },
      { check: "Insurer's repair estimate or total-loss valuation report" },
      { check: "Your own comparable vehicle listings" },
      { check: "Loan or lease payoff statement" },
      { check: "Rental and transport receipts" },
      { check: "Claim communication log" },
      { check: "Medical bills and records (if anyone was hurt)" },
    ],
  },
];
