const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/card.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
for(const s of ['st1','st2','st3']){await p.evaluate(c=>document.body.className=c,s);await p.screenshot({path:s+'.png'});}await b.close();})();
