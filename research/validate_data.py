#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / 'research'


def load_json(path):
    return json.loads(path.read_text(encoding='utf-8'))


def load_app_config(path):
    text = path.read_text(encoding='utf-8').strip()
    prefix = 'const APP_CONFIG='
    if not text.startswith(prefix):
        raise ValueError('data.js does not start with const APP_CONFIG=')
    payload = text[len(prefix):]
    if payload.endswith(';'):
        payload = payload[:-1]
    return json.loads(payload)


def main():
    sources = load_json(RESEARCH / 'source-registry.json')['sources']
    source_ids = {s['id'] for s in sources}
    datasets = load_json(RESEARCH / 'dataset-registry.json')['datasets']
    errors = []

    for d in datasets:
        p = ROOT / d['file']
        if not p.exists():
            errors.append(f"Missing canonical dataset: {d['file']}")
        for sid in d.get('sources', []):
            if sid not in source_ids:
                errors.append(f"Unknown source {sid} in dataset {d['id']}")

    data_path = ROOT / 'data.js'
    if data_path.exists():
        try:
            app = load_app_config(data_path)
            required = ['currencies', 'countries', 'cities', 'jobTypes', 'taxModel', 'lifestyle', 'immigration']
            for key in required:
                if key not in app:
                    errors.append(f"data.js missing APP_CONFIG.{key}")
            if not isinstance(app.get('currencies'), dict) or 'CAD' not in app.get('currencies', {}):
                errors.append('data.js currencies must include CAD')
            if not isinstance(app.get('countries'), list) or not app.get('countries'):
                errors.append('data.js countries list is empty or invalid')
            if not isinstance(app.get('cities'), dict) or not app.get('cities'):
                errors.append('data.js cities object is empty or invalid')
        except Exception as exc:
            errors.append(f"Invalid data.js APP_CONFIG: {exc}")
    else:
        errors.append('Missing canonical dataset: data.js')

    if errors:
        print('Validation FAILED')
        for e in errors:
            print(' -', e)
        raise SystemExit(1)

    print(f'Validation successful: {len(datasets)} canonical dataset, {len(sources)} sources.')


if __name__ == '__main__':
    main()
