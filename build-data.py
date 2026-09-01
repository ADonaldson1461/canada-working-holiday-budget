#!/usr/bin/env python3
"""Build the browser-readable data.js from the canonical JSON files in /data."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"

def load(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))

currencies = load("currencies.json")
countries = load("countries.json")
cities = load("destinations.json")
job_types = load("job-types.json")
tax = load("taxes-2026.json")
lifestyle = load("lifestyle.json")
immigration = load("immigration-2026.json")
sources = load("source-registry.json")
fx = load("fx-2026-08-31.json")

config = {
    "version": "6.7",
    "updated": "September 2026",
    "dataLastVerified": "1 September 2026",
    "fxDate": "31 August 2026",
    "fxSource": "Bank of Canada daily average exchange rates",
    "currencies": currencies,
    "countries": countries,
    "cities": cities,
    "jobTypes": job_types,
    "taxModel": tax,
    "lifestyle": lifestyle,
    "immigration": immigration,
    "fx": fx,
    "sources": sources,
}

out = "const APP_CONFIG=" + json.dumps(config, ensure_ascii=False, separators=(",", ":")) + ";\n"
(ROOT / "data.js").write_text(out, encoding="utf-8")
print("Built data.js from canonical JSON data files.")
