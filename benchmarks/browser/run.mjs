import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { gzipSync } from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const root = process.env.STEPPER_REPO ?? join(here, "../..");
const out = join(here, "results");
mkdirSync(out, { recursive: true });
const corePath = "components/ui/stepper.tsx";
const baselineRevision = "5cd44a9512fa92c979dddaa30beefdd74fcd218c";
const baselineSource = execFileSync("git", ["show", baselineRevision + ":" + corePath], { cwd: root, encoding: "utf8" });
const candidateSource = readFileSync(join(root, corePath), "utf8");
const html = name => '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Stepper comparison</title><style>*{box-sizing:border-box}body{font:16px system-ui;margin:16px}main{max-width:540px;margin:auto}button,input{font:inherit}button{padding:8px 12px}label{display:block;margin:16px 0}input:not([type=checkbox]){display:block;width:100%;padding:8px}ol,[data-part=list],[data-component=stepper-list]{display:flex;gap:6px;flex-wrap:wrap;padding:0;list-style:none}footer,[data-component=stepper-actions]{display:flex;gap:8px;margin-top:16px}button:focus-visible{outline:2px solid #555} [hidden]{display:none!important}</style><div id="root"></div><script src="./'+name+'.js"></script></html>';
const libraries = ["native", "stepper-before", "stepper", "ark", "stepperize"];
const results = [];
const median = xs => xs.toSorted((a,b)=>a-b)[Math.floor(xs.length/2)];
const browser = await chromium.launch({headless:true});
const versions = Object.fromEntries(Object.entries(JSON.parse(readFileSync(join(here,"package-lock.json"),"utf8")).packages).filter(([p])=>["node_modules/@ark-ui/react","node_modules/@stepperize/react","node_modules/@base-ui/react","node_modules/react","node_modules/react-dom","node_modules/cn","node_modules/esbuild","node_modules/playwright"].includes(p)).map(([p,v])=>[p,v.version]));
const report = { revision:execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"}).trim(),node:process.version,browser:browser.version(),baselineRevision,versions,results };
async function test(name, mobile) {
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile,reducedMotion:"reduce"});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  if(mobile){const cdp=await context.newCDPSession(page);await cdp.send("Emulation.setCPUThrottlingRate",{rate:4});}
  const url=pathToFileURL(join(out,name+".html")).href;
  const waitStep = n => page.locator('[data-current="'+n+'"]').waitFor({timeout:3000});
  const next = ()=>page.getByRole("button",{name:"Continue",exact:true}).click({timeout:3000});
  const back = ()=>page.getByRole("button",{name:"Back",exact:true}).click({timeout:3000});
  const release = ()=>page.evaluate(()=>window.__bench.release());
  async function fresh(){await page.goto(url);await waitStep(0);}
  const checks={};
  async function check(label,fn){try{await fn();checks[label]={pass:true};}catch(e){checks[label]={pass:false,error:String(e).slice(0,350)};}}
  try {
    await check("invalid_required_field",async()=>{await fresh();await next();await page.getByRole("status").filter({hasText:"Check the required field."}).waitFor({timeout:3000});await waitStep(0);});
    await check("onboarding_back_and_confirm",async()=>{
      await fresh();await page.getByRole("textbox",{name:"Business name"}).fill("Café Studio");
      await next();await page.getByRole("status").filter({hasText:"Checking"}).waitFor({timeout:3000});await release();await waitStep(1);
      await page.getByRole("textbox",{name:"Currency"}).fill("PEN");await page.getByRole("checkbox",{name:"QR payments"}).check();
      await back();await waitStep(0);
      if(await page.getByRole("textbox",{name:"Business name"}).inputValue()!=="Café Studio")throw Error("Name lost");
      await next();await page.getByRole("status").filter({hasText:"Checking"}).waitFor({timeout:3000});await release();await waitStep(1);
      if(await page.getByRole("textbox",{name:"Currency"}).inputValue()!=="PEN"||!await page.getByRole("checkbox",{name:"QR payments"}).isChecked())throw Error("Preferences lost");
      await next();await page.getByRole("status").filter({hasText:"Checking"}).waitFor({timeout:3000});await release();await waitStep(2);
      if(await page.getByText("Confirmed locally").count())throw Error("Unexpected confirmation");
      await page.getByRole("button",{name:"Confirm setup"}).click();await page.getByText("Confirmed locally").waitFor({timeout:3000});
    });
    await check("external_owner_change_during_guard",async()=>{
      await fresh();await page.getByRole("textbox",{name:"Business name"}).fill("Café Studio");await next();await page.getByRole("status").filter({hasText:"Checking"}).waitFor({timeout:3000});
      await page.evaluate(()=>window.__bench.set(2));await waitStep(2);await release();await page.waitForTimeout(100);await waitStep(2);
    });
    await check("keyboard_current_step",async()=>{
      await fresh();const current=page.locator('[aria-current="step"]');await current.waitFor({timeout:3000});await current.focus();if(!await current.evaluate(el=>el===document.activeElement))throw Error("No focus");await page.keyboard.press("ArrowRight");
      // Report selection/focus independently: native, manual and automatic modes need not match.
      checks.keyboardObservation={selection:await page.evaluate(()=>window.__bench.state()),focused:await page.evaluate(()=>document.activeElement?.textContent?.trim())};
    });
    let times=[];
    await check("controlled_update_sampling",async()=>{
      await fresh();
      times=await page.evaluate(async()=>{
        const values=[];
        for(let i=0;i<9;i++){
          const start=performance.now();
          for(let n=0;n<80;n++)window.__bench.set(n%2?0:1);
          const elapsed=performance.now()-start;
          await new Promise(requestAnimationFrame);
          if(i>=2)values.push(elapsed);
        }return values;
      });
    });
    return {profile:mobile?"390px, touch emulation, CPU 4x":"1280px, desktop",checks,median80ControlledUpdatesMs:times.length?median(times):null,samplesMs:times,pageErrors:errors};
  }finally{await context.close();}
}
try {
  for(const name of libraries){
    const record={name};results.push(record);
    try{
      const adapter=readFileSync(join(here,(name==="stepper-before"?"stepper":name)+".tsx.txt"),"utf8");
      writeFileSync(join(here,"core.tsx"),name==="stepper-before"?baselineSource:candidateSource);
      writeFileSync(join(here,"adapter.tsx"),adapter);
      writeFileSync(join(here,"fixture.tsx"),readFileSync(join(here,"fixture.tsx.txt"),"utf8"));
      const started=performance.now();
      const built=await build({entryPoints:[join(here,"fixture.tsx")],outfile:join(out,name+".js"),bundle:true,minify:true,jsx:"automatic",platform:"browser",target:"es2022",define:{"process.env.NODE_ENV":'"production"'},metafile:true,logLevel:"silent"});
      const contributions={};
      for(const output of Object.values(built.metafile.outputs)){
        for(const [input,meta] of Object.entries(output.inputs)){
          const pkg=input.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1] ?? "app/adapter";
          contributions[pkg]=(contributions[pkg]??0)+meta.bytesInOutput;
        }
      }
      record.bytesByPackage=contributions;
      writeFileSync(join(out,name+".metafile.json"),JSON.stringify(built.metafile,null,2)+"\n");
      const bytes=readFileSync(join(out,name+".js"));
      record.bundle={minifiedBytes:bytes.length,gzipBytes:gzipSync(bytes,{level:9}).length,adapterLines:adapter.trimEnd().split("\n").length,buildMs:performance.now()-started};
      writeFileSync(join(out,name+".html"),html(name));
      record.profiles=[];
    }catch(e){record.error=String(e).slice(0,1000);}
  }
  // Opposite library order on the second profile reduces systematic order bias.
  for(const mobile of [false,true]){
    for(const record of (mobile?[...results].reverse():results)){
      if(record.error)continue;
      try{record.profiles.push(await test(record.name,mobile));}
      catch(e){record.error=String(e).slice(0,1000);}
    }
  }
  for(const record of results)console.log("BROWSER_COMPARISON",JSON.stringify(record));
}finally{
  await browser.close();
  writeFileSync(join(out,"report.json"),JSON.stringify(report,null,2)+"\n");
  console.log("BROWSER_REPORT",JSON.stringify(report));
}
if(results.some(r=>r.error||r.profiles?.some(p=>p.pageErrors.length||Object.values(p.checks).some(c=>c.pass===false))))process.exitCode=1;
