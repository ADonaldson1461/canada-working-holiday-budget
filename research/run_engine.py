#!/usr/bin/env python3
import subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
steps=[['research/validate_data.py'],['research/check_changes.py']]
for step in steps:
    print('Running',step[0])
    r=subprocess.run([sys.executable,*step],cwd=ROOT)
    if r.returncode: raise SystemExit(r.returncode)
print('WH HQ Research Engine completed successfully.')
