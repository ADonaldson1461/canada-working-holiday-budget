#!/usr/bin/env python3
import hashlib,json,re,urllib.request
from pathlib import Path
from datetime import datetime,timezone
ROOT=Path(__file__).resolve().parents[1]; R=ROOT/'research'; S=R/'snapshots'; B=R/'baselines'; OUT=R/'reports'
def normalise(text):
    text=re.sub(r'<script[\s\S]*?</script>',' ',text,flags=re.I); text=re.sub(r'<style[\s\S]*?</style>',' ',text,flags=re.I); text=re.sub(r'<[^>]+>',' ',text); text=re.sub(r'\s+',' ',text); return text.strip()
def main():
    cfg=json.loads((R/'research-config.json').read_text()); sources=json.loads((R/'source-registry.json').read_text())['sources']; S.mkdir(parents=True,exist_ok=True); B.mkdir(parents=True,exist_ok=True); OUT.mkdir(parents=True,exist_ok=True); checked=[]; changes=[]; failures=[]
    for s in sources:
        if not s.get('watch'): continue
        try:
            req=urllib.request.Request(s['url'],headers={'User-Agent':cfg['userAgent']})
            with urllib.request.urlopen(req,timeout=cfg['requestTimeoutSeconds']) as r: raw=r.read(cfg['maxBytes']).decode('utf-8','replace')
            text=normalise(raw); h=hashlib.sha256(text.encode()).hexdigest(); snap=S/f"{s['id']}.txt"; previous=S/f"{s['id']}.previous.txt"; base=B/f"source-{s['id']}.sha256"; old=base.read_text().strip() if base.exists() else None
            if snap.exists(): previous.write_text(snap.read_text(encoding='utf-8'),encoding='utf-8')
            snap.write_text(text,encoding='utf-8'); checked.append(s['id'])
            if old and old!=h: changes.append({'source':s['id'],'name':s['name'],'criticality':s['criticality'],'oldHash':old,'newHash':h,'previousSnapshot':str(previous)})
            if not base.exists(): base.write_text(h+'\n')
        except Exception as e: failures.append({'source':s['id'],'error':str(e)})
    report={'generatedAt':datetime.now(timezone.utc).isoformat(),'checked':checked,'changes':changes,'failures':failures}; (OUT/'source-report-latest.json').write_text(json.dumps(report,indent=2)+'\n'); print(f"Source check complete: {len(checked)} checked, {len(changes)} changed, {len(failures)} failed.")
if __name__=='__main__': main()
