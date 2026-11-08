// Contrôle documentaire local, sans tests métier ni appel réseau.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=fileURLToPath(new URL('../',import.meta.url));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=walk(dir),markdown=files.filter(p=>p.endsWith('.md'));
const errors=[];let links=0,mermaid=0;
for(const file of markdown){
 const s=fs.readFileSync(file,'utf8');
 for(const m of s.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  if(/^(https?:|#)/.test(m[1]))continue;
  const target=decodeURI(m[1].split('#')[0]);links++;
  if(!fs.existsSync(path.resolve(path.dirname(file),target)))errors.push({file:path.relative(dir,file),target});
 }
 const fences=s.match(/^```/gm)||[];
 if(fences.length%2)errors.push({file:path.relative(dir,file),error:'Fenced code non fermé'});
 mermaid+=(s.match(/^```mermaid/gm)||[]).length;
 if(/\b(?:sb_secret_[A-Za-z0-9_]+|eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+|whsec_[A-Za-z0-9+/=]{16,})/.test(s))errors.push({file:path.relative(dir,file),error:'Valeur ressemblant à un secret : revue nécessaire'});
}
const report={date:new Date().toISOString(),markdownFiles:markdown.length,applicationSheets:markdown.filter(p=>p.includes(path.sep+'applications'+path.sep)).length,relativeLinksChecked:links,mermaidBlocks:mermaid,errors,scope:'Existence des cibles de liens, clôture des blocs de code et recherche de motifs de secrets dans Markdown. Pas de validation visuelle Mermaid, de tests applicatifs ou de SQL distant.'};
fs.writeFileSync(path.join(dir,'preuves/verification-documentation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;
