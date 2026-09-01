#!/usr/bin/env python3
"""Turn source/dataset changes into explainable review proposals.

This is deliberately deterministic: no customer-facing data is changed and no
LLM is required. It identifies likely topic, severity, affected datasets and a
bounded text diff so a human can review the evidence.
"""
import difflib, hashlib, json, re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
R = ROOT / "research"
REPORTS = R / "reports"
QUEUE = R / "review-queue.json"


def read_json(name):
    return json.loads((R / name).read_text(encoding="utf-8"))


def load_snapshot(source_id):
    p = R / "snapshots" / f"{source_id}.txt"
    return p.read_text(encoding="utf-8") if p.exists() else ""


def load_baseline(source_id):
    p = R / "baselines" / f"source-{source_id}.txt"
    return p.read_text(encoding="utf-8") if p.exists() else ""


def classify(text, keywords):
    lower = text.lower()
    scores = {topic: sum(lower.count(k.lower()) for k in words) for topic, words in keywords.items()}
    best = max(scores, key=scores.get) if scores else "general"
    return best if scores.get(best, 0) else "general"


def diff_summary(old, new, max_lines):
    old_lines = old.splitlines()
    new_lines = new.splitlines()
    diff = list(difflib.unified_diff(old_lines, new_lines, lineterm=""))
    added = sum(1 for x in diff if x.startswith("+") and not x.startswith("+++") )
    removed = sum(1 for x in diff if x.startswith("-") and not x.startswith("---") )
    return {"addedLines": added, "removedLines": removed, "excerpt": diff[:max_lines]}


def severity(source, summary):
    if source.get("criticality") == "critical":
        return "critical"
    changed = summary["addedLines"] + summary["removedLines"]
    return "high" if changed > 30 else "medium"


def main():
    cfg = read_json("intelligence-config.json")
    sources = {s["id"]: s for s in read_json("source-registry.json")["sources"]}
    queue = read_json("review-queue.json") if QUEUE.exists() else {"items": []}
    latest = read_json("reports/source-report-latest.json") if (REPORTS / "source-report-latest.json").exists() else {"changes": []}

    proposals = []
    for change in latest.get("changes", []):
        sid = change["source"]
        src = sources.get(sid, {"id": sid, "name": sid, "criticality": "medium"})
        old = load_baseline(sid)
        new = load_snapshot(sid)
        combined = (old[-20000:] + "\n" + new[-20000:])
        summary = diff_summary(old, new, cfg.get("maxDiffLines", 80))
        topic = classify(combined, cfg.get("keywords", {}))
        impacted = cfg.get("impactMap", {}).get(sid, [])
        proposals.append({
            "id": hashlib.sha256(f"{sid}:{change['newHash']}".encode()).hexdigest()[:16],
            "type": "research_proposal",
            "source": sid,
            "sourceName": src.get("name"),
            "topic": topic,
            "severity": severity(src, summary),
            "criticality": src.get("criticality", "medium"),
            "summary": summary,
            "affectedDatasets": impacted,
            "recommendation": "Review evidence before changing canonical WH HQ data.",
            "status": "pending",
            "createdAt": datetime.now(timezone.utc).isoformat()
        })

    existing_ids = {i.get("id") for i in queue.get("items", [])}
    for proposal in proposals:
        if proposal["id"] not in existing_ids:
            queue["items"].append(proposal)
    QUEUE.write_text(json.dumps(queue, indent=2) + "\n", encoding="utf-8")

    report = {
        "version": "6.8",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "proposalCount": len(proposals),
        "proposals": proposals,
        "safety": "No canonical customer-facing data is modified by this command."
    }
    REPORTS.mkdir(parents=True, exist_ok=True)
    (REPORTS / "intelligence-report-latest.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Research intelligence complete: {len(proposals)} proposal(s).")


if __name__ == "__main__":
    main()
