(() => {
  const cfg = window.APP_CONFIG || {};
  const cities = cfg.cities || {};
  const jobs = cfg.jobTypes || {};

  const destination = document.getElementById('work-destination');
  const jobType = document.getElementById('work-job-type');
  const experience = document.getElementById('work-experience');
  const results = document.getElementById('work-results');
  const summary = document.getElementById('work-summary');

  const destinationNames = Object.entries(cities).map(([id, city]) => ({ id, name: city.name })).sort((a,b) => a.name.localeCompare(b.name));
  destinationNames.forEach(({id,name}) => {
    const option = document.createElement('option'); option.value = id; option.textContent = name; destination.appendChild(option);
  });
  Object.entries(jobs).filter(([id]) => id !== 'unknown').forEach(([id, job]) => {
    const option = document.createElement('option'); option.value = id; option.textContent = job.label; jobType.appendChild(option);
  });

  const jobCards = [
    { id:'hospitality', icon:'🍽️', title:'Hospitality', tags:['restaurants','bars','cafes','servers','bartenders'], tips:true, housing:true },
    { id:'ski', icon:'🎿', title:'Ski resort', tags:['lift operations','guest services','rental','snow school','resort'], tips:false, housing:true },
    { id:'hotel', icon:'🏨', title:'Hotel', tags:['front desk','housekeeping','guest services','food & beverage'], tips:false, housing:true },
    { id:'retail', icon:'🛍️', title:'Retail', tags:['sales','customer service','ski shops','stores'], tips:false, housing:false },
    { id:'construction', icon:'🔨', title:'Construction / trades', tags:['labour','trades','construction'], tips:false, housing:false },
    { id:'farm', icon:'🌾', title:'Farm / seasonal', tags:['harvest','farm','seasonal','outdoor'], tips:false, housing:true },
    { id:'office', icon:'💻', title:'Office / professional', tags:['administration','office','professional'], tips:false, housing:false }
  ];

  function money(n){ return `C$${Math.round(n).toLocaleString('en-CA')}`; }
  function wageText(job){
    const r = job.wageRange || [job.wage, job.wage];
    return `${money(r[0])}–${money(r[1])}/hr`;
  }
  function experienceFit(job, exp){
    if(exp === 'experienced') return 'Best suited to candidates with relevant experience';
    if(exp === 'new') return ['hospitality','hotel','retail','ski','farm'].includes(job.id) ? 'Common entry point for working holidaymakers' : 'Experience or trade skills may be expected';
    return 'Check the individual listing for experience requirements';
  }
  function render(){
    const city = cities[destination.value] || cities.whistler || {};
    const selectedJob = jobType.value;
    const exp = experience.value;
    const cityName = city.name || 'your destination';
    const cards = jobCards.filter(card => !selectedJob || card.id === selectedJob).map(card => {
      const job = jobs[card.id] || jobs.unknown || {};
      const min = Number(city.minimumWage || 0);
      const planning = Math.max(Number(job.wage || 0), min);
      const housingText = city.accommodation ? (card.housing ? 'Common with some employers' : 'Less common') : 'Check employer';
      return `<article class="work-card">
        <div class="work-card-top"><span class="work-icon">${card.icon}</span><span class="pill">${job.confidence || 'Planning estimate'}</span></div>
        <h3>${card.title}</h3>
        <p class="work-wage">${wageText(job)}</p>
        <p class="muted">WH HQ planning figure: <strong>${money(planning)}/hr</strong></p>
        <div class="work-facts"><span>🕒 ${job.hours || 32} hrs/week typical</span><span>🏠 ${housingText}</span><span>💡 ${card.tips ? 'Tips can materially increase earnings' : 'Usually no tips'}</span></div>
        <p class="work-fit">${experienceFit(card, exp)}</p>
      </article>`;
    }).join('');
    results.innerHTML = cards || '<div class="panel"><p>No matching roles found. Try “Any job”.</p></div>';
    summary.innerHTML = `<strong>${cityName}</strong> · Minimum wage ${money(city.minimumWage || 0)}/hr · Showing ${cards ? cards.match(/<article/g).length : 0} job categories`;
  }

  [destination, jobType, experience].forEach(el => el.addEventListener('change', render));
  render();
})();
