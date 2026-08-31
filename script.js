const ids = ["savings","flight","visa","insurance","initialAccommodation","gear","transportSetup","otherSetup","rent","food","transport","phone","entertainment","misc","wage","hours","tax","months"];
const el = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0}).format(Math.round(n));
function val(id){return Math.max(0, Number(el(id).value)||0)}
function recalc(){
  const savings=val("savings"), flight=val("flight"), months=val("months");
  const setup = flight+val("visa")+val("insurance")+val("initialAccommodation")+val("gear")+val("transportSetup")+val("otherSetup");
  const monthlyBurn = val("rent")+val("food")+val("transport")+val("phone")+val("entertainment")+val("misc");
  const grossMonthly = val("wage")*val("hours")*52/12;
  const tax = Math.min(60,val("tax"))/100;
  const monthlyIncome = grossMonthly*(1-tax);
  const surplus = monthlyIncome-monthlyBurn;
  const cashAfterSetup = savings-setup;
  const runwayNoWork = monthlyBurn>0 ? cashAfterSetup/monthlyBurn : 999;
  let runwayWithWork = "Self-sustaining";
  if(monthlyIncome < monthlyBurn){
    const deficit=monthlyBurn-monthlyIncome;
    runwayWithWork=deficit>0 ? (cashAfterSetup/deficit).toFixed(1)+" months" : "Self-sustaining";
  }
  const recommendedLow = setup + monthlyBurn*3;
  const recommendedHigh = setup + monthlyBurn*6;
  el("monthlyBurn").textContent=money(monthlyBurn);
  el("monthlyIncome").textContent=money(monthlyIncome);
  el("monthlySurplus").textContent=(surplus>=0?"+":"-")+money(Math.abs(surplus));
  el("setupCosts").textContent=money(setup);
  el("cashAfterSetup").textContent=money(cashAfterSetup);
  el("runwayNoWork").textContent=(runwayNoWork>=99?"10+":runwayNoWork.toFixed(1))+" months";
  el("runwayWithWork").textContent=runwayWithWork;
  el("recommended").textContent=money(recommendedLow)+"–"+money(recommendedHigh);
  el("recommendationNote").textContent="A planning range based on your setup costs plus 3–6 months of living expenses.";
  const status=el("status");
  status.className="status";
  if(cashAfterSetup<=0 || runwayNoWork<2){status.classList.add("bad");status.textContent="High risk";}
  else if(runwayNoWork<3 || surplus<0){status.classList.add("warn");status.textContent="Tight";}
  else {status.classList.add("good");status.textContent="Comfortable";}
}
ids.forEach(id=>el(id).addEventListener("input",recalc));
el("city").addEventListener("change",()=>{
  const presets={
    vancouver:[1500,500,120,60,300,200],
    whistler:[1900,550,100,60,350,200],
    banff:[1400,500,100,60,300,200],
    calgary:[1100,450,100,60,250,200],
    toronto:[1450,500,130,60,300,200],
    montreal:[1100,450,100,55,250,180]
  };
  const p=presets[el("city").value];
  if(p){["rent","food","transport","phone","entertainment","misc"].forEach((id,i)=>el(id).value=p[i]);recalc();}
});
recalc();
