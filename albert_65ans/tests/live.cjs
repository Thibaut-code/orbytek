// Vérifications réelles en lecture seule. Le code reste en mémoire.
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),{spawnSync}=require('node:child_process');
(async()=>{
  const query=spawnSync(process.env.ComSpec||'cmd.exe',['/d','/s','/c','npx --yes supabase db query --linked --project-ref dpwmxzptfgmkjecpuikb --file supabase/read-access.sql --output json'],{encoding:'utf8',windowsHide:true,timeout:30000});
  const text=query.stdout,code=text.match(/"access_code":\s*"([a-z0-9]+)"/)?.[1];if(!code)throw Error(`Code familial non récupéré (CLI ${query.status} : ${query.stderr?.replace(/[a-zA-Z0-9_-]{24,}/g,'[masqué]').slice(0,500)}).`);
  const context={window:{}};vm.runInNewContext(fs.readFileSync('config.js','utf8'),context);const cfg=context.window.ALBERT_CONFIG;
  async function request(name,body){return fetch(`${cfg.supabaseUrl}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:cfg.supabaseKey,'Content-Type':'application/json',Origin:'https://orbytek.be'},body:JSON.stringify(body)});}
  const denied=await request('albert_snapshot',{p_code:'invalide'});assert([401,403].includes(denied.status));assert.equal((await denied.json()).code,'42501');
  const response=await request('albert_snapshot',{p_code:code});assert.equal(response.status,200);const data=await response.json();assert.equal(data.records.length,60);assert(data.records.every(r=>r.person==='thibaut'));assert(data.records.find(r=>r.id==='s0q0').data.answer.includes('20 octobre 1961'));
  const emptySave=await request('albert_save',{p_code:code,p_person:'thibaut',p_changes:[]});assert.equal(emptySave.status,200);assert.deepEqual(await emptySave.json(),{saved:[],conflicts:[]});
  console.log('OK : API publique opérationnelle, code incorrect refusé, 60 réponses au nom de Thibaut, sauvegarde vide acceptée. Aucune donnée modifiée.');
  const path=require('node:path');let pw;try{pw=require('playwright');}catch{pw=require(path.join(process.env.ALBERT_NODE_MODULES||'C:/Users/FlowUP/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules','playwright'));}
  const browser=await pw.chromium.launch({channel:'msedge',headless:true});
  try{const context=await browser.newContext({viewport:{width:1440,height:1080}}),page=await context.newPage();page.setDefaultTimeout(20000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const base=process.env.ALBERT_LIVE_URL||'http://127.0.0.1:4189/';await page.goto(base+'#famille='+code);await page.locator('[data-person="maman"]').click();await page.locator('#workspace').waitFor({state:'visible'});assert.equal(await page.locator('.other-response').count(),60);assert.equal(await page.locator('#a-s0q0').inputValue(),'');assert.match(await page.locator('#q-s0q0 .others').innerText(),/Thibaut/);
    await page.locator('#changePerson').click();await page.locator('#welcome').waitFor({state:'visible'});await page.locator('[data-person="thibaut"]').click();await page.locator('#workspace').waitFor({state:'visible'});assert((await page.locator('#a-s0q0').inputValue()).includes('20 octobre 1961'));assert.equal(await page.locator('#progressCount').innerText(),'60 / 165');assert.deepEqual(errors,[]);
    fs.mkdirSync('output',{recursive:true});await page.screenshot({path:'output/verification-reelle.png'});console.log('OK : ouverture réelle du lien familial, Maman voit les 60 réponses de Thibaut, Thibaut retrouve ses 60 réponses, aucune erreur JavaScript.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
