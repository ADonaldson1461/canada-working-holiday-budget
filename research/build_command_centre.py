#!/usr/bin/env python3
"""Build a small, read-only state file for the WH HQ Research Command Centre."""
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
R = ROOT / "research"
REPORTS = R / "reports"


def load(path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def main():
    registry = load(R / "source-registry.json", {"sources": []}).get("sources", [])
    source_report = load(REPORTS / "source-report-latest.json", {})
    intelligence = load(REPORTS / "intelligence-report-latest.json", {})
    queue = load(R / "review-queue.json", {"items": []}).get("items", [])

    checked = set(source_report.get("checked", []))
    failures = {x.get("source") for x in source_report.get("failures", [])}
    changes = {x.get("source") for x in source_report.get("changes", [])}
    pending = [x for x in queue if x.get("status", "pending") == "pending"]

    sources = []
    for source in registry:
        sid = source.get("id")
        if sid in failures:
            status = "attention"
        elif sid in changes:
            status = "change"
        elif sid in checked:
            status = "healthy"
        else:
            status = "not_checked"
        sources.append({
            "id": sid,
            "name": source.get("name", sid),
            "criticality": source.get("criticality", "medium"),
            "cadence": source.get("cadence", "unknown"),
            "url": source.get("url", ""),
            "status": status,
            "use": source.get("use", "")
        })

    state = {
        "version": "6.9",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "sources": len(sources),
            "healthy": sum(x["status"] == "healthy" for x in sources),
            "attention": sum(x["status"] == "attention" for x in sources),
            "changes": sum(x["status"] == "change" for x in sources),
            "pendingReviews": len(pending),
            "latestProposalCount": intelligence.get("proposalCount", 0)
        },
        "lastRun": source_report.get("generatedAt") or intelligence.get("generatedAt"),
        "sources": sources,
        "pendingReviews": pending[:25],
        "recentChanges": source_report.get("changes", [])[:25],
        "safety": "Read-only command centre. Canonical customer-facing data is not changed by research runs."
    }
    REPORTS.mkdir(parents=True, exist_ok=True)
    (REPORTS / "command-centre-latest.json").write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")
    print(f"Command Centre state built: {len(sources)} sources, {len(pending)} pending review(s).")


if __name__ == "__main__":
    main()
