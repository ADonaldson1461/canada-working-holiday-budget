#!/usr/bin/env python3
"""Turn detected source changes into explainable review proposals."""
import difflib, hashlib, json
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; R=ROOT/'research'; REPORTS=R/'reports'; QUEUE=R/'review-queue.json'
def read_json(name): return json.loads((R/name).read_text(encoding='utf-8'))
def read(path): return path.read_text(encoding='utf-8') if path.exists() else ''
def classify(text,keywords):
 low=text.lower(); scores={k:sum(low.count(w.lower()) for w in words) for k,words in keywords.items()}; best=max(scores,key=scores.get,default='general'); return best if scores.get(best,0) else 'general'
def main():
 cfg=read_json('intelligence-config.json'); sources={s['id']:s for s in read_json('source-registry.json')['sources']}; latest=read_json('reports/source-report-latest.json') if (REPORTS/'source-report-latest.json').exists() else {'changes':[]}; queue=read_json('review-queue.json') if QUEUE.exists() else {'items':[]}; existing={x.get('id') for x in queue.get('items',[])}; proposals=[]
 for c in latest.get('changes',[]):
  sid=c['source']; src=sources.get(sid,{}); current=read(R/'snapshots'/f'{sid}.txt'); previous=read(R/'snapshots'/f'{sid}.previous.txt'); diff=list(difflib.unified_diff(previous.splitlines(),current.splitlines(),fromfile='previous evidence',tofile='current evidence',lineterm='')); added=sum(x.startswith('+') and not x.startswith('+++') for x in diff); removed=sum(x.startswith('-') and not x.startswith('---') for x in diff); topic=classify(previous+'\n'+current,cfg.get('keywords',{})); pid=hashlib.sha256(f"{sid}:{c['newHash']}".encode()).hexdigest()[:16]; severity='critical' if src.get('criticality')=='critical' else ('high' if added+removed>30 else 'medium')
  p={'id':pid,'type':'research_proposal','source':sid,'sourceName':src.get('name',sid),'topic':topic,'severity':severity,'criticality':src.get('criticality','medium'),'change':{'addedLines':added,'removedLines':removed,'excerpt':diff[:cfg.get('maxDiffLines',80)]},'affectedDatasets':cfg.get('impactMap',{}).get(sid,[]),'recommendation':'Review the evidence and impact before changing canonical WH HQ data.','status':'pending','createdAt':datetime.now(timezone.utc).isoformat()}; proposals.append(p)
  if pid not in existing: queue['items'].append(p)
 REPORTS.mkdir(parents=True,exist_ok=True); QUEUE.write_text(json.dumps(queue,indent=2)+'\n',encoding='utf-8'); (REPORTS/'intelligence-report-latest.json').write_text(json.dumps({'version':'6.8','generatedAt':datetime.now(timezone.utc).isoformat(),'proposalCount':len(proposals),'proposals':proposals,'safety':'No canonical customer-facing data is modified.'},indent=2)+'\n',encoding='utf-8'); print(f'Research intelligence complete: {len(proposals)} proposal(s).')
if __name__=='__main__': main()
