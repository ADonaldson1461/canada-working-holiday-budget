// Central planning data — September 2026. Estimates only; update as prices change.
const APP_CONFIG = {
  version: "2.0", updated: "September 2026", audToCad: 0.9566,
  setupDefaults: { flight:1200, visa:184.75, workPermit:100, biometrics:85, insuranceAnnual:1000, gear:750, otherSetup:300 },
  cities: {
    vancouver:{name:"Vancouver",province:"British Columbia",provinceCode:"BC",minimumWage:18.25,accommodation:{staff:700,shared:900,privateRoom:1300,apartment:2377},monthly:{food:500,transport:117,phone:35,entertainment:250,misc:200},defaultWage:22},
    whistler:{name:"Whistler",province:"British Columbia",provinceCode:"BC",minimumWage:18.25,accommodation:{staff:500,shared:1300,privateRoom:1700,apartment:2657},monthly:{food:550,transport:55,phone:35,entertainment:350,misc:200},defaultWage:22},
    banff:{name:"Banff",province:"Alberta",provinceCode:"AB",minimumWage:15,accommodation:{staffBunk:400,staffShared:525,shared:1000,privateRoom:1300,apartment:1499},monthly:{food:550,transport:30,phone:35,entertainment:300,misc:200},defaultWage:20},
    calgary:{name:"Calgary",province:"Alberta",provinceCode:"AB",minimumWage:15,accommodation:{staff:600,shared:750,privateRoom:900,apartment:1513},monthly:{food:450,transport:126,phone:35,entertainment:250,misc:200},defaultWage:20},
    toronto:{name:"Toronto",province:"Ontario",provinceCode:"ON",minimumWage:17.60,minimumWageNext:17.95,minimumWageNextDate:"October 1, 2026",accommodation:{staff:700,shared:800,privateRoom:1100,apartment:2234},monthly:{food:500,transport:130,phone:35,entertainment:250,misc:200},defaultWage:20},
    montreal:{name:"Montreal",province:"Quebec",provinceCode:"QC",minimumWage:16.60,accommodation:{staff:600,shared:700,privateRoom:950,apartment:1769},monthly:{food:450,transport:100,phone:35,entertainment:250,misc:200},defaultWage:19}
  },
  lifestyle:{budget:{food:350,entertainment:100,misc:100},normal:{food:500,entertainment:250,misc:200},social:{food:650,entertainment:450,misc:300}}
};