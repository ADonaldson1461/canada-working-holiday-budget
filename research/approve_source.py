#!/usr/bin/env python3
import json,hashlib,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; R=ROOT/'research'
if len(sys.argv)!=2: raise SystemExit('Usage: python research/approve_source.py <source-id>')
sid=sys.argv[1]; snap=R/'snapshots'/f'{sid}.txt'
if not snap.exists(): raise SystemExit(f'No snapshot found for {sid}')
h=hashlib.sha256(snap.read_bytes()).hexdigest(); (R/'baselines'/f'source-{sid}.sha256').write_text(h+'\n')
q=json.loads((R/'review-queue.json').read_text())
for item in q['items']:
    if item.get('source')==sid and item.get('status')=='pending': item['status']='approved'
(R/'review-queue.json').write_text(json.dumps(q,indent=2)+'\n')
print(f'Approved source baseline: {sid}')
