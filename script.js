let selectedCity="whistler",selectedLife="budget",selectedAccommodation="staff",accommodationValue=500;
const $=id=>document.getElementById(id), val=id=>Math.max(0,Number($(id)?.value)||0);
const money=n=>"C$"+Math.round(Math.max(0,n)).toLocaleString("en-CA"), signed=n=>(n>=0?"+":"−")+money(Math.abs(n));
const city=()=>APP_CONFIG.cities[selectedCity];

function pair(rangeId,inputId){
 const r=$(rangeId),i=$(inputId); if(!r||!i)return;
 const sync=(source)=>{let n=Number(source.value)||0;let min=Number(i.min)||0,max=Number(i.max)||Infinity;n=Math.max(min,Math.min(max,n));i.value=n;r.value=Math.max(Number(r.min)||0,Math.min(Number(r.max)||Infinity,n));recalc()};
 r.addEventListener("input",()=>{i.value=r.value;recalc()});i.addEventListener("input",()=>sync(i));
}
function accommodationOptions(){
 const c=city(),opts=selectedCity==="banff"?[
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
 document.querySelectorAll(".option").forEach(b=>b.addEventListener("click",()=>{selectedAccommodation=b.dataset.accommodation;accommodationValue=Number(b.dataset.value);$("rent").value=accommodationValue;$("rentRange").value=Math.min(accommodationValue,3500);recalc();accommodationOptions()}));
}
function setCityDefaults(){
 const c=city();$("wage").value=c.defaultWage;$("wageRange").value=c.defaultWage;$("transport").value=c.monthly.transport;$("transportRange").value=c.monthly.transport;$("phone").value=c.monthly.phone;$("phoneRange").value=c.monthly.phone;
 $("wageHint").textContent=`City minimum wage: C$${c.minimumWage.toFixed(2)}/hour${c.minimumWageNext?` (rising to C$${c.minimumWageNext.toFixed(2)} on ${c.minimumWageNextDate})`:""}.`;
 selectedAccommodation=selectedCity==="banff"?"staffShared":"staff";accommodationValue=selectedCity==="banff"?c.accommodation.staffShared:c.accommodation.staff;accommodationOptions();applyLifestyle();
}
function applyLifestyle(){
 const c=city(),l=APP_CONFIG.lifestyle[selectedLife];
 let food=l.food,ent=l.entertainment,misc=l.misc;
 if(selectedLife==="normal"){food=c.monthly.food;ent=c.monthly.entertainment;misc=c.monthly.misc}
 if(selectedLife==="budget"&&(selectedCity==="whistler"||selectedCity==="banff"))food=400;
 $("food").value=food;$("foodRange").value=food;$("entertainment").value=ent;$("entertainmentRange").value=ent;$("misc").value=misc;$("miscRange").value=misc;
 document.querySelectorAll(".lifestyle").forEach(x=>x.classList.toggle("selected",x.dataset.life===selectedLife));recalc();
}
function recalc(){
 const c=city(),savings=val("savingsAud")*APP_CONFIG.audToCad,temporary=val("temporaryWeeks")*val("temporaryRate");
 const setup=val("flight")+val("visa")+val("workPermit")+val("biometrics")+val("insurance")+val("gear")+val("otherSetup")+temporary+val("deposit");
 const rent=val("rent"),other=val("food")+val("transport")+val("phone")+val("entertainment")+val("misc"),burn=rent+other;
 const gross=val("wage")*val("hours")*52/12,income=$("working").checked?gross*(1-Math.min(60,val("tax"))/100):0,surplus=income-burn,cash=savings-setup;
 const noWork=burn?cash/burn:99,deficit=Math.max(0,burn-income),workRunway=deficit?cash/deficit:99;
 $("savingsCad").textContent=money(savings);$("resultCity").textContent=c.name;$("recommended").textContent=`${money(setup+burn*3)}–${money(setup+burn*6)}`;
 $("rSavings").textContent=money(savings);$("rSetup").textContent=money(setup);$("rCash").textContent=money(cash);$("rRent").textContent=money(rent);$("rOther").textContent=money(other);$("rBurn").textContent=money(burn);$("rIncome").textContent=money(income);$("rSurplus").textContent=signed(surplus);
 $("rNoWork").textContent=cash<=0?"No buffer":`${Math.max(0,noWork).toFixed(1)} months`;$("rWithWork").textContent=deficit===0?"Self-sustaining":`${Math.max(0,workRunway).toFixed(1)} months`;
 let score=Math.round(Math.max(0,Math.min(100,50+(cash>0?Math.min(30,cash/(burn||1)*5):-30)+(surplus>=0?20:Math.max(-20,surplus/(burn||1)*20)))));
 $("score").textContent=score;$("scoreBar").style.width=score+"%";
 let st="Strong",cl="good";if(cash<=0||noWork<2){st="High risk";cl="bad"}else if(noWork<4||surplus<0){st="Tight";cl="warn"}$("status").textContent=st;$("status").className=`status ${cl}`;
 $("callout").textContent=cash<=0?"Your current savings don't cover the estimated arrival and setup costs.":!$("working").checked?`Without employment, your current plan gives you roughly ${Math.max(0,noWork).toFixed(1)} months of runway.`:surplus>=0?"Your planned income is higher than your estimated monthly expenses. Your savings could remain largely intact while you work.":`Your estimated monthly deficit is ${money(Math.abs(surplus))}. Finding work quickly or reducing accommodation costs would materially improve your runway.`;
}
function selectCity(key){selectedCity=key;document.querySelectorAll(".city-card").forEach(x=>x.classList.toggle("selected",x.dataset.city===key));setCityDefaults();document.getElementById("calculator").scrollIntoView({behavior:"smooth",block:"start"})}
document.querySelectorAll(".city-card").forEach(b=>b.addEventListener("click",()=>selectCity(b.dataset.city)));
document.querySelectorAll(".lifestyle").forEach(b=>b.addEventListener("click",()=>{selectedLife=b.dataset.life;applyLifestyle()}));
document.querySelectorAll("input,select").forEach(e=>e.addEventListener("input",recalc));
$("working").addEventListener("change",()=>{$("workFields").classList.toggle("disabled",!$("working").checked);recalc()});
$("printBtn").addEventListener("click",()=>window.print());
[
 ["savingsRange","savingsAud"],["flightRange","flight"],["rentRange","rent"],["temporaryRateRange","temporaryRate"],["depositRange","deposit"],
 ["wageRange","wage"],["hoursRange","hours"],["taxRange","tax"],["foodRange","food"],["transportRange","transport"],["phoneRange","phone"],["entertainmentRange","entertainment"],["miscRange","misc"]
].forEach(([r,i])=>pair(r,i));
setCityDefaults();recalc();