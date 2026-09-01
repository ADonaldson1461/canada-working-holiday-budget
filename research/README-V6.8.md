# V6.8 Research Intelligence

Run locally:

`python research/validate_data.py`

`python research/watch_sources.py`

`python research/check_changes.py`

`python research/intelligence.py`

The intelligence layer classifies detected source changes, produces a bounded evidence diff, identifies affected datasets, and creates a human-reviewable proposal. It never edits `data.js` or publishes proposed values.
