import fs from 'fs';

const areas = {
  liverpool: [
    { code: 'L4', name: 'Anfield / Walton', lat: 53.4345, lng: -2.9665 },
    { code: 'L5', name: 'Everton / Kirkdale', lat: 53.4255, lng: -2.9780 },
    { code: 'L6', name: 'Tuebrook / Kensington', lat: 53.4150, lng: -2.9450 },
    { code: 'L7', name: 'Edge Hill / Fairfield', lat: 53.4055, lng: -2.9480 },
    { code: 'L8', name: 'Toxteth / Dingle', lat: 53.3880, lng: -2.9680 },
    { code: 'L15', name: 'Wavertree / Picton', lat: 53.3960, lng: -2.9200 },
  ],
  manchester: [
    { code: 'M13', name: 'Ardwick / Longsight', lat: 53.4610, lng: -2.2140 },
    { code: 'M19', name: 'Levenshulme / Burnage', lat: 53.4430, lng: -2.1900 },
    { code: 'M11', name: 'Clayton / Openshaw', lat: 53.4810, lng: -2.1720 },
    { code: 'M8', name: 'Cheetham / Crumpsall', lat: 53.5080, lng: -2.2380 },
    { code: 'M14', name: 'Fallowfield / Rusholme', lat: 53.4480, lng: -2.2250 },
  ],
};

const streets = {
  liverpool: ['Walton Lane', 'Priory Road', 'Kensington', 'Lodge Lane', 'Smithdown Road', 'Prescot Road', 'Mill Street', 'Upper Parliament Street', 'Breck Road', 'West Derby Road', 'Edge Lane', 'Park Road', 'Aigburth Road', 'Wavertree Road', 'Belmont Road'],
  manchester: ['Stockport Road', 'Wilmslow Road', 'Oxford Road', 'Hyde Road', 'Ashton Old Road', 'Cheetham Hill Road', 'Rochdale Road', 'Moston Lane', 'Barlow Road', 'Dickenson Road', 'Plymouth Grove', 'Slade Lane', 'Burnage Lane', 'Mauldeth Road', 'Claremont Road'],
};

const photos = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba36295?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
];

const interiors = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
];

const ages = ['pre-1919', '1919-1945', '1945-1980', 'post-1980'];
const ofsteds = ['Outstanding', 'Good', 'Good', 'Requires Improvement', 'N/A'];
const types = ['Terraced', 'Terraced', 'Terraced', 'Semi-detached', 'End-terrace'];

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[rnd(0, arr.length - 1)]; }
function jitter(base, amt) { return +(base + (Math.random() - 0.5) * amt).toFixed(5); }

function qualityFromStuck(stuck) {
  if (stuck < 15000) return 'excellent';
  if (stuck <= 30000) return 'good';
  return 'marginal';
}

function capitalTag(cashIn, capital = 50000) {
  if (cashIn <= capital) return 'solo_doable';
  if (cashIn <= capital * 1.5) return 'jv_recommended';
  return 'jv_required';
}

