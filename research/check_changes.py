#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
from datetime import datetime,timezone

ROOT=Path(__file__).resolve().parents[1]
R=ROOT/'research'
BASE=R/'baselines'; REPORT=R/'reports'; QUEUE=R/'review-queue.json'

def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    BASE.mkdir(parents=True,exist_ok=True); REPORT.mkdir(parents=True,exist_ok=True)
    registry=json.loads((R/'dataset-registry.json').read_text())['datasets']
    changes=[]
    for d in registry:
        p=ROOT/d['file']; h=digest(p)
        b=BASE/f"{d['id']}.sha256"
        old=b.read_text().strip() if b.exists() else None
        if old and old!=h: changes.append({'type':'dataset_change','dataset':d['id'],'file':d['file'],'criticality':d['criticality'],'oldHash':old,'newHash':h})
        if not b.exists(): b.write_text(h+'\n')
    report={'generatedAt':datetime.now(timezone.utc).isoformat(),'changes':changes}
    (REPORT/'dataset-report-latest.json').write_text(json.dumps(report,indent=2)+'\n')
    q=json.loads(QUEUE.read_text()) if QUEUE.exists() else {'items':[]}
    for c in changes:
        q['items'].append({**c,'status':'pending','createdAt':report['generatedAt']})
    QUEUE.write_text(json.dumps(q,indent=2)+'\n')
    print(f"Dataset change check complete: {len(changes)} change(s).")

if __name__=='__main__': main()
