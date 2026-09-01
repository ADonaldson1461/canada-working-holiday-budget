let selectedCity="whistler",selectedLife="budget",selectedAccommodation="staff",accommodationValue=500;
const $=id=>document.getElementById(id),val=id=>Math.max(0,Number($(id)?.value)||0),money=n=>"C$"+Math.round(Math.max(0,n)).toLocaleString("en-CA"),signedMoney=n=>(n>=0?"+":"−")+money(Math.abs(n));
const city=()=>APP_CONFIG.cities[selectedCity];

function accommodationOptions(){
 const c=city(), opts=selectedCity==="banff"?[
 ["staffBunk","Staff bunk",c.accommodation.staffBunk,"Best-case staff housing"],
 ["staffShared","Staff shared room",c.accommodation.staffShared,"Typical subsidised staff option"],
 ["shared","Shared bedroom",c.accommodation.shared,"Shared rental"],
 ["privateRoom","Private room",c.accommodation.privateRoom,"Your own bedroom"],
 ["apartment","Private apartment",c.accommodation.apartment,"Full apartment"]]:[
 ["staff","Staff accommodation",c.accommodation.staff,"Employer-provided / employee housing"],
 ["shared","Shared bedroom",c.accommodation.shared,"Shared rental"],
 ["privateRoom","Private room",c.accommodation.privateRoom,"Your own bedroom"],
 ["apartment","Private apartment",c.accommodation.apartment,"Full apartment"]];
 $("accommodationOptions").innerHTML=opts.map(o=>`<button class="option ${o[0]===selectedAccommodation?"selected":""}" data-accommodation="${o[0]}" data-value="${o[2]}"><span class="radio"></span><span><b>${o[1]}</b><small>${o[3]}</small></span><strong>${money(o[2])}<small>/ month</small></strong></button>`).join("");
 document.querySelectorAll(".option").forEach(b=>b.addEventListener("click",()=>{selectedAccommodation=b.dataset.accommodation;accommodationValue=Number(b.dataset.value);accommodationOptions();recalc()}));
}
function applyLifestyle(){
 const c=city(),l=APP_CONFIG.lifestyle[selectedLife];let food=l.food,ent=l.entertainment,misc=l.misc;
 if(selectedLife==="normal"){food=c.monthly.food;ent=c.monthly.entertainment;misc=c.monthly.misc}
 if(selectedLife==="budget"&&(selectedCity==="whistler"||selectedCity==="banff"))food=400;
 $("food").value=food;$("entertainment").value=ent;$("misc").value=misc;
 document.querySelectorAll(".lifestyle").forEach(x=>x.classList.toggle("selected",x.dataset.life===selectedLife));recalc();
}
function applyCityDefaults(){
 const c=city();$("wage").value=c.defaultWage;$("transport").value=c.monthly.transport;$("phone").value=c.monthly.phone;
 $("wageHint").textContent=`City minimum wage: C$${c.minimumWage.toFixed(2)}/hour${c.minimumWageNext?` (rising to C$${c.minimumWageNext.toFixed(2)} on ${c.minimumWageNextDate})`:""}.`;
 selectedAccommodation=selectedCity==="banff"?"staffShared":"staff";accommodationValue=selectedCity==="banff"?c.accommodation.staffShared:c.accommodation.staff;accommodationOptions();applyLifestyle();
}
function recalc(){
 const c=city(),savings=val("savingsAud")*APP_CONFIG.audToCad,temporary=val("temporaryWeeks")*val("temporaryRate");
 const setup=val("flight")+val("visa")+val("workPermit")+val("biometrics")+val("insurance")+val("gear")+val("otherSetup")+temporary+val("deposit");
 const rent=accommodationValue,other=val("food")+val("transport")+val("phone")+val("entertainment")+val("misc"),burn=rent+other;
 const gross=val("wage")*val("hours")*52/12,income=$("working").checked?gross*(1-Math.min(60,val("tax"))/100):0,surplus=income-burn,cash=savings-setup;
 const noWork=burn?cash/burn:999,deficit=Math.max(0,burn-income),workRunway=deficit?cash/deficit:999;
 $("savingsCad").textContent=money(savings);$("resultCity").textContent=c.name;$("recommended").textContent=`${money(setup+burn*3)}–${money(setup+burn*6)}`;
 $("rSavings").textContent=money(savings);$("rSetup").textContent=money(setup);$("rCash").textContent=money(cash);$("rRent").textContent=money(rent);$("rOther").textContent=money(other);$("rBurn").textContent=money(burn);$("rIncome").textContent=money(income);$("rSurplus").textContent=signedMoney(surplus);
 $("rNoWork").textContent=noWork<0?"Over budget":`${Math.min(99,noWork).toFixed(1)} months`;$("rWithWork").textContent=deficit===0?"Self-sustaining":`${Math.max(0,workRunway).toFixed(1)} months`;
 let st="Comfortable",cl="good";if(cash<=0||noWork<2){st="High risk";cl="bad"}else if(noWork<4||surplus<0){st="Tight";cl="warn"}$("status").textContent=st;$("status").className=`status ${cl}`;
 $("callout").textContent=cash<=0?"Your starting savings don't currently cover the estimated arrival and setup costs.":!$("working").checked?`Without employment, your current plan gives you roughly ${Math.max(0,noWork).toFixed(1)} months of runway.`:surplus>=0?"Your planned income is higher than your estimated monthly expenses. Your savings could remain largely intact while you work.":`Your estimated monthly deficit is ${money(Math.abs(surplus))}. Finding work quickly or reducing accommodation costs would materially improve your runway.`;
 renderComparison();
}
function renderComparison(){
 const hours=val("hours"),tax=Math.min(60,val("tax"))/100,life=APP_CONFIG.lifestyle[selectedLife];
 $("comparison").innerHTML=Object.entries(APP_CONFIG.cities).map(([key,c])=>{
  const rent=key==="banff"?c.accommodation.staffShared:c.accommodation.staff;
  const food=selectedLife==="normal"?c.monthly.food:(selectedLife==="social"?life.food:((key==="whistler"||key==="banff")?400:350));
  const ent=selectedLife==="normal"?c.monthly.entertainment:life.entertainment,misc=selectedLife==="normal"?c.monthly.misc:life.misc;
  const burn=rent+food+c.monthly.transport+c.monthly.phone+ent+misc,income=c.defaultWage*hours*52/12*(1-tax),surplus=income-burn;
  return `<div class="compare-card ${key===selectedCity?"active":""}"><div class="compare-top"><span>${key==="whistler"||key==="banff"?"🏔️":"🏙️"}</span><div><h3>${c.name}</h3><small>${c.province}</small></div></div><div class="compare-row"><span>Staff housing</span><b>${money(rent)}</b></div><div class="compare-row"><span>Monthly living costs</span><b>${money(burn)}</b></div><div class="compare-row"><span>Est. take-home</span><b>${money(income)}</b></div><div class="compare-result"><span>Monthly surplus</span><strong class="${surplus>=0?"positive":"negative"}">${signedMoney(surplus)}</strong></div><button class="button small" onclick="selectCity('${key}')">Use ${c.name}</button></div>`}).join("");
}
function selectCity(key){selectedCity=key;document.querySelectorAll(".city-card").forEach(x=>x.classList.toggle("selected",x.dataset.city===key));applyCityDefaults();document.getElementById("calculator").scrollIntoView({behavior:"smooth",block:"start"})}
document.querySelectorAll(".city-card").forEach(b=>b.addEventListener("click",()=>selectCity(b.dataset.city)));
document.querySelectorAll(".lifestyle").forEach(b=>b.addEventListener("click",()=>{selectedLife=b.dataset.life;applyLifestyle()}));
document.querySelectorAll("input,select").forEach(e=>e.addEventListener("input",recalc));
$("working").addEventListener("change",()=>{$("workFields").classList.toggle("disabled",!$("working").checked);recalc()});
applyCityDefaults();recalc();