function buildScenario(price, refurb, gdv, strategy, scenario) {
  const mult = scenario === 'best' ? 0.92 : scenario === 'worst' ? 1.12 : 1;
  const gdvMult = scenario === 'best' ? 1.08 : scenario === 'worst' ? 0.92 : 1;
  const purchasePrice = Math.round(price * (scenario === 'best' ? 0.95 : scenario === 'worst' ? 1.0 : 0.97));
  const refurbAdj = Math.round(refurb * mult);
  const purchaseCosts = Math.round(purchasePrice * 0.035);
  const gdvAdj = Math.round(gdv * gdvMult);
  const refinanceLtv = 0.75;
  const refinanceAmount = Math.round(gdvAdj * refinanceLtv);
  let finalStuck, finalCashOut, finalCashIn, bridgeInterest, bridgeFees, totalProjectCost;
  if (strategy === 'bridge_brrr') {
    const bridgeLoan = Math.round(purchasePrice * 0.7);
    bridgeInterest = Math.round(bridgeLoan * 0.01 * 9);
    bridgeFees = Math.round(bridgeLoan * 0.02);
    const deposit = purchasePrice - bridgeLoan;
    finalCashIn = deposit + refurbAdj + purchaseCosts + bridgeInterest + bridgeFees;
    finalCashOut = Math.max(0, refinanceAmount - bridgeLoan);
    finalStuck = Math.max(0, finalCashIn - finalCashOut);
    totalProjectCost = finalCashIn + bridgeLoan;
  } else {
    finalCashIn = purchasePrice + refurbAdj + purchaseCosts;
    finalCashOut = Math.min(finalCashIn, refinanceAmount);
    finalStuck = Math.max(0, finalCashIn - refinanceAmount);
    totalProjectCost = finalCashIn;
  }
  const pullOutPct = finalCashIn > 0 ? Math.round((finalCashOut / finalCashIn) * 100) : 0;
  return {
    purchasePrice, refurb: refurbAdj, purchaseCosts,
    bridgeInterest: strategy === 'bridge_brrr' ? bridgeInterest : undefined,
    bridgeFees: strategy === 'bridge_brrr' ? bridgeFees : undefined,
    totalProjectCost,
    cashIn: finalCashIn,
    gdv: gdvAdj,
    refinanceLtv,
    refinanceAmount,
    cashOut: finalCashOut,
    capitalStuck: finalStuck,
    pullOutPct,
  };
}

const deals = [];
let id = 1;
const allAreas = [
  ...areas.liverpool.map(a => ({ ...a, city: 'liverpool' })),
  ...areas.manchester.map(a => ({ ...a, city: 'manchester' })),
];

