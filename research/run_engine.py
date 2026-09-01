#!/usr/bin/env python3
import subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
steps = [
    ['research/validate_data.py'],
    ['research/check_changes.py'],
    ['research/build_command_centre.py'],
]

for step in steps:
    print('Running', step[0])
    result = subprocess.run([sys.executable, *step], cwd=ROOT)
    if result.returncode:
        raise SystemExit(result.returncode)

print('WH HQ Research Engine V6.9 completed successfully.')
