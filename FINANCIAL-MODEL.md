# WH HQ V6.5 Financial Model

## Purpose
The calculator is a planning tool for working holidaymakers. It estimates cash flow and affordability; it is not tax, immigration or financial advice.

## Currency
All calculations are performed internally in CAD. Inputs and outputs can be displayed in the user's home currency using the Bank of Canada daily-average FX snapshot dated 31 August 2026.

## Income
Full Planner estimates annual gross employment income from hourly wage × hours/week × 52. It applies 2026 federal/provincial income-tax brackets plus CPP/EI, with Quebec using QPP/EI/QPIP parameters. The result is labelled estimated take-home because actual payroll withholding and annual tax outcomes vary.

## Costs
Destination data stores a planning value plus observed ranges where available. Accommodation, food, transport, phone and lifestyle costs are planning assumptions rather than guarantees.

## Immigration setup
The 2026 IEC planning data includes C$2,500 proof of funds, C$184.75 IEC fee, C$100 Working Holiday open work permit holder fee and C$85 biometrics fee where applicable. Users are directed to verify current IRCC requirements before applying or travelling.

## Scenarios
Full Planner stress-tests job-search delays and projects cash balances over 6–12 months.

## Data governance
Canonical data lives under `/data`. Each important dataset has source IDs and verification dates in `source-registry.json`.