for (let i = 0; i < 46; i++) {
  const area = allAreas[i % allAreas.length];
  const city = area.city;
  const beds = pick([2, 2, 3, 3, 3, 4]);
  const targetBeds = beds + 1;
  const sqft = rnd(600, 1200);
  const price = rnd(70, 200) * 1000;
  const qualityBias = i % 3;
  const uplift = qualityBias === 0 ? rnd(40, 60) : qualityBias === 1 ? rnd(28, 42) : rnd(12, 25);
  const gdvRealistic = Math.round(price * (1 + uplift / 100));
  const gdvStretch = Math.round(gdvRealistic * 1.08);
  const gdvConservative = Math.round(gdvRealistic * 0.92);

  const kitchen = rnd(4000, 9000);
  const bathrooms = rnd(2000, 6000);
  const flooring = rnd(1500, 4000);
  const paint = rnd(800, 2500);
  const electrics = rnd(500, 4000);
  const boiler = rnd(0, 3500);
  const roof = rnd(0, 5000);
  const damp = rnd(0, 3500);
  const bedroomConversion = rnd(2500, 7000);
  const saFinish = rnd(1500, 5000);
  const subtotal = kitchen + bathrooms + flooring + paint + electrics + boiler + roof + damp + bedroomConversion + saFinish;
  const contingencyPct = 15;
  const contingencyAmount = Math.round(subtotal * 0.15);
  const refurbTotal = subtotal + contingencyAmount;

  // Tune refurb for desired stuck bands
  let adjustedRefurb = refurbTotal;
  if (qualityBias === 0) adjustedRefurb = Math.round(refurbTotal * 0.75);
  if (qualityBias === 2) adjustedRefurb = Math.round(refurbTotal * 1.15);

  const bridgeBase = buildScenario(price, adjustedRefurb, gdvRealistic, 'bridge_brrr', 'base');
  const cashBase = buildScenario(price, adjustedRefurb, gdvRealistic, 'cash_refi', 'base');
  const capitalStuck = bridgeBase.capitalStuck;
  const quality = qualityFromStuck(capitalStuck);
  const cashInBase = bridgeBase.cashIn;
  const tag = capitalTag(cashInBase);

  const tenure = Math.random() < 0.85 ? 'freehold' : 'leasehold';
  const street = pick(streets[city]);
  const houseNo = rnd(12, 198);
  const postcode = `${area.code} ${rnd(1, 9)}${String.fromCharCode(65 + rnd(0, 25))}${String.fromCharCode(65 + rnd(0, 25))}`;
  const address = `${houseNo} ${street}, ${area.name.split(' / ')[0]}`;

  const article4 = Math.random() < 0.25;
  const selectiveLicensing = Math.random() < 0.35;
  const additionalHmo = Math.random() < 0.2;
  const conservation = Math.random() < 0.1;
  const floodZone = pick([1, 1, 1, 1, 2, 3]);

  const lhaWeekly = city === 'liverpool'
    ? (targetBeds >= 4 ? rnd(180, 220) : targetBeds === 3 ? rnd(140, 175) : rnd(110, 140))
    : (targetBeds >= 4 ? rnd(220, 280) : targetBeds === 3 ? rnd(170, 220) : rnd(140, 175));
  const lhaPct = rnd(75, 90);
  const councilLeaseMonthly = Math.round((lhaWeekly * 52 / 12) * (lhaPct / 100));
  const airbnb75th = Math.round(rnd(1800, 3200) * (city === 'manchester' ? 1.15 : 1));
  const hybridMonthly = Math.round(airbnb75th * 0.4 + councilLeaseMonthly * 0.6);

  const conversionScore = rnd(4, 10);
  const dealQualityScore = quality === 'excellent' ? rnd(8, 10) : quality === 'good' ? rnd(6, 8) : rnd(3, 6);

  const photoSet = [
    photos[i % photos.length],
    interiors[i % interiors.length],
    interiors[(i + 1) % interiors.length],
    photos[(i + 3) % photos.length],
  ];

  const comps = Array.from({ length: rnd(4, 7) }, () => ({
    address: `${rnd(10, 150)} ${pick(streets[city])}`,
    postcode: `${area.code} ${rnd(1, 9)}${String.fromCharCode(65 + rnd(0, 25))}${String.fromCharCode(65 + rnd(0, 25))}`,
    price: Math.round(gdvRealistic * (0.85 + Math.random() * 0.25)),
    beds: targetBeds,
    sqft: rnd(Math.max(500, sqft - 100), sqft + 150),
    soldDate: `2025-${String(rnd(1, 12)).padStart(2, '0')}-${String(rnd(1, 28)).padStart(2, '0')}`,
    distanceMiles: +(Math.random() * 0.8).toFixed(2),
  }));

  const flags = [];
  if (article4) flags.push('Article 4 direction');
  if (selectiveLicensing) flags.push('Selective licensing');
  if (additionalHmo) flags.push('Additional HMO licensing');
  if (conservation) flags.push('Conservation area');
  if (floodZone === 3) flags.push('Flood zone 3');

  const distressed = [];
  if (Math.random() < 0.2) distressed.push('auction');
  if (Math.random() < 0.15) distressed.push('motivated seller');
  if (Math.random() < 0.1) distressed.push('probate');
  if (Math.random() < 0.1) distressed.push('chain-free');

  // Recalc refurb object to match adjusted
  const scale = adjustedRefurb / refurbTotal;
  const adj = (n) => Math.round(n * scale);

  deals.push({
    id: `deal-${String(id).padStart(3, '0')}`,
    address,
    postcode,
    city,
    area: area.code,
    price,
    sqft,
    beds,
    baths: beds >= 3 ? rnd(1, 2) : 1,
    propertyType: pick(types),
    photos: photoSet,
    listingUrl: `https://www.rightmove.co.uk/properties/mock-${id}`,
    description: `${beds}-bed ${pick(types).toLowerCase()} in ${area.name} with strong potential to reconfigure to ${targetBeds} bedrooms. Ideal BRRR candidate with ${tenure} tenure.`,
    coords: { lat: jitter(area.lat, 0.02), lng: jitter(area.lng, 0.025) },
    tenure,
    targetBeds,
    gdv: gdvRealistic,
    capitalStuck,
    monthlyIncome: hybridMonthly,
    quality,
    capitalTag: tag,
    cashInBase,
    createdAt: `2026-0${rnd(1, 9)}-${String(rnd(1, 28)).padStart(2, '0')}`,
    layers: {
      physical: {
        tenure,
        floorplanPresent: Math.random() < 0.7,
        sqft,
        ageCategory: pick(ages),
        ...(tenure === 'leasehold' ? { leaseYearsRemaining: rnd(70, 120) } : {}),
      },
      conversion: {
        score: conversionScore,
        positives: [
          'Through-lounge easily split for extra bedroom',
          'Rear extension footprint supports WC conversion',
          sqft >= 900 ? 'Generous floor area for target beds' : 'Compact but workable layout',
        ].slice(0, rnd(2, 3)),
        negatives: [
          beds === 2 ? 'Only one reception currently' : 'Bathroom on ground floor only',
          sqft < 750 ? 'Tight sqft for +1 bed' : 'May need partition fire-rating',
        ].slice(0, rnd(1, 2)),
        currentBeds: beds,
        targetBeds,
        conversionNotes: 'Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required.',
      },
      soldComps: {
        median: gdvRealistic,
        sampleSize: comps.length,
        gdvRealistic,
        gdvStretch,
        gdvConservative,
        comps,
      },
      refurb: {
        kitchen: adj(kitchen), bathrooms: adj(bathrooms), flooring: adj(flooring), paint: adj(paint),
        electrics: adj(electrics), boiler: adj(boiler), roof: adj(roof), damp: adj(damp),
        bedroomConversion: adj(bedroomConversion), saFinish: adj(saFinish),
        contingencyPct, contingencyAmount: adj(contingencyAmount), total: adjustedRefurb,
      },
      financial: {
        bridgeBrrr: {
          best: buildScenario(price, adjustedRefurb, gdvRealistic, 'bridge_brrr', 'best'),
          base: bridgeBase,
          worst: buildScenario(price, adjustedRefurb, gdvRealistic, 'bridge_brrr', 'worst'),
        },
        cashRefi: {
          best: buildScenario(price, adjustedRefurb, gdvRealistic, 'cash_refi', 'best'),
          base: cashBase,
          worst: buildScenario(price, adjustedRefurb, gdvRealistic, 'cash_refi', 'worst'),
        },
        quality,
        capitalStuckBase: capitalStuck,
      },
      income: {
        airbnb75th,
        councilLeaseLhaPct: lhaPct,
        councilLeaseMonthly,
        hybridMonthly,
        lhaWeekly,
        notes: `Airbnb 75th percentile for ${targetBeds}-bed in ${area.code}. Council lease modelled at ${lhaPct}% of LHA.`,
      },
      regulatory: {
        article4, selectiveLicensing, additionalHmo, conservation,
        floodZone, flags,
      },
      risk: {
        daysOnMarket: rnd(5, 180),
        priceReductions: rnd(0, 3),
        auction: distressed.includes('auction'),
        distressedKeywords: distressed,
        crimeScore: rnd(3, 8),
        ofstedRating: pick(ofsteds),
        transportScore: rnd(4, 9),
        greenSpaceScore: rnd(3, 9),
        dealQualityScore,
        reasoning: quality === 'excellent'
          ? 'Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit.'
          : quality === 'good'
          ? 'Solid numbers with acceptable capital left in; watch refurb overruns and local licensing.'
          : 'Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price.',
      },
    },
  });
  id++;
}

const out = `import type { Deal } from "@/types/deal";\n\nexport const MOCK_DEALS: Deal[] = ${JSON.stringify(deals, null, 2)};\n\nexport function getDealById(id: string): Deal | undefined {\n  return MOCK_DEALS.find((d) => d.id === id);\n}\n\nexport function getAllDeals(): Deal[] {\n  return MOCK_DEALS;\n}\n`;

fs.writeFileSync('/workspace/dealhunter/src/data/mock-properties.ts', out);
const q = { excellent: 0, good: 0, marginal: 0 };
deals.forEach(d => q[d.quality]++);
console.log('Generated', deals.length, 'deals', q);
