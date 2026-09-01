# WH HQ V6.5

V6.5 introduces the WH HQ data foundation: canonical JSON planning data, source registry, 31 August 2026 Bank of Canada FX snapshot, 2026 Canadian tax/payroll parameters, destination assumptions and a reproducible data build script.

## Build data.js

Edit the JSON files under `data/`, then run `python build-data.py`. Do not edit `data.js` directly.

## Data philosophy

Official sources are preferred for legal, tax, wage-floor and transit facts. Market assumptions use ranges and confidence levels rather than false precision. Community reports are used only as supporting evidence for lived-experience items such as staff accommodation.
