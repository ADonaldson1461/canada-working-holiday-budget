# WH HQ V6.5 — Data system

V6.5 moves the calculator's planning assumptions into canonical JSON files under `/data`.
`data.js` is generated from those files by `build-data.py` so GitHub Pages can use the data without a server or database.

## Canonical files

- `currencies.json` — supported home currencies and CAD reference rates.
- `countries.json` — country → currency mapping used by the calculator.
- `destinations.json` — Canada destination assumptions, accommodation ranges, monthly planning costs and source IDs.
- `job-types.json` — working-holiday job categories, planning wages and hours.
- `taxes-2026.json` — 2026 federal/provincial tax brackets and payroll parameters.
- `immigration-2026.json` — IEC planning requirements and fees.
- `lifestyle.json` — quick-estimate lifestyle presets.
- `fx-2026-08-31.json` — Bank of Canada daily average FX snapshot for 31 August 2026.
- `source-registry.json` — source hierarchy, URLs, verification dates and intended use.

## Data hierarchy

1. **Tier 1:** Government / official sources — preferred for legal, tax, wage-floor and transport figures.
2. **Tier 2:** Primary employers and industry operators — useful for staff accommodation and job-specific information.
3. **Tier 3:** Established market datasets — useful for wages and rental benchmarks.
4. **Tier 4:** Community reports — useful for real-world experience, but never treated as definitive for legal or tax facts.

## Planning-number methodology

WH HQ deliberately avoids fake precision. Where market data varies, the JSON stores a low/high range and a single planning assumption used by the calculator. The planning assumption is not presented as a guaranteed market price.

Examples:

- Whistler staff accommodation: current worker reports show roughly C$260–285 biweekly for shared Vail staff housing; V6.5 uses C$600/month as a planning assumption and C$500–650 as the observed planning range.
- Banff employee accommodation: current employer examples show roughly C$8–16.50/day or C$12–17/day depending on room type; V6.5 uses C$500/month for a shared staff option.
- Vancouver transit: V6.5 uses the 2026 TransLink 1-zone adult monthly pass of C$117.20.
- Calgary transit: V6.5 uses the 2026 adult monthly pass of C$126.
- Toronto transit: V6.5 uses C$156 as a conservative planning figure; TTC monthly fare capping begins 1 September 2026, so this value should be reviewed in the next data cycle.

## Tax model disclaimer

The calculator is a planning model, not tax advice or a tax-return calculator. It models 2026 federal/provincial tax, CPP/QPP, EI and QPIP using published parameters, but a working holidaymaker's actual tax result can differ because of residency status, partial-year income, credits, deductions, payroll withholding and refunds.

## Updating the data

1. Edit the relevant JSON file under `/data`.
2. Update `lastVerified`/source information where appropriate.
3. Run:

```bash
python build-data.py
```

4. Commit the changed JSON file(s), `data.js`, and `DATA-SOURCES.md` to GitHub.

The next phase should automate **change detection and review alerts**. Automated research should propose changes; important financial/immigration changes should be human-approved before publication.
