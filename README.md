# WH HQ V6.7

V6.7 adds the complete WH HQ Research Engine backend foundation.

## Customer-facing product
The existing WH HQ website and calculator remain intact. V6.7 focuses on the system behind them.

## Research Engine
- Approved source registry and watchlist
- Dataset registry
- Source snapshots and hash-based change detection
- Canonical dataset change detection
- Evidence/report folders
- Review queue and human approval workflow
- Data validation
- Scheduled GitHub Actions workflow
- Research architecture and operating documentation

## Important
Automation detects and proposes changes. It does not silently modify customer-facing data.

## GitHub upload
Replace/add the repository files from this package. Make sure the `.github/workflows/research.yml` file is included; GitHub Actions requires that exact folder structure.

## Local research command
`python research/run_engine.py`

## Build customer-facing data
`python build-data.py`
