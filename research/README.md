# WH HQ Research Engine — V6.7

The Research Engine monitors approved public sources, records evidence snapshots, detects changes and creates review items. It does **not** silently change customer-facing data.

## Flow

Approved sources → fetch → normalise → snapshot → compare → report → human review → canonical `/data` → `build-data.py` → `data.js`

## Safety rules

- Government/legal/tax/immigration changes require human approval.
- A source failure never becomes a data change.
- A detected page change is not automatically treated as a factual change.
- Canonical `/data` remains the publication source of truth.
- Every accepted baseline is timestamped.

## Local commands

```bash
python research/run_engine.py
python research/validate_data.py
```

The watcher requires only Python's standard library. Network access is needed for source checks.
