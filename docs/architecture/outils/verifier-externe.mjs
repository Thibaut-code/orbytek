// Vérifications publiques en lecture seule : aucun formulaire soumis, aucune donnée métier lue.
import dns from 'node:dns/promises';
import {writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import tls from 'node:tls';
const results = {date:new Date().toISOString(), dns:[], http:[], github:[], tls:[], comparisons:[]};
await Promise.all(['orbytek.be','www.orbytek.be','test.orbytek.be','_dmarc.orbytek.be'].map(async name=>{
  for (const type of ['A','AAAA','CNAME','NS','MX','TXT']) {
    try {let timer; const answer=await Promise.race([dns.resolve(name,type),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Object.assign(new Error('timeout'),{code:'AUDIT_TIMEOUT'})),4000);})]).finally(()=>clearTimeout(timer));results.dns.push({name,type,answer});}
    catch(e) {results.dns.push({name,type,error:e.code});}
  }
}));
const paths=['Facture/','Voitures/','voiture/','BD/albert/','Archive/','albert_65ans/','albert_65ans/admin.html','filmthibaut/','Chauffagiste/','Chauffagiste2/','Chauffagiste3/','Coiffeur/','rendezvous/','puériculture1/','puériculture2/','demos/immobilier/','demos/restaurant/','demos/paysagiste/','premium-sites/la-laguna/'];
await Promise.all(['https://orbytek.be/','http://orbytek.be/','https://www.orbytek.be/','https://test.orbytek.be/',...paths.map(p=>'https://orbytek.be/'+p)].map(async url=>{
  try {const r=await fetch(url,{method:'HEAD',redirect:'manual',signal:AbortSignal.timeout(15000)});results.http.push({url,status:r.status,headers:Object.fromEntries(['server','location','content-type','strict-transport-security','cache-control'].map(k=>[k,r.headers.get(k)]))});}
  catch(e){results.http.push({url,error:e.cause?.code||e.code||e.name});}
}));
for(const repo of ['orbytek','orbytek-staging']){
  try{const r=await fetch(`https://api.github.com/repos/Thibaut-code/${repo}/pages`,{headers:{'User-Agent':'orbytek-architecture-audit'},signal:AbortSignal.timeout(15000)});const j=await r.json();results.github.push({repo,status:r.status,...(r.ok?{html_url:j.html_url,cname:j.cname,source:j.source,https_enforced:j.https_enforced,build_type:j.build_type}:{message:j.message})});}catch(e){results.github.push({repo,error:e.cause?.code||e.name});}
}
await Promise.all(['orbytek.be','www.orbytek.be','test.orbytek.be'].map(host=>new Promise(resolve=>{
 const socket=tls.connect({host,port:443,servername:host,rejectUnauthorized:true});
 socket.setTimeout(10000,()=>socket.destroy(Object.assign(new Error('timeout'),{code:'TLS_TIMEOUT'})));
 socket.once('secureConnect',()=>{const c=socket.getPeerCertificate();results.tls.push({host,authorized:socket.authorized,issuer:c.issuer,subject:c.subject,subjectaltname:c.subjectaltname,valid_from:c.valid_from,valid_to:c.valid_to});socket.end();resolve();});
 socket.once('error',e=>{results.tls.push({host,error:e.code});resolve();});
})));
for(const p of ['contact.js','Facture/app.js','Voitures/data.js','albert_65ans/app.js','Archive/stream.js','BD/albert/app.js']){
 try{const r=await fetch('https://orbytek.be/'+p,{signal:AbortSignal.timeout(15000)});if(!r.ok){results.comparisons.push({path:p,status:r.status});continue;}const remote=Buffer.from(await r.arrayBuffer()),local=await readFile(new URL('../../../'+p,import.meta.url));const hash=b=>createHash('sha256').update(b).digest('hex');results.comparisons.push({path:p,status:r.status,local_sha256:hash(local),remote_sha256:hash(remote),identical:hash(local)===hash(remote)});}catch(e){results.comparisons.push({path:p,error:e.cause?.code||e.name});}
}
await writeFile(new URL('../preuves/verification-externe.json',import.meta.url),JSON.stringify(results,null,2)+'\n');
let summary='# Vérifications publiques\n\n[Sommaire](../README.md) · [JSON complet](verification-externe.json)\n\nContrôle horodaté : '+results.date+' (UTC). Requêtes DNS, HEAD, lectures de scripts publics et négociations TLS uniquement. Aucun formulaire envoyé, aucune connexion utilisateur ni donnée métier consultée. Les premières tentatives sans accès réseau avaient échoué ; ce relevé contient la reprise réussie avec accès autorisé.\n\n## Présence des pages\n\nUn HTTP 200 ne valide ni la nature du contenu, ni le JavaScript, ni le parcours fonctionnel. Un 404 sur un chemin ne démontre pas que le projet n’existe sous aucune autre URL.\n\n| URL sondée | HTTP | Redirection / erreur |\n|---|---|---|\n';
for(const r of [...results.http].sort((a,b)=>a.url.localeCompare(b.url)))summary+=`| [${r.url}](${encodeURI(r.url)}) | ${r.status||'—'} | ${r.headers?.location||r.error||'—'} |\n`;
summary+='\n## Certificats TLS\n\n| Hôte | Validation client | Émetteur | Début UTC | Fin UTC |\n|---|---|---|---|---|\n';
for(const c of results.tls)summary+=`| ${c.host} | ${c.authorized?'Valide':c.error||'Non confirmé'} | ${c.issuer?.O||'—'} / ${c.issuer?.CN||'—'} | ${c.valid_from||'—'} | ${c.valid_to||'—'} |\n`;
summary+='\nLa validité observée ne prouve pas le renouvellement futur. Registrar, titulaire et configuration interne de publication ne sont pas déductibles de ces certificats.\n\n## Comparaison partielle local / production\n\n| Script public | HTTP | Empreinte identique au fichier local |\n|---|---|---|\n';
for(const c of results.comparisons)summary+=`| ${c.path} | ${c.status||c.error} | ${c.identical===true?'Oui':c.identical===false?'**Non**':'Non déterminé'} |\n`;
summary+='\nLes empreintes sont SHA-256 sur les octets reçus. Une différence peut correspondre à du code, des paramètres ou un simple formatage : aucun diff complet distant n’est affirmé ici. Une égalité d’un script ne prouve pas celle du reste de son application. Les fiches documentent le commit local indiqué au sommaire.\n\n## DNS et GitHub\n\nLes NS OVH, A/CNAME GitHub, MX et SPF sont détaillés dans [Infrastructure](../infrastructure.md), avec les réponses exactes dans le JSON. Aucun TXT DMARC retrouvé à cette date, sélecteur DKIM inconnu. Les lectures anonymes de configuration Pages retournent 404 : l’accès console reste nécessaire.\n';
await writeFile(new URL('../preuves/README.md',import.meta.url),summary);
console.log(JSON.stringify({date:results.date,dns:results.dns.length,http:results.http.length,tls:results.tls.length,comparisons:results.comparisons.length,files:['preuves/verification-externe.json','preuves/README.md']}));
