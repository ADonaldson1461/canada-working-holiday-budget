#!/usr/bin/env python3
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
RESEARCH=ROOT/'research'

def load(path):
    return json.loads(path.read_text(encoding='utf-8'))

def main():
    sources=load(RESEARCH/'source-registry.json')['sources']
    source_ids={s['id'] for s in sources}
    datasets=load(RESEARCH/'dataset-registry.json')['datasets']
    errors=[]
    for d in datasets:
        p=ROOT/d['file']
        if not p.exists():
            errors.append(f"Missing dataset: {d['file']}")
        for sid in d.get('sources',[]):
            if sid not in source_ids:
                errors.append(f"Unknown source {sid} in dataset {d['id']}")
    if errors:
        print('Validation FAILED')
        for e in errors: print(' -',e)
        raise SystemExit(1)
    print(f'Validation successful: {len(datasets)} datasets, {len(sources)} sources.')

if __name__=='__main__': main()
