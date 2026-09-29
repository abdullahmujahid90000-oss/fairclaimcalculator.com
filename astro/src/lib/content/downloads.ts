/**
 * Landing-page content for each free PDF template under /forms/<slug>/.
 * The PDF itself is generated from scripts/pdf-templates.mjs (same slugs;
 * tests/downloads.test.ts keeps the two lists in sync).
 */
import type { FaqItem } from "@lib/seo/faq-schema";

export interface DownloadPage {
  slug: string;
  /** H1 and card title. */
  title: string;
  /** <title> tag — written for what people search. */
  metaTitle: string;
  description: string;
  /** Short line for hub cards. */
  cardText: string;
  whenToUse: string[];
  howTo: string[];
  faqs: FaqItem[];
  related: { label: string; href: string }[];
}

export const DOWNLOADS_REVIEWED = "2026-09-29";

export const DOWNLOAD_PAGES: DownloadPage[] = [
  {
    slug: "accident-information-worksheet",
    title: "Car Accident Information Worksheet (Free PDF)",
    metaTitle: "Car Accident Information Sheet — Free Printable PDF",
    description:
      "Free fillable car accident information sheet: what to collect at the scene — other driver, insurance, witnesses, police report number and photos. Print it for your glove box.",
    cardText: "Keep it in your glove box. Everything to collect at the scene of a crash.",
    whenToUse: [
      "Right after a crash, once everyone is safe and off the road.",
      "When police don't come to the scene and you need your own record of what happened.",
      "Before you call your insurer, so you have every detail in one place.",
    ],
    howTo: [
      "Print two copies and keep them in your glove box with a pen. You can also fill the PDF on your phone.",
      "At the scene, fill in the crash details first: date, time, exact location, and whether police came and the report number.",
      "Copy the other driver's details from their license and insurance card — not from memory. A photo of both (with permission) avoids mistakes.",
      "Get witness names and phone numbers before they leave. They are hard to find later.",
      "Write down what happened in order while it's fresh. Stick to facts; don't guess about speed or fault.",
      "Work through the checklist at the end, including your state's crash-reporting rule.",
    ],
    faqs: [
      {
        question: "What information should you exchange after a car accident?",
        answer:
          "At minimum: the other driver's name, phone, address, driver's license number, plate number, vehicle description, insurance company and policy number. Most states require drivers to exchange name, address and registration information, and some also require license and insurance details. Also note the police report number if police came.",
      },
      {
        question: "Should I admit fault at the scene?",
        answer:
          "No. Describe what happened factually to the police and your insurer, but don't apologize in a way that sounds like admitting fault or sign any statement other than a police form. Fault is decided later from the evidence.",
      },
      {
        question: "Do I have to report the accident to the state as well as the police?",
        answer:
          "It depends on the state. Some states (such as California and New York) require your own written report to the DMV above a damage threshold, even if police came. Others only require you to notify police. Check your state on our accident-reporting page.",
      },
    ],
    related: [
      { label: "Car accident reporting rules by state", href: "/guides/accident-reporting/" },
      { label: "Auto claim evidence checklist (PDF)", href: "/forms/claim-evidence-checklist/" },
      { label: "Auto Claim Evidence Checklist guide", href: "/guides/claim-process/auto-claim-evidence-checklist/" },
    ],
  },
  {
    slug: "claim-communication-log",
    title: "Insurance Claim Communication Log (Free PDF)",
    metaTitle: "Insurance Claim Log Template — Free Fillable PDF",
    description:
      "Free fillable insurance claim communication log. Record every call, email and letter with your adjuster — dates, names, what was agreed and next steps.",
    cardText: "Record every call, email and letter with your adjuster.",
    whenToUse: [
      "From the first call to your insurer until the claim is paid and closed.",
      "Whenever an adjuster promises something by phone — log it, then confirm it by email.",
      "Before filing a complaint with your state insurance department, which will ask for a timeline.",
    ],
    howTo: [
      "Fill in the claim number, insurer and adjuster details at the top.",
      "Add a row for every contact, the same day: date, who you spoke to, how, what was said, and the next step with its due date.",
      "After any important phone call, send a short email summarizing it (\"As we discussed today…\") and log that too.",
      "Keep the log with copies of every letter and email. If the claim stalls, the log shows exactly where and when.",
    ],
    faqs: [
      {
        question: "Why keep a log of insurance claim calls?",
        answer:
          "Phone calls leave no record. A dated log shows when you responded, what you were told and what the insurer promised. It makes follow-ups specific and is the first thing a state insurance department or attorney will ask for.",
      },
      {
        question: "Should I record my calls with the adjuster?",
        answer:
          "Recording laws differ by state — some require everyone on the call to consent. A simpler and always-legal approach is to log each call and confirm the key points in a follow-up email.",
      },
    ],
    related: [
      { label: "Insurance department complaint worksheet (PDF)", href: "/forms/insurance-complaint-worksheet/" },
      { label: "How to respond to a lowball offer", href: "/guides/claim-process/how-to-respond-to-a-lowball-offer/" },
      { label: "Filing a complaint with your state insurance department", href: "/guides/claim-process/filing-a-complaint-with-your-state-insurance-department/" },
    ],
  },
  {
    slug: "total-loss-valuation-dispute-letter",
    title: "Total-Loss Valuation Dispute Letter (Free PDF Template)",
    metaTitle: "Total Loss Dispute Letter Template — Free PDF",
    description:
      "Free fillable letter template to dispute a low total-loss offer: ask your insurer to review the valuation, list report errors and your comparable vehicles.",
    cardText: "Ask your insurer in writing to review a low total-loss valuation.",
    whenToUse: [
      "Your car was declared a total loss and the actual cash value (ACV) offer seems low.",
      "The valuation report has wrong facts — trim, options, mileage or condition.",
      "You found comparable vehicles listed or sold for more than the insurer's figure.",
    ],
    howTo: [
      "Get the full valuation report from your insurer first. You're entitled to see how they reached the number.",
      "Run your numbers through the Total-Loss Offer Audit calculator to spot errors and gaps.",
      "Fill in the letter: your offered ACV, the ACV you believe is supported, the facts that don't match, and your comparables.",
      "Keep the tone factual. Ask for a written response and the basis for their decision.",
      "Attach your evidence (use the checklist at the bottom) and keep a copy of everything you send.",
    ],
    faqs: [
      {
        question: "Can I negotiate a total-loss settlement offer?",
        answer:
          "Yes. A total-loss offer is the insurer's estimate of your vehicle's actual cash value, and you can ask them to review it with evidence — errors in the report, better comparable vehicles, and receipts for recent work or upgrades.",
      },
      {
        question: "What if the insurer won't change the offer?",
        answer:
          "Many policies include an appraisal clause that lets each side hire an appraiser, with an umpire resolving differences. You can also file a complaint with your state insurance department. See our guide on when to consider an independent appraisal or attorney.",
      },
      {
        question: "Should I cash the settlement check while disputing?",
        answer:
          "Read what the check and any release say before depositing it. Some settlement documents state that accepting payment closes the claim. If you're unsure, ask the insurer in writing whether cashing it waives your dispute.",
      },
    ],
    related: [
      { label: "Total-Loss Offer Audit calculator", href: "/calculators/total-loss-offer-audit/" },
      { label: "Comparable vehicles worksheet (PDF)", href: "/forms/comparable-vehicles-worksheet/" },
      { label: "How to dispute a total-loss valuation", href: "/guides/total-loss/how-to-dispute-a-total-loss-valuation/" },
      { label: "Common valuation report errors", href: "/guides/total-loss/common-valuation-report-errors/" },
    ],
  },
  {
    slug: "diminished-value-claim-letter",
    title: "Diminished Value Claim Letter (Free PDF Template)",
    metaTitle: "Diminished Value Claim Letter Template — Free PDF",
    description:
      "Free fillable diminished value demand letter template. Present the loss in your car's resale value after an accident repair, with a checklist of evidence to attach.",
    cardText: "Claim the loss in resale value after your car is repaired.",
    whenToUse: [
      "Your car was repaired after a crash that someone else caused, and its resale value dropped because of the accident history.",
      "You've gathered evidence of the value drop: an appraisal, dealer quotes, or market listings.",
      "Your state allows the kind of diminished-value claim you're making — check our state-law guide first.",
    ],
    howTo: [
      "Confirm your claim type: third-party (against the at-fault driver's insurer) is allowed in most states; first-party (against your own insurer) is limited.",
      "Estimate a baseline with the Diminished Value calculator, then back it up with real market evidence.",
      "Fill in the pre-loss value, post-repair value and the difference you're claiming, and explain how each was determined.",
      "Summarize the repairs, especially structural or frame work, which affects resale value most.",
      "Attach the evidence listed at the bottom and ask for a written response.",
    ],
    faqs: [
      {
        question: "What is a diminished value claim?",
        answer:
          "It's a claim for the loss in your vehicle's market value because it now has an accident and repair history, even after good repairs. Buyers typically pay less for a car with a reported accident.",
      },
      {
        question: "Is the 17c formula the right way to calculate diminished value?",
        answer:
          "It's a common insurer starting point, not a legal standard, and it often produces low numbers. Market evidence — what similar cars with and without accident history actually sell for — is usually stronger. Our 17c guide explains its history and limits.",
      },
      {
        question: "Can I claim diminished value from my own insurance?",
        answer:
          "Usually not, except in a few states and situations. Most diminished-value claims are made against the at-fault driver's insurer. See our state-law guide for first-party diminished value.",
      },
    ],
    related: [
      { label: "Diminished Value calculator", href: "/calculators/diminished-value-baseline/" },
      { label: "What is diminished value?", href: "/guides/diminished-value/what-is-diminished-value/" },
      { label: "First-party diminished value by state", href: "/guides/diminished-value/state-laws-first-party-diminished-value-claims/" },
      { label: "Building diminished-value market evidence", href: "/guides/diminished-value/building-diminished-value-market-evidence/" },
    ],
  },
  {
    slug: "comparable-vehicles-worksheet",
    title: "Comparable Vehicles Worksheet (Free PDF)",
    metaTitle: "Total Loss Comparable Vehicles Worksheet — Free PDF",
    description:
      "Free fillable worksheet for gathering comparable vehicle listings to check a total-loss valuation: price, mileage, distance, listing date and URL, with a summary.",
    cardText: "Collect comparable listings to check your insurer's ACV.",
    whenToUse: [
      "You're checking whether a total-loss offer matches the local market.",
      "The insurer's comparables are a different trim, far away, or much higher mileage than your car.",
    ],
    howTo: [
      "Search for the same year, make, model and trim, with mileage close to yours, near your ZIP code.",
      "Record each listing's price, mileage, seller and distance, listing date and URL. Save a screenshot too — listings disappear.",
      "Aim for at least three to five strong comparables. Note why any one is better or worse than your vehicle.",
      "Average your comparables and compare with the insurer's ACV in the summary box.",
    ],
    faqs: [
      {
        question: "What makes a good comparable vehicle?",
        answer:
          "Same year, make, model and trim; similar mileage, options and condition; listed or sold recently and close to where you live. The closer the match, the harder it is to dismiss.",
      },
      {
        question: "Should I use asking prices or sold prices?",
        answer:
          "Use both if you can and label which is which. Valuation reports often adjust asking prices down; sold prices are stronger evidence when you can find them.",
      },
    ],
    related: [
      { label: "Finding your own comparable vehicles", href: "/guides/total-loss/finding-your-own-comparable-vehicles/" },
      { label: "Total-Loss Offer Audit calculator", href: "/calculators/total-loss-offer-audit/" },
      { label: "Total-loss dispute letter (PDF)", href: "/forms/total-loss-valuation-dispute-letter/" },
    ],
  },
  {
    slug: "rental-loss-of-use-log",
    title: "Rental Car and Loss-of-Use Expense Log (Free PDF)",
    metaTitle: "Loss of Use & Rental Car Expense Log — Free PDF",
    description:
      "Free fillable log for rental car and loss-of-use expenses after an accident. Track daily costs against your policy's rental limits and total what you can claim.",
    cardText: "Track every day without your car and every cost it caused.",
    whenToUse: [
      "Your car is in the shop or being evaluated as a total loss and you're paying for a rental or other transport.",
      "You're claiming loss of use from the at-fault driver's insurer.",
    ],
    howTo: [
      "Write your policy's rental limits at the top — per day and total. They're on your declarations page.",
      "Log each day: rental cost, any other transport (rideshare, transit), whether you have a receipt, and notes.",
      "Keep every receipt. Totals at the bottom become the amount you claim.",
      "Check your figures with the Loss of Use calculator before you submit them.",
    ],
    faqs: [
      {
        question: "What is loss of use in a car insurance claim?",
        answer:
          "Compensation for the time you couldn't use your vehicle because of the damage — typically rental car costs, or a daily amount if you didn't rent. It's usually claimed from the at-fault driver's insurer; your own policy's rental coverage has its own limits.",
      },
      {
        question: "How long will insurance pay for a rental car?",
        answer:
          "Your own policy's rental coverage sets a daily and total limit. A claim against the at-fault driver's insurer is generally for a reasonable repair or replacement period. Delays you document may support a longer period.",
      },
    ],
    related: [
      { label: "Loss of Use calculator", href: "/calculators/loss-of-use-reimbursement/" },
      { label: "Rental car & loss-of-use reimbursement guide", href: "/guides/claim-process/rental-car-loss-of-use-reimbursement/" },
    ],
  },
  {
    slug: "insurance-complaint-worksheet",
    title: "Insurance Department Complaint Worksheet (Free PDF)",
    metaTitle: "How to File an Insurance Complaint — Free Worksheet PDF",
    description:
      "Free fillable worksheet to prepare a complaint to your state insurance department about an auto claim: timeline, what went wrong, the outcome you want, and documents to attach.",
    cardText: "Prepare a clear, complete complaint to your state insurance department.",
    whenToUse: [
      "Your insurer stopped responding, missed deadlines, or denied or underpaid a claim without a clear reason.",
      "You've already asked the insurer in writing to fix it and haven't had a satisfactory answer.",
    ],
    howTo: [
      "Collect your claim communication log and every letter and email from the insurer.",
      "Write a dated timeline: each contact, offer and response.",
      "Describe what you believe was handled unfairly, then the specific outcome you want.",
      "Find your state's insurance department in the NAIC directory and file online or by mail, attaching the documents listed.",
    ],
    faqs: [
      {
        question: "Does it cost anything to file an insurance complaint?",
        answer:
          "No. State insurance departments take consumer complaints for free. They can require the insurer to respond, but they generally can't award damages or act as your lawyer.",
      },
      {
        question: "What happens after I file a complaint?",
        answer:
          "The department usually forwards it to the insurer and asks for a written response, then reviews whether the insurer followed state law. Timelines vary by state. See our complaint guide for what a department can and can't do.",
      },
    ],
    related: [
      { label: "Filing a complaint with your state insurance department", href: "/guides/claim-process/filing-a-complaint-with-your-state-insurance-department/" },
      { label: "Claim communication log (PDF)", href: "/forms/claim-communication-log/" },
      { label: "When to consider an independent appraisal or attorney", href: "/guides/claim-process/when-to-consider-an-independent-appraisal-or-attorney/" },
    ],
  },
  {
    slug: "claim-evidence-checklist",
    title: "Auto Insurance Claim Evidence Checklist (Free PDF)",
    metaTitle: "Car Insurance Claim Checklist — Free Printable PDF",
    description:
      "Free printable checklist of the documents and evidence for a car insurance claim: crash reports, photos, vehicle records, valuation reports, receipts and your claim log.",
    cardText: "Every document to gather, from the crash to the settlement.",
    whenToUse: [
      "As soon as you open a claim, to see what you'll need.",
      "Before disputing a repair estimate or total-loss offer.",
    ],
    howTo: [
      "Print it or fill it on screen and tick items as you collect them.",
      "Store everything in one folder (paper or digital), named by date.",
      "Send the insurer copies, never originals, and log what you sent and when.",
    ],
    faqs: [
      {
        question: "What documents do I need for a car insurance claim?",
        answer:
          "Typically: the police report or report number, photos of the damage and scene, the other driver's information, your policy and claim numbers, repair estimates or the valuation report, and receipts for related costs such as towing and rental.",
      },
      {
        question: "What if I don't have a police report?",
        answer:
          "Some states let you file your own crash report when police didn't come, and some require it. Check your state's rule, and keep your own photos, notes and witness details either way.",
      },
    ],
    related: [
      { label: "Auto Claim Evidence Checklist guide", href: "/guides/claim-process/auto-claim-evidence-checklist/" },
      { label: "Car accident reporting rules by state", href: "/guides/accident-reporting/" },
      { label: "Car accident information worksheet (PDF)", href: "/forms/accident-information-worksheet/" },
    ],
  },
];
