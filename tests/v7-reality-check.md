# WH HQ V7.0 — Financial Reality Check

V7.0 deliberately does **not** add new customer-facing calculator functionality. The goal is to prove that the existing Quick Estimate produces sensible planning numbers before we add more complexity.

## Reference traveller

- Home country: Australia
- Starting savings: A$20,000
- Destination: Whistler, BC
- Trip length: 12 months
- Accommodation: staff accommodation
- Lifestyle: Normal
- Work: Yes
- Job type: Hospitality / server
- Wage: C$22/hour
- Hours: 32/week
- First paycheque: 4 weeks
- Flight: C$1,200 planning assumption
- Temporary accommodation: 2 weeks at C$400/week
- Deposit/bond: C$500
- Insurance: C$1,000
- Gear: C$750
- Other setup: C$300

## Current WH HQ planning inputs

The scenario uses the current canonical V6.9 data. The calculator keeps the underlying calculation in CAD and converts the traveller's savings/input values from AUD using the stored Bank of Canada reference rate.

For this test case, the current data gives:

- AUD → CAD reference rate: 0.9934
- Whistler staff accommodation: C$600/month
- Food: C$550/month
- Transport: C$55/month
- Phone: C$35/month
- Entertainment: C$350/month
- Miscellaneous: C$200/month
- Hospitality planning wage: C$22/hour
- Hours: 32/week

## Independent calculation check

Using the same simplified planning model as the current calculator:

- Gross annual income: **C$36,608**
- Gross monthly income: **C$3,051**
- Estimated federal tax: **C$2,612/year**
- Estimated BC tax: **C$1,310/year**
- Estimated CPP: **C$1,970/year**
- Estimated EI: **C$597/year**
- Estimated net monthly income: **~C$2,510**
- Monthly living cost: **C$1,790**
- Monthly surplus while working: **~C$720**
- Starting savings converted to CAD: **~C$19,868**
- One-off/arrival setup costs in this scenario: **~C$4,920**
- Cash after setup: **~C$14,948**

With a four-week first-paycheque delay, the model should show a materially lower early cash position than a simple annualised calculation. This is important: the next calculator improvement should focus on communicating runway and risk, not adding more input fields.

## Reality check conclusion

The scenario is **financially plausible but not luxurious**. The traveller has a substantial starting buffer, staff accommodation keeps monthly burn relatively low, and a 32-hour hospitality job at C$22/hour produces a positive planning surplus.

The model should **not** present the result as a guarantee. Working hours, job-search time, tips, tax residency, refunds, accommodation availability, travel, seasonal gaps and personal spending can materially change the outcome.

## Data verification sources

- Canada Revenue Agency — 2026 federal and provincial tax rates: https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/current-year.html
- Canada Revenue Agency — 2026 CPP/EI payroll parameters: https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4032-payroll-deductions-tables/t4032oc-january-general-information.html
- Government of British Columbia — 2026 minimum wage: https://news.gov.bc.ca/releases/2026LBR0021-000581
- Bank of Canada — daily exchange rates: https://www.bankofcanada.ca/rates/exchange/daily-exchange-rates-lookup/

## V7.0 product decision

Do **not** add additional customer inputs merely because the model can support them. The Quick Estimate should remain the default and answer the core question quickly:

> **Can I realistically afford this working holiday?**

Full Planner remains an optional deeper tool for users who want to explore assumptions they already know. The rest of WH HQ — Guides, Work, Accommodation, Plan and Map — should do the job of helping users discover information they do not know yet.
