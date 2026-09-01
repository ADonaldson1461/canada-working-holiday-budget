# WH HQ Research Engine Architecture

## Layers

1. **Source registry** — approved sources, priority, cadence and purpose.
2. **Watcher** — fetches only approved public sources and stores normalised snapshots.
3. **Change detection** — compares snapshots and canonical datasets using hashes.
4. **Evidence/reports** — records what changed and where failures occurred.
5. **Review queue** — pending changes are explicitly approved or rejected.
6. **Canonical data** — `/data/*.json` remains the customer-facing source of truth.
7. **Build layer** — `build-data.py` produces browser-readable `data.js`.

## Fail-safe principles

A failed request cannot become a data update. A changed webpage is only a signal for review. Immigration, tax and other critical financial facts require human approval before publication.

## Future intelligence layer

The architecture is designed for a later research agent that can compare old/new evidence, extract factual changes, map them to datasets and produce a proposed update. That agent should remain separated from publication until reviewed.
