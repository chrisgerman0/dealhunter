import type { Deal } from "@/types/deal";

export const MOCK_DEALS: Deal[] = [
  {
    "id": "deal-001",
    "address": "126 Breck Road, Anfield",
    "postcode": "L4 2EW",
    "city": "liverpool",
    "area": "L4",
    "price": 84000,
    "sqft": 685,
    "beds": 3,
    "baths": 2,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-1",
    "description": "3-bed terraced in Anfield / Walton with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.43106,
      "lng": -2.96149
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 129360,
    "capitalStuck": 14555,
    "monthlyIncome": 1670,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 54539,
    "createdAt": "2026-06-28",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 685,
        "ageCategory": "post-1980"
      },
      "conversion": {
        "score": 7,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "Tight sqft for +1 bed"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 129360,
        "sampleSize": 6,
        "gdvRealistic": 129360,
        "gdvStretch": 139709,
        "gdvConservative": 119011,
        "comps": [
          {
            "address": "16 Smithdown Road",
            "postcode": "L4 6TK",
            "price": 120284,
            "beds": 4,
            "sqft": 673,
            "soldDate": "2025-03-01",
            "distanceMiles": 0.12
          },
          {
            "address": "123 Kensington",
            "postcode": "L4 2OR",
            "price": 136089,
            "beds": 4,
            "sqft": 601,
            "soldDate": "2025-01-05",
            "distanceMiles": 0.56
          },
          {
            "address": "57 Smithdown Road",
            "postcode": "L4 7MF",
            "price": 132648,
            "beds": 4,
            "sqft": 795,
            "soldDate": "2025-11-06",
            "distanceMiles": 0.15
          },
          {
            "address": "97 Priory Road",
            "postcode": "L4 8XW",
            "price": 116364,
            "beds": 4,
            "sqft": 791,
            "soldDate": "2025-09-24",
            "distanceMiles": 0.63
          },
          {
            "address": "143 Priory Road",
            "postcode": "L4 9VH",
            "price": 131925,
            "beds": 4,
            "sqft": 716,
            "soldDate": "2025-12-21",
            "distanceMiles": 0.09
          },
          {
            "address": "139 Walton Lane",
            "postcode": "L4 9CE",
            "price": 118479,
            "beds": 4,
            "sqft": 678,
            "soldDate": "2025-04-21",
            "distanceMiles": 0.05
          }
        ]
      },
      "refurb": {
        "kitchen": 5072,
        "bathrooms": 3190,
        "flooring": 1208,
        "paint": 1221,
        "electrics": 865,
        "boiler": 1030,
        "roof": 625,
        "damp": 1865,
        "bedroomConversion": 2020,
        "saFinish": 1139,
        "contingencyPct": 15,
        "contingencyAmount": 2735,
        "total": 20969
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 79800,
            "refurb": 19291,
            "purchaseCosts": 2793,
            "bridgeInterest": 5027,
            "bridgeFees": 1117,
            "totalProjectCost": 108028,
            "cashIn": 52168,
            "gdv": 139709,
            "refinanceLtv": 0.75,
            "refinanceAmount": 104782,
            "cashOut": 48922,
            "capitalStuck": 3246,
            "pullOutPct": 94
          },
          "base": {
            "purchasePrice": 81480,
            "refurb": 20969,
            "purchaseCosts": 2852,
            "bridgeInterest": 5133,
            "bridgeFees": 1141,
            "totalProjectCost": 111575,
            "cashIn": 54539,
            "gdv": 129360,
            "refinanceLtv": 0.75,
            "refinanceAmount": 97020,
            "cashOut": 39984,
            "capitalStuck": 14555,
            "pullOutPct": 73
          },
          "worst": {
            "purchasePrice": 84000,
            "refurb": 23485,
            "purchaseCosts": 2940,
            "bridgeInterest": 5292,
            "bridgeFees": 1176,
            "totalProjectCost": 116893,
            "cashIn": 58093,
            "gdv": 119011,
            "refinanceLtv": 0.75,
            "refinanceAmount": 89258,
            "cashOut": 30458,
            "capitalStuck": 27635,
            "pullOutPct": 52
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 79800,
            "refurb": 19291,
            "purchaseCosts": 2793,
            "totalProjectCost": 101884,
            "cashIn": 101884,
            "gdv": 139709,
            "refinanceLtv": 0.75,
            "refinanceAmount": 104782,
            "cashOut": 101884,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 81480,
            "refurb": 20969,
            "purchaseCosts": 2852,
            "totalProjectCost": 105301,
            "cashIn": 105301,
            "gdv": 129360,
            "refinanceLtv": 0.75,
            "refinanceAmount": 97020,
            "cashOut": 97020,
            "capitalStuck": 8281,
            "pullOutPct": 92
          },
          "worst": {
            "purchasePrice": 84000,
            "refurb": 23485,
            "purchaseCosts": 2940,
            "totalProjectCost": 110425,
            "cashIn": 110425,
            "gdv": 119011,
            "refinanceLtv": 0.75,
            "refinanceAmount": 89258,
            "cashOut": 89258,
            "capitalStuck": 21167,
            "pullOutPct": 81
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 14555
      },
      "income": {
        "airbnb75th": 3132,
        "councilLeaseLhaPct": 78,
        "councilLeaseMonthly": 696,
        "hybridMonthly": 1670,
        "lhaWeekly": 206,
        "notes": "Airbnb 75th percentile for 4-bed in L4. Council lease modelled at 78% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 99,
        "priceReductions": 0,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 7,
        "ofstedRating": "Requires Improvement",
        "transportScore": 4,
        "greenSpaceScore": 7,
        "dealQualityScore": 9,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-002",
    "address": "45 Smithdown Road, Everton",
    "postcode": "L5 2LM",
    "city": "liverpool",
    "area": "L5",
    "price": 109000,
    "sqft": 742,
    "beds": 4,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-2",
    "description": "4-bed semi-detached in Everton / Kirkdale with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.43334,
      "lng": -2.97153
    },
    "tenure": "freehold",
    "targetBeds": 5,
    "gdv": 149330,
    "capitalStuck": 31037,
    "monthlyIncome": 1717,
    "quality": "marginal",
    "capitalTag": "jv_recommended",
    "cashInBase": 69024,
    "createdAt": "2026-07-03",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 742,
        "ageCategory": "1919-1945"
      },
      "conversion": {
        "score": 6,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "Tight sqft for +1 bed"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 149330,
        "sampleSize": 7,
        "gdvRealistic": 149330,
        "gdvStretch": 161276,
        "gdvConservative": 137384,
        "comps": [
          {
            "address": "44 Smithdown Road",
            "postcode": "L5 7LT",
            "price": 130431,
            "beds": 5,
            "sqft": 803,
            "soldDate": "2025-12-02",
            "distanceMiles": 0.63
          },
          {
            "address": "91 Mill Street",
            "postcode": "L5 6MB",
            "price": 163016,
            "beds": 5,
            "sqft": 792,
            "soldDate": "2025-10-02",
            "distanceMiles": 0.21
          },
          {
            "address": "34 Edge Lane",
            "postcode": "L5 7SO",
            "price": 144382,
            "beds": 5,
            "sqft": 736,
            "soldDate": "2025-10-28",
            "distanceMiles": 0.25
          },
          {
            "address": "21 Edge Lane",
            "postcode": "L5 4QR",
            "price": 142757,
            "beds": 5,
            "sqft": 642,
            "soldDate": "2025-07-07",
            "distanceMiles": 0.49
          },
          {
            "address": "67 Prescot Road",
            "postcode": "L5 2GY",
            "price": 159654,
            "beds": 5,
            "sqft": 648,
            "soldDate": "2025-02-23",
            "distanceMiles": 0.5
          },
          {
            "address": "147 Belmont Road",
            "postcode": "L5 9CQ",
            "price": 128109,
            "beds": 5,
            "sqft": 878,
            "soldDate": "2025-01-21",
            "distanceMiles": 0.38
          },
          {
            "address": "41 Prescot Road",
            "postcode": "L5 4AV",
            "price": 145216,
            "beds": 5,
            "sqft": 699,
            "soldDate": "2025-03-16",
            "distanceMiles": 0.09
          }
        ]
      },
      "refurb": {
        "kitchen": 4345,
        "bathrooms": 4323,
        "flooring": 1974,
        "paint": 757,
        "electrics": 1083,
        "boiler": 1769,
        "roof": 721,
        "damp": 708,
        "bedroomConversion": 3654,
        "saFinish": 2808,
        "contingencyPct": 15,
        "contingencyAmount": 3321,
        "total": 25463
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 103550,
            "refurb": 23426,
            "purchaseCosts": 3624,
            "bridgeInterest": 6524,
            "bridgeFees": 1450,
            "totalProjectCost": 138574,
            "cashIn": 66089,
            "gdv": 161276,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120957,
            "cashOut": 48472,
            "capitalStuck": 17617,
            "pullOutPct": 73
          },
          "base": {
            "purchasePrice": 105730,
            "refurb": 25463,
            "purchaseCosts": 3701,
            "bridgeInterest": 6661,
            "bridgeFees": 1480,
            "totalProjectCost": 143035,
            "cashIn": 69024,
            "gdv": 149330,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111998,
            "cashOut": 37987,
            "capitalStuck": 31037,
            "pullOutPct": 55
          },
          "worst": {
            "purchasePrice": 109000,
            "refurb": 28519,
            "purchaseCosts": 3815,
            "bridgeInterest": 6867,
            "bridgeFees": 1526,
            "totalProjectCost": 149727,
            "cashIn": 73427,
            "gdv": 137384,
            "refinanceLtv": 0.75,
            "refinanceAmount": 103038,
            "cashOut": 26738,
            "capitalStuck": 46689,
            "pullOutPct": 36
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 103550,
            "refurb": 23426,
            "purchaseCosts": 3624,
            "totalProjectCost": 130600,
            "cashIn": 130600,
            "gdv": 161276,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120957,
            "cashOut": 120957,
            "capitalStuck": 9643,
            "pullOutPct": 93
          },
          "base": {
            "purchasePrice": 105730,
            "refurb": 25463,
            "purchaseCosts": 3701,
            "totalProjectCost": 134894,
            "cashIn": 134894,
            "gdv": 149330,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111998,
            "cashOut": 111998,
            "capitalStuck": 22896,
            "pullOutPct": 83
          },
          "worst": {
            "purchasePrice": 109000,
            "refurb": 28519,
            "purchaseCosts": 3815,
            "totalProjectCost": 141334,
            "cashIn": 141334,
            "gdv": 137384,
            "refinanceLtv": 0.75,
            "refinanceAmount": 103038,
            "cashOut": 103038,
            "capitalStuck": 38296,
            "pullOutPct": 73
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 31037
      },
      "income": {
        "airbnb75th": 3031,
        "councilLeaseLhaPct": 89,
        "councilLeaseMonthly": 841,
        "hybridMonthly": 1717,
        "lhaWeekly": 218,
        "notes": "Airbnb 75th percentile for 5-bed in L5. Council lease modelled at 89% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 77,
        "priceReductions": 2,
        "auction": true,
        "distressedKeywords": [
          "auction"
        ],
        "crimeScore": 7,
        "ofstedRating": "Good",
        "transportScore": 6,
        "greenSpaceScore": 3,
        "dealQualityScore": 5,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-003",
    "address": "112 Walton Lane, Tuebrook",
    "postcode": "L6 4RX",
    "city": "liverpool",
    "area": "L6",
    "price": 178000,
    "sqft": 1058,
    "beds": 3,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-3",
    "description": "3-bed terraced in Tuebrook / Kensington with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.41558,
      "lng": -2.954
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 227840,
    "capitalStuck": 75210,
    "monthlyIncome": 1181,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 125228,
    "createdAt": "2026-01-10",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 1058,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 4,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 227840,
        "sampleSize": 6,
        "gdvRealistic": 227840,
        "gdvStretch": 246067,
        "gdvConservative": 209613,
        "comps": [
          {
            "address": "93 Kensington",
            "postcode": "L6 9MU",
            "price": 200846,
            "beds": 4,
            "sqft": 1144,
            "soldDate": "2025-03-27",
            "distanceMiles": 0.14
          },
          {
            "address": "149 Walton Lane",
            "postcode": "L6 4GH",
            "price": 194679,
            "beds": 4,
            "sqft": 1029,
            "soldDate": "2025-07-02",
            "distanceMiles": 0.06
          },
          {
            "address": "45 Aigburth Road",
            "postcode": "L6 1HP",
            "price": 199391,
            "beds": 4,
            "sqft": 1176,
            "soldDate": "2025-02-25",
            "distanceMiles": 0.23
          },
          {
            "address": "41 West Derby Road",
            "postcode": "L6 2QX",
            "price": 220185,
            "beds": 4,
            "sqft": 1019,
            "soldDate": "2025-11-04",
            "distanceMiles": 0.63
          },
          {
            "address": "95 Edge Lane",
            "postcode": "L6 6UN",
            "price": 235805,
            "beds": 4,
            "sqft": 1152,
            "soldDate": "2025-05-17",
            "distanceMiles": 0.62
          },
          {
            "address": "108 Mill Street",
            "postcode": "L6 4RL",
            "price": 238197,
            "beds": 4,
            "sqft": 1023,
            "soldDate": "2025-01-18",
            "distanceMiles": 0.55
          }
        ]
      },
      "refurb": {
        "kitchen": 10406,
        "bathrooms": 4429,
        "flooring": 3121,
        "paint": 3192,
        "electrics": 5619,
        "boiler": 2365,
        "roof": 3079,
        "damp": 2067,
        "bedroomConversion": 8997,
        "saFinish": 3760,
        "contingencyPct": 15,
        "contingencyAmount": 7056,
        "total": 54092
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 169100,
            "refurb": 49765,
            "purchaseCosts": 5919,
            "bridgeInterest": 10653,
            "bridgeFees": 2367,
            "totalProjectCost": 237804,
            "cashIn": 119434,
            "gdv": 246067,
            "refinanceLtv": 0.75,
            "refinanceAmount": 184550,
            "cashOut": 66180,
            "capitalStuck": 53254,
            "pullOutPct": 55
          },
          "base": {
            "purchasePrice": 172660,
            "refurb": 54092,
            "purchaseCosts": 6043,
            "bridgeInterest": 10878,
            "bridgeFees": 2417,
            "totalProjectCost": 246090,
            "cashIn": 125228,
            "gdv": 227840,
            "refinanceLtv": 0.75,
            "refinanceAmount": 170880,
            "cashOut": 50018,
            "capitalStuck": 75210,
            "pullOutPct": 40
          },
          "worst": {
            "purchasePrice": 178000,
            "refurb": 60583,
            "purchaseCosts": 6230,
            "bridgeInterest": 11214,
            "bridgeFees": 2492,
            "totalProjectCost": 258519,
            "cashIn": 133919,
            "gdv": 209613,
            "refinanceLtv": 0.75,
            "refinanceAmount": 157210,
            "cashOut": 32610,
            "capitalStuck": 101309,
            "pullOutPct": 24
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 169100,
            "refurb": 49765,
            "purchaseCosts": 5919,
            "totalProjectCost": 224784,
            "cashIn": 224784,
            "gdv": 246067,
            "refinanceLtv": 0.75,
            "refinanceAmount": 184550,
            "cashOut": 184550,
            "capitalStuck": 40234,
            "pullOutPct": 82
          },
          "base": {
            "purchasePrice": 172660,
            "refurb": 54092,
            "purchaseCosts": 6043,
            "totalProjectCost": 232795,
            "cashIn": 232795,
            "gdv": 227840,
            "refinanceLtv": 0.75,
            "refinanceAmount": 170880,
            "cashOut": 170880,
            "capitalStuck": 61915,
            "pullOutPct": 73
          },
          "worst": {
            "purchasePrice": 178000,
            "refurb": 60583,
            "purchaseCosts": 6230,
            "totalProjectCost": 244813,
            "cashIn": 244813,
            "gdv": 209613,
            "refinanceLtv": 0.75,
            "refinanceAmount": 157210,
            "cashOut": 157210,
            "capitalStuck": 87603,
            "pullOutPct": 64
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 75210
      },
      "income": {
        "airbnb75th": 1918,
        "councilLeaseLhaPct": 78,
        "councilLeaseMonthly": 690,
        "hybridMonthly": 1181,
        "lhaWeekly": 204,
        "notes": "Airbnb 75th percentile for 4-bed in L6. Council lease modelled at 78% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 118,
        "priceReductions": 2,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 3,
        "ofstedRating": "Requires Improvement",
        "transportScore": 6,
        "greenSpaceScore": 7,
        "dealQualityScore": 5,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-004",
    "address": "71 Walton Lane, Edge Hill",
    "postcode": "L7 6MK",
    "city": "liverpool",
    "area": "L7",
    "price": 126000,
    "sqft": 871,
    "beds": 3,
    "baths": 2,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-4",
    "description": "3-bed terraced in Edge Hill / Fairfield with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.41123,
      "lng": -2.9598
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 185220,
    "capitalStuck": 20820,
    "monthlyIncome": 1334,
    "quality": "good",
    "capitalTag": "jv_recommended",
    "cashInBase": 74181,
    "createdAt": "2026-01-21",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 871,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 9,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 185220,
        "sampleSize": 6,
        "gdvRealistic": 185220,
        "gdvStretch": 200038,
        "gdvConservative": 170402,
        "comps": [
          {
            "address": "26 West Derby Road",
            "postcode": "L7 3PR",
            "price": 203439,
            "beds": 4,
            "sqft": 998,
            "soldDate": "2025-02-14",
            "distanceMiles": 0.22
          },
          {
            "address": "147 Priory Road",
            "postcode": "L7 8PP",
            "price": 185453,
            "beds": 4,
            "sqft": 904,
            "soldDate": "2025-03-26",
            "distanceMiles": 0.04
          },
          {
            "address": "102 Kensington",
            "postcode": "L7 1PX",
            "price": 198455,
            "beds": 4,
            "sqft": 987,
            "soldDate": "2025-06-24",
            "distanceMiles": 0.77
          },
          {
            "address": "101 Smithdown Road",
            "postcode": "L7 6VT",
            "price": 177313,
            "beds": 4,
            "sqft": 973,
            "soldDate": "2025-12-14",
            "distanceMiles": 0.36
          },
          {
            "address": "44 West Derby Road",
            "postcode": "L7 2FS",
            "price": 182176,
            "beds": 4,
            "sqft": 974,
            "soldDate": "2025-11-21",
            "distanceMiles": 0.07
          },
          {
            "address": "128 Smithdown Road",
            "postcode": "L7 8EX",
            "price": 169410,
            "beds": 4,
            "sqft": 1007,
            "soldDate": "2025-01-05",
            "distanceMiles": 0.5
          }
        ]
      },
      "refurb": {
        "kitchen": 5099,
        "bathrooms": 1593,
        "flooring": 2189,
        "paint": 1259,
        "electrics": 599,
        "boiler": 784,
        "roof": 2327,
        "damp": 1056,
        "bedroomConversion": 3061,
        "saFinish": 2751,
        "contingencyPct": 15,
        "contingencyAmount": 3108,
        "total": 23826
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 119700,
            "refurb": 21920,
            "purchaseCosts": 4190,
            "bridgeInterest": 7541,
            "bridgeFees": 1676,
            "totalProjectCost": 155027,
            "cashIn": 71237,
            "gdv": 200038,
            "refinanceLtv": 0.75,
            "refinanceAmount": 150029,
            "cashOut": 66239,
            "capitalStuck": 4998,
            "pullOutPct": 93
          },
          "base": {
            "purchasePrice": 122220,
            "refurb": 23826,
            "purchaseCosts": 4278,
            "bridgeInterest": 7700,
            "bridgeFees": 1711,
            "totalProjectCost": 159735,
            "cashIn": 74181,
            "gdv": 185220,
            "refinanceLtv": 0.75,
            "refinanceAmount": 138915,
            "cashOut": 53361,
            "capitalStuck": 20820,
            "pullOutPct": 72
          },
          "worst": {
            "purchasePrice": 126000,
            "refurb": 26685,
            "purchaseCosts": 4410,
            "bridgeInterest": 7938,
            "bridgeFees": 1764,
            "totalProjectCost": 166797,
            "cashIn": 78597,
            "gdv": 170402,
            "refinanceLtv": 0.75,
            "refinanceAmount": 127802,
            "cashOut": 39602,
            "capitalStuck": 38995,
            "pullOutPct": 50
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 119700,
            "refurb": 21920,
            "purchaseCosts": 4190,
            "totalProjectCost": 145810,
            "cashIn": 145810,
            "gdv": 200038,
            "refinanceLtv": 0.75,
            "refinanceAmount": 150029,
            "cashOut": 145810,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 122220,
            "refurb": 23826,
            "purchaseCosts": 4278,
            "totalProjectCost": 150324,
            "cashIn": 150324,
            "gdv": 185220,
            "refinanceLtv": 0.75,
            "refinanceAmount": 138915,
            "cashOut": 138915,
            "capitalStuck": 11409,
            "pullOutPct": 92
          },
          "worst": {
            "purchasePrice": 126000,
            "refurb": 26685,
            "purchaseCosts": 4410,
            "totalProjectCost": 157095,
            "cashIn": 157095,
            "gdv": 170402,
            "refinanceLtv": 0.75,
            "refinanceAmount": 127802,
            "cashOut": 127802,
            "capitalStuck": 29293,
            "pullOutPct": 81
          }
        },
        "quality": "good",
        "capitalStuckBase": 20820
      },
      "income": {
        "airbnb75th": 2352,
        "councilLeaseLhaPct": 76,
        "councilLeaseMonthly": 655,
        "hybridMonthly": 1334,
        "lhaWeekly": 199,
        "notes": "Airbnb 75th percentile for 4-bed in L7. Council lease modelled at 76% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 9,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 3,
        "ofstedRating": "Good",
        "transportScore": 4,
        "greenSpaceScore": 7,
        "dealQualityScore": 7,
        "reasoning": "Solid numbers with acceptable capital left in; watch refurb overruns and local licensing."
      }
    }
  },
  {
    "id": "deal-005",
    "address": "69 Aigburth Road, Toxteth",
    "postcode": "L8 4DZ",
    "city": "liverpool",
    "area": "L8",
    "price": 129000,
    "sqft": 612,
    "beds": 3,
    "baths": 2,
    "propertyType": "End-terrace",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-5",
    "description": "3-bed terraced in Toxteth / Dingle with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.39299,
      "lng": -2.95867
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 190920,
    "capitalStuck": 22012,
    "monthlyIncome": 1247,
    "quality": "good",
    "capitalTag": "jv_required",
    "cashInBase": 77611,
    "createdAt": "2026-01-20",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 612,
        "ageCategory": "1919-1945"
      },
      "conversion": {
        "score": 6,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 190920,
        "sampleSize": 7,
        "gdvRealistic": 190920,
        "gdvStretch": 206194,
        "gdvConservative": 175646,
        "comps": [
          {
            "address": "106 Edge Lane",
            "postcode": "L8 5ZJ",
            "price": 209734,
            "beds": 4,
            "sqft": 677,
            "soldDate": "2025-11-15",
            "distanceMiles": 0.75
          },
          {
            "address": "14 Breck Road",
            "postcode": "L8 2IR",
            "price": 179124,
            "beds": 4,
            "sqft": 710,
            "soldDate": "2025-03-07",
            "distanceMiles": 0.22
          },
          {
            "address": "12 Prescot Road",
            "postcode": "L8 6HR",
            "price": 174672,
            "beds": 4,
            "sqft": 622,
            "soldDate": "2025-09-01",
            "distanceMiles": 0.48
          },
          {
            "address": "11 Priory Road",
            "postcode": "L8 3CJ",
            "price": 167325,
            "beds": 4,
            "sqft": 672,
            "soldDate": "2025-07-12",
            "distanceMiles": 0.01
          },
          {
            "address": "41 Lodge Lane",
            "postcode": "L8 7ZX",
            "price": 198638,
            "beds": 4,
            "sqft": 528,
            "soldDate": "2025-06-10",
            "distanceMiles": 0.49
          },
          {
            "address": "48 Kensington",
            "postcode": "L8 3OZ",
            "price": 173765,
            "beds": 4,
            "sqft": 586,
            "soldDate": "2025-05-17",
            "distanceMiles": 0.35
          },
          {
            "address": "129 Breck Road",
            "postcode": "L8 4TZ",
            "price": 198227,
            "beds": 4,
            "sqft": 623,
            "soldDate": "2025-03-04",
            "distanceMiles": 0.43
          }
        ]
      },
      "refurb": {
        "kitchen": 4331,
        "bathrooms": 4311,
        "flooring": 1237,
        "paint": 1038,
        "electrics": 2151,
        "boiler": 1906,
        "roof": 413,
        "damp": 2256,
        "bedroomConversion": 2541,
        "saFinish": 2475,
        "contingencyPct": 15,
        "contingencyAmount": 3399,
        "total": 26057
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 122550,
            "refurb": 23972,
            "purchaseCosts": 4289,
            "bridgeInterest": 7721,
            "bridgeFees": 1716,
            "totalProjectCost": 160248,
            "cashIn": 74463,
            "gdv": 206194,
            "refinanceLtv": 0.75,
            "refinanceAmount": 154646,
            "cashOut": 68861,
            "capitalStuck": 5602,
            "pullOutPct": 92
          },
          "base": {
            "purchasePrice": 125130,
            "refurb": 26057,
            "purchaseCosts": 4380,
            "bridgeInterest": 7883,
            "bridgeFees": 1752,
            "totalProjectCost": 165202,
            "cashIn": 77611,
            "gdv": 190920,
            "refinanceLtv": 0.75,
            "refinanceAmount": 143190,
            "cashOut": 55599,
            "capitalStuck": 22012,
            "pullOutPct": 72
          },
          "worst": {
            "purchasePrice": 129000,
            "refurb": 29184,
            "purchaseCosts": 4515,
            "bridgeInterest": 8127,
            "bridgeFees": 1806,
            "totalProjectCost": 172632,
            "cashIn": 82332,
            "gdv": 175646,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131735,
            "cashOut": 41435,
            "capitalStuck": 40897,
            "pullOutPct": 50
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 122550,
            "refurb": 23972,
            "purchaseCosts": 4289,
            "totalProjectCost": 150811,
            "cashIn": 150811,
            "gdv": 206194,
            "refinanceLtv": 0.75,
            "refinanceAmount": 154646,
            "cashOut": 150811,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 125130,
            "refurb": 26057,
            "purchaseCosts": 4380,
            "totalProjectCost": 155567,
            "cashIn": 155567,
            "gdv": 190920,
            "refinanceLtv": 0.75,
            "refinanceAmount": 143190,
            "cashOut": 143190,
            "capitalStuck": 12377,
            "pullOutPct": 92
          },
          "worst": {
            "purchasePrice": 129000,
            "refurb": 29184,
            "purchaseCosts": 4515,
            "totalProjectCost": 162699,
            "cashIn": 162699,
            "gdv": 175646,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131735,
            "cashOut": 131735,
            "capitalStuck": 30964,
            "pullOutPct": 81
          }
        },
        "quality": "good",
        "capitalStuckBase": 22012
      },
      "income": {
        "airbnb75th": 1995,
        "councilLeaseLhaPct": 81,
        "councilLeaseMonthly": 748,
        "hybridMonthly": 1247,
        "lhaWeekly": 213,
        "notes": "Airbnb 75th percentile for 4-bed in L8. Council lease modelled at 81% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 3,
        "flags": [
          "Selective licensing",
          "Flood zone 3"
        ]
      },
      "risk": {
        "daysOnMarket": 127,
        "priceReductions": 0,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 8,
        "ofstedRating": "N/A",
        "transportScore": 8,
        "greenSpaceScore": 3,
        "dealQualityScore": 6,
        "reasoning": "Solid numbers with acceptable capital left in; watch refurb overruns and local licensing."
      }
    }
  },
  {
    "id": "deal-006",
    "address": "71 Kensington, Wavertree",
    "postcode": "L15 7RY",
    "city": "liverpool",
    "area": "L15",
    "price": 160000,
    "sqft": 1059,
    "beds": 3,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-6",
    "description": "3-bed semi-detached in Wavertree / Picton with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.40359,
      "lng": -2.92428
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 185600,
    "capitalStuck": 79048,
    "monthlyIncome": 1492,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 109608,
    "createdAt": "2026-01-11",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 1059,
        "ageCategory": "1919-1945"
      },
      "conversion": {
        "score": 4,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 185600,
        "sampleSize": 7,
        "gdvRealistic": 185600,
        "gdvStretch": 200448,
        "gdvConservative": 170752,
        "comps": [
          {
            "address": "37 West Derby Road",
            "postcode": "L15 1PR",
            "price": 158284,
            "beds": 4,
            "sqft": 1165,
            "soldDate": "2025-12-16",
            "distanceMiles": 0.03
          },
          {
            "address": "140 Kensington",
            "postcode": "L15 8MK",
            "price": 177481,
            "beds": 4,
            "sqft": 1163,
            "soldDate": "2025-04-10",
            "distanceMiles": 0.18
          },
          {
            "address": "136 Walton Lane",
            "postcode": "L15 2HO",
            "price": 202456,
            "beds": 4,
            "sqft": 1090,
            "soldDate": "2025-09-26",
            "distanceMiles": 0.51
          },
          {
            "address": "116 Park Road",
            "postcode": "L15 2QT",
            "price": 178212,
            "beds": 4,
            "sqft": 1138,
            "soldDate": "2025-01-21",
            "distanceMiles": 0.42
          },
          {
            "address": "52 Kensington",
            "postcode": "L15 9KT",
            "price": 197011,
            "beds": 4,
            "sqft": 1050,
            "soldDate": "2025-06-08",
            "distanceMiles": 0.6
          },
          {
            "address": "23 Walton Lane",
            "postcode": "L15 5ZK",
            "price": 163233,
            "beds": 4,
            "sqft": 1135,
            "soldDate": "2025-04-26",
            "distanceMiles": 0.42
          },
          {
            "address": "85 Aigburth Road",
            "postcode": "L15 2UT",
            "price": 165870,
            "beds": 4,
            "sqft": 1137,
            "soldDate": "2025-04-18",
            "distanceMiles": 0.31
          }
        ]
      },
      "refurb": {
        "kitchen": 9835,
        "bathrooms": 4542,
        "flooring": 2429,
        "paint": 2130,
        "electrics": 4010,
        "boiler": 2948,
        "roof": 1047,
        "damp": 283,
        "bedroomConversion": 7420,
        "saFinish": 5064,
        "contingencyPct": 15,
        "contingencyAmount": 5957,
        "total": 45665
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 152000,
            "refurb": 42012,
            "purchaseCosts": 5320,
            "bridgeInterest": 9576,
            "bridgeFees": 2128,
            "totalProjectCost": 211036,
            "cashIn": 104636,
            "gdv": 200448,
            "refinanceLtv": 0.75,
            "refinanceAmount": 150336,
            "cashOut": 43936,
            "capitalStuck": 60700,
            "pullOutPct": 42
          },
          "base": {
            "purchasePrice": 155200,
            "refurb": 45665,
            "purchaseCosts": 5432,
            "bridgeInterest": 9778,
            "bridgeFees": 2173,
            "totalProjectCost": 218248,
            "cashIn": 109608,
            "gdv": 185600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 139200,
            "cashOut": 30560,
            "capitalStuck": 79048,
            "pullOutPct": 28
          },
          "worst": {
            "purchasePrice": 160000,
            "refurb": 51145,
            "purchaseCosts": 5600,
            "bridgeInterest": 10080,
            "bridgeFees": 2240,
            "totalProjectCost": 229065,
            "cashIn": 117065,
            "gdv": 170752,
            "refinanceLtv": 0.75,
            "refinanceAmount": 128064,
            "cashOut": 16064,
            "capitalStuck": 101001,
            "pullOutPct": 14
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 152000,
            "refurb": 42012,
            "purchaseCosts": 5320,
            "totalProjectCost": 199332,
            "cashIn": 199332,
            "gdv": 200448,
            "refinanceLtv": 0.75,
            "refinanceAmount": 150336,
            "cashOut": 150336,
            "capitalStuck": 48996,
            "pullOutPct": 75
          },
          "base": {
            "purchasePrice": 155200,
            "refurb": 45665,
            "purchaseCosts": 5432,
            "totalProjectCost": 206297,
            "cashIn": 206297,
            "gdv": 185600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 139200,
            "cashOut": 139200,
            "capitalStuck": 67097,
            "pullOutPct": 67
          },
          "worst": {
            "purchasePrice": 160000,
            "refurb": 51145,
            "purchaseCosts": 5600,
            "totalProjectCost": 216745,
            "cashIn": 216745,
            "gdv": 170752,
            "refinanceLtv": 0.75,
            "refinanceAmount": 128064,
            "cashOut": 128064,
            "capitalStuck": 88681,
            "pullOutPct": 59
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 79048
      },
      "income": {
        "airbnb75th": 2562,
        "councilLeaseLhaPct": 88,
        "councilLeaseMonthly": 778,
        "hybridMonthly": 1492,
        "lhaWeekly": 204,
        "notes": "Airbnb 75th percentile for 4-bed in L15. Council lease modelled at 88% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 2,
        "flags": [
          "Selective licensing",
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 173,
        "priceReductions": 2,
        "auction": true,
        "distressedKeywords": [
          "auction",
          "motivated seller"
        ],
        "crimeScore": 6,
        "ofstedRating": "Good",
        "transportScore": 9,
        "greenSpaceScore": 5,
        "dealQualityScore": 5,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-007",
    "address": "67 Claremont Road, Ardwick",
    "postcode": "M13 7WK",
    "city": "manchester",
    "area": "M13",
    "price": 119000,
    "sqft": 804,
    "beds": 4,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-7",
    "description": "4-bed terraced in Ardwick / Longsight with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.462,
      "lng": -2.22011
    },
    "tenure": "freehold",
    "targetBeds": 5,
    "gdv": 182070,
    "capitalStuck": 12549,
    "monthlyIncome": 1582,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 68301,
    "createdAt": "2026-09-20",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 804,
        "ageCategory": "post-1980"
      },
      "conversion": {
        "score": 9,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 182070,
        "sampleSize": 5,
        "gdvRealistic": 182070,
        "gdvStretch": 196636,
        "gdvConservative": 167504,
        "comps": [
          {
            "address": "134 Wilmslow Road",
            "postcode": "M13 6UZ",
            "price": 172385,
            "beds": 5,
            "sqft": 839,
            "soldDate": "2025-07-03",
            "distanceMiles": 0.72
          },
          {
            "address": "91 Claremont Road",
            "postcode": "M13 5TL",
            "price": 172827,
            "beds": 5,
            "sqft": 902,
            "soldDate": "2025-05-06",
            "distanceMiles": 0.35
          },
          {
            "address": "95 Slade Lane",
            "postcode": "M13 9XC",
            "price": 184467,
            "beds": 5,
            "sqft": 858,
            "soldDate": "2025-01-26",
            "distanceMiles": 0.66
          },
          {
            "address": "124 Barlow Road",
            "postcode": "M13 2AV",
            "price": 165662,
            "beds": 5,
            "sqft": 834,
            "soldDate": "2025-12-07",
            "distanceMiles": 0.34
          },
          {
            "address": "20 Mauldeth Road",
            "postcode": "M13 5TU",
            "price": 187917,
            "beds": 5,
            "sqft": 861,
            "soldDate": "2025-07-08",
            "distanceMiles": 0.01
          }
        ]
      },
      "refurb": {
        "kitchen": 4094,
        "bathrooms": 3260,
        "flooring": 2528,
        "paint": 711,
        "electrics": 1548,
        "boiler": 128,
        "roof": 1214,
        "damp": 450,
        "bedroomConversion": 2193,
        "saFinish": 1912,
        "contingencyPct": 15,
        "contingencyAmount": 2706,
        "total": 20744
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 113050,
            "refurb": 19084,
            "purchaseCosts": 3957,
            "bridgeInterest": 7122,
            "bridgeFees": 1583,
            "totalProjectCost": 144796,
            "cashIn": 65661,
            "gdv": 196636,
            "refinanceLtv": 0.75,
            "refinanceAmount": 147477,
            "cashOut": 68342,
            "capitalStuck": 0,
            "pullOutPct": 104
          },
          "base": {
            "purchasePrice": 115430,
            "refurb": 20744,
            "purchaseCosts": 4040,
            "bridgeInterest": 7272,
            "bridgeFees": 1616,
            "totalProjectCost": 149102,
            "cashIn": 68301,
            "gdv": 182070,
            "refinanceLtv": 0.75,
            "refinanceAmount": 136553,
            "cashOut": 55752,
            "capitalStuck": 12549,
            "pullOutPct": 82
          },
          "worst": {
            "purchasePrice": 119000,
            "refurb": 23233,
            "purchaseCosts": 4165,
            "bridgeInterest": 7497,
            "bridgeFees": 1666,
            "totalProjectCost": 155561,
            "cashIn": 72261,
            "gdv": 167504,
            "refinanceLtv": 0.75,
            "refinanceAmount": 125628,
            "cashOut": 42328,
            "capitalStuck": 29933,
            "pullOutPct": 59
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 113050,
            "refurb": 19084,
            "purchaseCosts": 3957,
            "totalProjectCost": 136091,
            "cashIn": 136091,
            "gdv": 196636,
            "refinanceLtv": 0.75,
            "refinanceAmount": 147477,
            "cashOut": 136091,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 115430,
            "refurb": 20744,
            "purchaseCosts": 4040,
            "totalProjectCost": 140214,
            "cashIn": 140214,
            "gdv": 182070,
            "refinanceLtv": 0.75,
            "refinanceAmount": 136553,
            "cashOut": 136553,
            "capitalStuck": 3661,
            "pullOutPct": 97
          },
          "worst": {
            "purchasePrice": 119000,
            "refurb": 23233,
            "purchaseCosts": 4165,
            "totalProjectCost": 146398,
            "cashIn": 146398,
            "gdv": 167504,
            "refinanceLtv": 0.75,
            "refinanceAmount": 125628,
            "cashOut": 125628,
            "capitalStuck": 20770,
            "pullOutPct": 86
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 12549
      },
      "income": {
        "airbnb75th": 2624,
        "councilLeaseLhaPct": 83,
        "councilLeaseMonthly": 888,
        "hybridMonthly": 1582,
        "lhaWeekly": 247,
        "notes": "Airbnb 75th percentile for 5-bed in M13. Council lease modelled at 83% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 13,
        "priceReductions": 0,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 6,
        "ofstedRating": "Requires Improvement",
        "transportScore": 6,
        "greenSpaceScore": 8,
        "dealQualityScore": 10,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-008",
    "address": "48 Stockport Road, Levenshulme",
    "postcode": "M19 3OH",
    "city": "manchester",
    "area": "M19",
    "price": 116000,
    "sqft": 1165,
    "beds": 4,
    "baths": 1,
    "propertyType": "End-terrace",
    "photos": [
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba36295?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-8",
    "description": "4-bed end-terrace in Levenshulme / Burnage with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.43794,
      "lng": -2.18089
    },
    "tenure": "leasehold",
    "targetBeds": 5,
    "gdv": 161240,
    "capitalStuck": 31805,
    "monthlyIncome": 1496,
    "quality": "marginal",
    "capitalTag": "jv_recommended",
    "cashInBase": 73971,
    "createdAt": "2026-08-18",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 1165,
        "ageCategory": "1945-1980",
        "leaseYearsRemaining": 83
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 161240,
        "sampleSize": 5,
        "gdvRealistic": 161240,
        "gdvStretch": 174139,
        "gdvConservative": 148341,
        "comps": [
          {
            "address": "74 Moston Lane",
            "postcode": "M19 4NK",
            "price": 165444,
            "beds": 5,
            "sqft": 1123,
            "soldDate": "2025-07-15",
            "distanceMiles": 0.19
          },
          {
            "address": "39 Ashton Old Road",
            "postcode": "M19 8FP",
            "price": 145110,
            "beds": 5,
            "sqft": 1230,
            "soldDate": "2025-04-15",
            "distanceMiles": 0.64
          },
          {
            "address": "88 Ashton Old Road",
            "postcode": "M19 1TX",
            "price": 164103,
            "beds": 5,
            "sqft": 1266,
            "soldDate": "2025-07-09",
            "distanceMiles": 0.56
          },
          {
            "address": "103 Barlow Road",
            "postcode": "M19 1WQ",
            "price": 175261,
            "beds": 5,
            "sqft": 1109,
            "soldDate": "2025-05-05",
            "distanceMiles": 0.39
          },
          {
            "address": "67 Plymouth Grove",
            "postcode": "M19 2RC",
            "price": 167243,
            "beds": 5,
            "sqft": 1219,
            "soldDate": "2025-10-18",
            "distanceMiles": 0.63
          }
        ]
      },
      "refurb": {
        "kitchen": 5732,
        "bathrooms": 2210,
        "flooring": 1803,
        "paint": 662,
        "electrics": 1484,
        "boiler": 2539,
        "roof": 2206,
        "damp": 1063,
        "bedroomConversion": 4210,
        "saFinish": 2102,
        "contingencyPct": 15,
        "contingencyAmount": 3602,
        "total": 27613
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 110200,
            "refurb": 25404,
            "purchaseCosts": 3857,
            "bridgeInterest": 6943,
            "bridgeFees": 1543,
            "totalProjectCost": 147947,
            "cashIn": 70807,
            "gdv": 174139,
            "refinanceLtv": 0.75,
            "refinanceAmount": 130604,
            "cashOut": 53464,
            "capitalStuck": 17343,
            "pullOutPct": 76
          },
          "base": {
            "purchasePrice": 112520,
            "refurb": 27613,
            "purchaseCosts": 3938,
            "bridgeInterest": 7089,
            "bridgeFees": 1575,
            "totalProjectCost": 152735,
            "cashIn": 73971,
            "gdv": 161240,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120930,
            "cashOut": 42166,
            "capitalStuck": 31805,
            "pullOutPct": 57
          },
          "worst": {
            "purchasePrice": 116000,
            "refurb": 30927,
            "purchaseCosts": 4060,
            "bridgeInterest": 7308,
            "bridgeFees": 1624,
            "totalProjectCost": 159919,
            "cashIn": 78719,
            "gdv": 148341,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111256,
            "cashOut": 30056,
            "capitalStuck": 48663,
            "pullOutPct": 38
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 110200,
            "refurb": 25404,
            "purchaseCosts": 3857,
            "totalProjectCost": 139461,
            "cashIn": 139461,
            "gdv": 174139,
            "refinanceLtv": 0.75,
            "refinanceAmount": 130604,
            "cashOut": 130604,
            "capitalStuck": 8857,
            "pullOutPct": 94
          },
          "base": {
            "purchasePrice": 112520,
            "refurb": 27613,
            "purchaseCosts": 3938,
            "totalProjectCost": 144071,
            "cashIn": 144071,
            "gdv": 161240,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120930,
            "cashOut": 120930,
            "capitalStuck": 23141,
            "pullOutPct": 84
          },
          "worst": {
            "purchasePrice": 116000,
            "refurb": 30927,
            "purchaseCosts": 4060,
            "totalProjectCost": 150987,
            "cashIn": 150987,
            "gdv": 148341,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111256,
            "cashOut": 111256,
            "capitalStuck": 39731,
            "pullOutPct": 74
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 31805
      },
      "income": {
        "airbnb75th": 2391,
        "councilLeaseLhaPct": 85,
        "councilLeaseMonthly": 899,
        "hybridMonthly": 1496,
        "lhaWeekly": 244,
        "notes": "Airbnb 75th percentile for 5-bed in M19. Council lease modelled at 85% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 2,
        "flags": [
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 142,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 6,
        "ofstedRating": "Outstanding",
        "transportScore": 9,
        "greenSpaceScore": 8,
        "dealQualityScore": 6,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-009",
    "address": "108 Cheetham Hill Road, Clayton",
    "postcode": "M11 1RP",
    "city": "manchester",
    "area": "M11",
    "price": 156000,
    "sqft": 1169,
    "beds": 4,
    "baths": 2,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-9",
    "description": "4-bed terraced in Clayton / Openshaw with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.47553,
      "lng": -2.1818
    },
    "tenure": "leasehold",
    "targetBeds": 5,
    "gdv": 198120,
    "capitalStuck": 72948,
    "monthlyIncome": 1918,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 115614,
    "createdAt": "2026-01-13",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 1169,
        "ageCategory": "post-1980",
        "leaseYearsRemaining": 92
      },
      "conversion": {
        "score": 4,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 198120,
        "sampleSize": 7,
        "gdvRealistic": 198120,
        "gdvStretch": 213970,
        "gdvConservative": 182270,
        "comps": [
          {
            "address": "87 Stockport Road",
            "postcode": "M11 5BL",
            "price": 189330,
            "beds": 5,
            "sqft": 1226,
            "soldDate": "2025-11-22",
            "distanceMiles": 0.36
          },
          {
            "address": "96 Moston Lane",
            "postcode": "M11 4MZ",
            "price": 206751,
            "beds": 5,
            "sqft": 1280,
            "soldDate": "2025-06-06",
            "distanceMiles": 0.57
          },
          {
            "address": "139 Mauldeth Road",
            "postcode": "M11 4CT",
            "price": 186461,
            "beds": 5,
            "sqft": 1299,
            "soldDate": "2025-12-26",
            "distanceMiles": 0.29
          },
          {
            "address": "103 Rochdale Road",
            "postcode": "M11 3IT",
            "price": 174317,
            "beds": 5,
            "sqft": 1206,
            "soldDate": "2025-08-09",
            "distanceMiles": 0.13
          },
          {
            "address": "46 Rochdale Road",
            "postcode": "M11 8XD",
            "price": 215040,
            "beds": 5,
            "sqft": 1269,
            "soldDate": "2025-09-26",
            "distanceMiles": 0.25
          },
          {
            "address": "16 Cheetham Hill Road",
            "postcode": "M11 3JP",
            "price": 189233,
            "beds": 5,
            "sqft": 1098,
            "soldDate": "2025-04-12",
            "distanceMiles": 0.17
          },
          {
            "address": "24 Claremont Road",
            "postcode": "M11 9FN",
            "price": 204015,
            "beds": 5,
            "sqft": 1285,
            "soldDate": "2025-08-27",
            "distanceMiles": 0.09
          }
        ]
      },
      "refurb": {
        "kitchen": 11493,
        "bathrooms": 6658,
        "flooring": 4456,
        "paint": 1840,
        "electrics": 2150,
        "boiler": 2412,
        "roof": 5769,
        "damp": 42,
        "bedroomConversion": 6664,
        "saFinish": 4839,
        "contingencyPct": 15,
        "contingencyAmount": 6948,
        "total": 53271
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 148200,
            "refurb": 49009,
            "purchaseCosts": 5187,
            "bridgeInterest": 9337,
            "bridgeFees": 2075,
            "totalProjectCost": 213808,
            "cashIn": 110068,
            "gdv": 213970,
            "refinanceLtv": 0.75,
            "refinanceAmount": 160478,
            "cashOut": 56738,
            "capitalStuck": 53330,
            "pullOutPct": 52
          },
          "base": {
            "purchasePrice": 151320,
            "refurb": 53271,
            "purchaseCosts": 5296,
            "bridgeInterest": 9533,
            "bridgeFees": 2118,
            "totalProjectCost": 221538,
            "cashIn": 115614,
            "gdv": 198120,
            "refinanceLtv": 0.75,
            "refinanceAmount": 148590,
            "cashOut": 42666,
            "capitalStuck": 72948,
            "pullOutPct": 37
          },
          "worst": {
            "purchasePrice": 156000,
            "refurb": 59664,
            "purchaseCosts": 5460,
            "bridgeInterest": 9828,
            "bridgeFees": 2184,
            "totalProjectCost": 233136,
            "cashIn": 123936,
            "gdv": 182270,
            "refinanceLtv": 0.75,
            "refinanceAmount": 136703,
            "cashOut": 27503,
            "capitalStuck": 96433,
            "pullOutPct": 22
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 148200,
            "refurb": 49009,
            "purchaseCosts": 5187,
            "totalProjectCost": 202396,
            "cashIn": 202396,
            "gdv": 213970,
            "refinanceLtv": 0.75,
            "refinanceAmount": 160478,
            "cashOut": 160478,
            "capitalStuck": 41918,
            "pullOutPct": 79
          },
          "base": {
            "purchasePrice": 151320,
            "refurb": 53271,
            "purchaseCosts": 5296,
            "totalProjectCost": 209887,
            "cashIn": 209887,
            "gdv": 198120,
            "refinanceLtv": 0.75,
            "refinanceAmount": 148590,
            "cashOut": 148590,
            "capitalStuck": 61297,
            "pullOutPct": 71
          },
          "worst": {
            "purchasePrice": 156000,
            "refurb": 59664,
            "purchaseCosts": 5460,
            "totalProjectCost": 221124,
            "cashIn": 221124,
            "gdv": 182270,
            "refinanceLtv": 0.75,
            "refinanceAmount": 136703,
            "cashOut": 136703,
            "capitalStuck": 84421,
            "pullOutPct": 62
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 72948
      },
      "income": {
        "airbnb75th": 3524,
        "councilLeaseLhaPct": 88,
        "councilLeaseMonthly": 847,
        "hybridMonthly": 1918,
        "lhaWeekly": 222,
        "notes": "Airbnb 75th percentile for 5-bed in M11. Council lease modelled at 88% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 56,
        "priceReductions": 0,
        "auction": true,
        "distressedKeywords": [
          "auction"
        ],
        "crimeScore": 8,
        "ofstedRating": "N/A",
        "transportScore": 5,
        "greenSpaceScore": 6,
        "dealQualityScore": 6,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-010",
    "address": "120 Claremont Road, Cheetham",
    "postcode": "M8 1MV",
    "city": "manchester",
    "area": "M8",
    "price": 108000,
    "sqft": 1165,
    "beds": 3,
    "baths": 2,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-10",
    "description": "3-bed terraced in Cheetham / Crumpsall with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.49905,
      "lng": -2.24156
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 174960,
    "capitalStuck": 10863,
    "monthlyIncome": 1887,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 68751,
    "createdAt": "2026-01-14",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 1165,
        "ageCategory": "1945-1980"
      },
      "conversion": {
        "score": 9,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 174960,
        "sampleSize": 5,
        "gdvRealistic": 174960,
        "gdvStretch": 188957,
        "gdvConservative": 160963,
        "comps": [
          {
            "address": "114 Barlow Road",
            "postcode": "M8 6EJ",
            "price": 156510,
            "beds": 4,
            "sqft": 1141,
            "soldDate": "2025-03-08",
            "distanceMiles": 0.28
          },
          {
            "address": "61 Moston Lane",
            "postcode": "M8 6GZ",
            "price": 180363,
            "beds": 4,
            "sqft": 1306,
            "soldDate": "2025-10-08",
            "distanceMiles": 0.27
          },
          {
            "address": "89 Slade Lane",
            "postcode": "M8 3CS",
            "price": 190204,
            "beds": 4,
            "sqft": 1272,
            "soldDate": "2025-04-06",
            "distanceMiles": 0.79
          },
          {
            "address": "34 Moston Lane",
            "postcode": "M8 7FS",
            "price": 153732,
            "beds": 4,
            "sqft": 1112,
            "soldDate": "2025-03-04",
            "distanceMiles": 0.78
          },
          {
            "address": "33 Slade Lane",
            "postcode": "M8 3PD",
            "price": 179969,
            "beds": 4,
            "sqft": 1195,
            "soldDate": "2025-01-02",
            "distanceMiles": 0.66
          }
        ]
      },
      "refurb": {
        "kitchen": 4866,
        "bathrooms": 2715,
        "flooring": 1827,
        "paint": 588,
        "electrics": 2415,
        "boiler": 1633,
        "roof": 2384,
        "damp": 698,
        "bedroomConversion": 2763,
        "saFinish": 2363,
        "contingencyPct": 15,
        "contingencyAmount": 3338,
        "total": 25589
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 102600,
            "refurb": 23542,
            "purchaseCosts": 3591,
            "bridgeInterest": 6464,
            "bridgeFees": 1436,
            "totalProjectCost": 137633,
            "cashIn": 65813,
            "gdv": 188957,
            "refinanceLtv": 0.75,
            "refinanceAmount": 141718,
            "cashOut": 69898,
            "capitalStuck": 0,
            "pullOutPct": 106
          },
          "base": {
            "purchasePrice": 104760,
            "refurb": 25589,
            "purchaseCosts": 3667,
            "bridgeInterest": 6600,
            "bridgeFees": 1467,
            "totalProjectCost": 142083,
            "cashIn": 68751,
            "gdv": 174960,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131220,
            "cashOut": 57888,
            "capitalStuck": 10863,
            "pullOutPct": 84
          },
          "worst": {
            "purchasePrice": 108000,
            "refurb": 28660,
            "purchaseCosts": 3780,
            "bridgeInterest": 6804,
            "bridgeFees": 1512,
            "totalProjectCost": 148756,
            "cashIn": 73156,
            "gdv": 160963,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120722,
            "cashOut": 45122,
            "capitalStuck": 28034,
            "pullOutPct": 62
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 102600,
            "refurb": 23542,
            "purchaseCosts": 3591,
            "totalProjectCost": 129733,
            "cashIn": 129733,
            "gdv": 188957,
            "refinanceLtv": 0.75,
            "refinanceAmount": 141718,
            "cashOut": 129733,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 104760,
            "refurb": 25589,
            "purchaseCosts": 3667,
            "totalProjectCost": 134016,
            "cashIn": 134016,
            "gdv": 174960,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131220,
            "cashOut": 131220,
            "capitalStuck": 2796,
            "pullOutPct": 98
          },
          "worst": {
            "purchasePrice": 108000,
            "refurb": 28660,
            "purchaseCosts": 3780,
            "totalProjectCost": 140440,
            "cashIn": 140440,
            "gdv": 160963,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120722,
            "cashOut": 120722,
            "capitalStuck": 19718,
            "pullOutPct": 86
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 10863
      },
      "income": {
        "airbnb75th": 3257,
        "councilLeaseLhaPct": 86,
        "councilLeaseMonthly": 973,
        "hybridMonthly": 1887,
        "lhaWeekly": 261,
        "notes": "Airbnb 75th percentile for 4-bed in M8. Council lease modelled at 86% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction",
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 85,
        "priceReductions": 0,
        "auction": true,
        "distressedKeywords": [
          "auction"
        ],
        "crimeScore": 3,
        "ofstedRating": "Good",
        "transportScore": 9,
        "greenSpaceScore": 4,
        "dealQualityScore": 10,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-011",
    "address": "106 Wilmslow Road, Fallowfield",
    "postcode": "M14 9EF",
    "city": "manchester",
    "area": "M14",
    "price": 119000,
    "sqft": 963,
    "beds": 2,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1580587771525-78b9dba36295?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-11",
    "description": "2-bed semi-detached in Fallowfield / Rusholme with strong potential to reconfigure to 3 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.43886,
      "lng": -2.22251
    },
    "tenure": "freehold",
    "targetBeds": 3,
    "gdv": 168980,
    "capitalStuck": 28327,
    "monthlyIncome": 1637,
    "quality": "good",
    "capitalTag": "jv_recommended",
    "cashInBase": 74261,
    "createdAt": "2026-03-12",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 963,
        "ageCategory": "1919-1945"
      },
      "conversion": {
        "score": 7,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Only one reception currently",
          "May need partition fire-rating"
        ],
        "currentBeds": 2,
        "targetBeds": 3,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 168980,
        "sampleSize": 7,
        "gdvRealistic": 168980,
        "gdvStretch": 182498,
        "gdvConservative": 155462,
        "comps": [
          {
            "address": "35 Dickenson Road",
            "postcode": "M14 6FU",
            "price": 178207,
            "beds": 3,
            "sqft": 936,
            "soldDate": "2025-12-23",
            "distanceMiles": 0.48
          },
          {
            "address": "10 Dickenson Road",
            "postcode": "M14 9CG",
            "price": 176883,
            "beds": 3,
            "sqft": 1107,
            "soldDate": "2025-03-27",
            "distanceMiles": 0.4
          },
          {
            "address": "117 Hyde Road",
            "postcode": "M14 6TM",
            "price": 151853,
            "beds": 3,
            "sqft": 1009,
            "soldDate": "2025-06-12",
            "distanceMiles": 0.24
          },
          {
            "address": "112 Moston Lane",
            "postcode": "M14 9GC",
            "price": 174365,
            "beds": 3,
            "sqft": 1080,
            "soldDate": "2025-09-21",
            "distanceMiles": 0.55
          },
          {
            "address": "38 Cheetham Hill Road",
            "postcode": "M14 9YU",
            "price": 178884,
            "beds": 3,
            "sqft": 929,
            "soldDate": "2025-02-22",
            "distanceMiles": 0.23
          },
          {
            "address": "55 Claremont Road",
            "postcode": "M14 3TY",
            "price": 158586,
            "beds": 3,
            "sqft": 865,
            "soldDate": "2025-04-15",
            "distanceMiles": 0.59
          },
          {
            "address": "17 Slade Lane",
            "postcode": "M14 5BO",
            "price": 176525,
            "beds": 3,
            "sqft": 986,
            "soldDate": "2025-11-28",
            "distanceMiles": 0.35
          }
        ]
      },
      "refurb": {
        "kitchen": 4935,
        "bathrooms": 3068,
        "flooring": 1898,
        "paint": 1006,
        "electrics": 2503,
        "boiler": 486,
        "roof": 1711,
        "damp": 1657,
        "bedroomConversion": 4678,
        "saFinish": 1279,
        "contingencyPct": 15,
        "contingencyAmount": 3483,
        "total": 26704
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 113050,
            "refurb": 24568,
            "purchaseCosts": 3957,
            "bridgeInterest": 7122,
            "bridgeFees": 1583,
            "totalProjectCost": 150280,
            "cashIn": 71145,
            "gdv": 182498,
            "refinanceLtv": 0.75,
            "refinanceAmount": 136874,
            "cashOut": 57739,
            "capitalStuck": 13406,
            "pullOutPct": 81
          },
          "base": {
            "purchasePrice": 115430,
            "refurb": 26704,
            "purchaseCosts": 4040,
            "bridgeInterest": 7272,
            "bridgeFees": 1616,
            "totalProjectCost": 155062,
            "cashIn": 74261,
            "gdv": 168980,
            "refinanceLtv": 0.75,
            "refinanceAmount": 126735,
            "cashOut": 45934,
            "capitalStuck": 28327,
            "pullOutPct": 62
          },
          "worst": {
            "purchasePrice": 119000,
            "refurb": 29908,
            "purchaseCosts": 4165,
            "bridgeInterest": 7497,
            "bridgeFees": 1666,
            "totalProjectCost": 162236,
            "cashIn": 78936,
            "gdv": 155462,
            "refinanceLtv": 0.75,
            "refinanceAmount": 116597,
            "cashOut": 33297,
            "capitalStuck": 45639,
            "pullOutPct": 42
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 113050,
            "refurb": 24568,
            "purchaseCosts": 3957,
            "totalProjectCost": 141575,
            "cashIn": 141575,
            "gdv": 182498,
            "refinanceLtv": 0.75,
            "refinanceAmount": 136874,
            "cashOut": 136874,
            "capitalStuck": 4701,
            "pullOutPct": 97
          },
          "base": {
            "purchasePrice": 115430,
            "refurb": 26704,
            "purchaseCosts": 4040,
            "totalProjectCost": 146174,
            "cashIn": 146174,
            "gdv": 168980,
            "refinanceLtv": 0.75,
            "refinanceAmount": 126735,
            "cashOut": 126735,
            "capitalStuck": 19439,
            "pullOutPct": 87
          },
          "worst": {
            "purchasePrice": 119000,
            "refurb": 29908,
            "purchaseCosts": 4165,
            "totalProjectCost": 153073,
            "cashIn": 153073,
            "gdv": 155462,
            "refinanceLtv": 0.75,
            "refinanceAmount": 116597,
            "cashOut": 116597,
            "capitalStuck": 36476,
            "pullOutPct": 76
          }
        },
        "quality": "good",
        "capitalStuckBase": 28327
      },
      "income": {
        "airbnb75th": 3005,
        "councilLeaseLhaPct": 90,
        "councilLeaseMonthly": 725,
        "hybridMonthly": 1637,
        "lhaWeekly": 186,
        "notes": "Airbnb 75th percentile for 3-bed in M14. Council lease modelled at 90% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction"
        ]
      },
      "risk": {
        "daysOnMarket": 43,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 5,
        "ofstedRating": "Requires Improvement",
        "transportScore": 6,
        "greenSpaceScore": 5,
        "dealQualityScore": 6,
        "reasoning": "Solid numbers with acceptable capital left in; watch refurb overruns and local licensing."
      }
    }
  },
  {
    "id": "deal-012",
    "address": "75 Mill Street, Anfield",
    "postcode": "L4 1KI",
    "city": "liverpool",
    "area": "L4",
    "price": 119000,
    "sqft": 704,
    "beds": 3,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-12",
    "description": "3-bed terraced in Anfield / Walton with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.4428,
      "lng": -2.97808
    },
    "tenure": "leasehold",
    "targetBeds": 4,
    "gdv": 140420,
    "capitalStuck": 67545,
    "monthlyIncome": 1210,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 92059,
    "createdAt": "2026-04-05",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": false,
        "sqft": 704,
        "ageCategory": "pre-1919",
        "leaseYearsRemaining": 73
      },
      "conversion": {
        "score": 5,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 140420,
        "sampleSize": 7,
        "gdvRealistic": 140420,
        "gdvStretch": 151654,
        "gdvConservative": 129186,
        "comps": [
          {
            "address": "48 Priory Road",
            "postcode": "L4 9PP",
            "price": 136153,
            "beds": 4,
            "sqft": 756,
            "soldDate": "2025-11-26",
            "distanceMiles": 0.29
          },
          {
            "address": "18 Breck Road",
            "postcode": "L4 6DO",
            "price": 143738,
            "beds": 4,
            "sqft": 740,
            "soldDate": "2025-09-26",
            "distanceMiles": 0.19
          },
          {
            "address": "102 Park Road",
            "postcode": "L4 5IN",
            "price": 137487,
            "beds": 4,
            "sqft": 717,
            "soldDate": "2025-11-21",
            "distanceMiles": 0.64
          },
          {
            "address": "50 Prescot Road",
            "postcode": "L4 7RE",
            "price": 146436,
            "beds": 4,
            "sqft": 609,
            "soldDate": "2025-07-22",
            "distanceMiles": 0.07
          },
          {
            "address": "94 Edge Lane",
            "postcode": "L4 6OV",
            "price": 139667,
            "beds": 4,
            "sqft": 849,
            "soldDate": "2025-01-11",
            "distanceMiles": 0.5
          },
          {
            "address": "74 Mill Street",
            "postcode": "L4 7PV",
            "price": 128097,
            "beds": 4,
            "sqft": 623,
            "soldDate": "2025-10-19",
            "distanceMiles": 0.44
          },
          {
            "address": "74 Edge Lane",
            "postcode": "L4 3FI",
            "price": 122940,
            "beds": 4,
            "sqft": 790,
            "soldDate": "2025-03-22",
            "distanceMiles": 0.14
          }
        ]
      },
      "refurb": {
        "kitchen": 8715,
        "bathrooms": 3896,
        "flooring": 4042,
        "paint": 1450,
        "electrics": 4094,
        "boiler": 3528,
        "roof": 1498,
        "damp": 1017,
        "bedroomConversion": 5092,
        "saFinish": 5365,
        "contingencyPct": 15,
        "contingencyAmount": 5805,
        "total": 44502
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 113050,
            "refurb": 40942,
            "purchaseCosts": 3957,
            "bridgeInterest": 7122,
            "bridgeFees": 1583,
            "totalProjectCost": 166654,
            "cashIn": 87519,
            "gdv": 151654,
            "refinanceLtv": 0.75,
            "refinanceAmount": 113741,
            "cashOut": 34606,
            "capitalStuck": 52913,
            "pullOutPct": 40
          },
          "base": {
            "purchasePrice": 115430,
            "refurb": 44502,
            "purchaseCosts": 4040,
            "bridgeInterest": 7272,
            "bridgeFees": 1616,
            "totalProjectCost": 172860,
            "cashIn": 92059,
            "gdv": 140420,
            "refinanceLtv": 0.75,
            "refinanceAmount": 105315,
            "cashOut": 24514,
            "capitalStuck": 67545,
            "pullOutPct": 27
          },
          "worst": {
            "purchasePrice": 119000,
            "refurb": 49842,
            "purchaseCosts": 4165,
            "bridgeInterest": 7497,
            "bridgeFees": 1666,
            "totalProjectCost": 182170,
            "cashIn": 98870,
            "gdv": 129186,
            "refinanceLtv": 0.75,
            "refinanceAmount": 96890,
            "cashOut": 13590,
            "capitalStuck": 85280,
            "pullOutPct": 14
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 113050,
            "refurb": 40942,
            "purchaseCosts": 3957,
            "totalProjectCost": 157949,
            "cashIn": 157949,
            "gdv": 151654,
            "refinanceLtv": 0.75,
            "refinanceAmount": 113741,
            "cashOut": 113741,
            "capitalStuck": 44208,
            "pullOutPct": 72
          },
          "base": {
            "purchasePrice": 115430,
            "refurb": 44502,
            "purchaseCosts": 4040,
            "totalProjectCost": 163972,
            "cashIn": 163972,
            "gdv": 140420,
            "refinanceLtv": 0.75,
            "refinanceAmount": 105315,
            "cashOut": 105315,
            "capitalStuck": 58657,
            "pullOutPct": 64
          },
          "worst": {
            "purchasePrice": 119000,
            "refurb": 49842,
            "purchaseCosts": 4165,
            "totalProjectCost": 173007,
            "cashIn": 173007,
            "gdv": 129186,
            "refinanceLtv": 0.75,
            "refinanceAmount": 96890,
            "cashOut": 96890,
            "capitalStuck": 76117,
            "pullOutPct": 56
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 67545
      },
      "income": {
        "airbnb75th": 1856,
        "councilLeaseLhaPct": 90,
        "councilLeaseMonthly": 780,
        "hybridMonthly": 1210,
        "lhaWeekly": 200,
        "notes": "Airbnb 75th percentile for 4-bed in L4. Council lease modelled at 90% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": false,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 2,
        "flags": [
          "Article 4 direction",
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 72,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [
          "probate"
        ],
        "crimeScore": 6,
        "ofstedRating": "Good",
        "transportScore": 8,
        "greenSpaceScore": 5,
        "dealQualityScore": 3,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-013",
    "address": "128 Breck Road, Everton",
    "postcode": "L5 2XW",
    "city": "liverpool",
    "area": "L5",
    "price": 100000,
    "sqft": 1139,
    "beds": 4,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-13",
    "description": "4-bed semi-detached in Everton / Kirkdale with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.42664,
      "lng": -2.9762
    },
    "tenure": "freehold",
    "targetBeds": 5,
    "gdv": 162000,
    "capitalStuck": 8625,
    "monthlyIncome": 1222,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 62225,
    "createdAt": "2026-07-16",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 1139,
        "ageCategory": "post-1980"
      },
      "conversion": {
        "score": 10,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 162000,
        "sampleSize": 7,
        "gdvRealistic": 162000,
        "gdvStretch": 174960,
        "gdvConservative": 149040,
        "comps": [
          {
            "address": "147 Wavertree Road",
            "postcode": "L5 7IL",
            "price": 152665,
            "beds": 5,
            "sqft": 1066,
            "soldDate": "2025-07-17",
            "distanceMiles": 0.01
          },
          {
            "address": "131 Aigburth Road",
            "postcode": "L5 2CR",
            "price": 170052,
            "beds": 5,
            "sqft": 1204,
            "soldDate": "2025-11-20",
            "distanceMiles": 0.66
          },
          {
            "address": "122 Edge Lane",
            "postcode": "L5 3YH",
            "price": 161846,
            "beds": 5,
            "sqft": 1192,
            "soldDate": "2025-04-17",
            "distanceMiles": 0.13
          },
          {
            "address": "77 Smithdown Road",
            "postcode": "L5 9FU",
            "price": 140651,
            "beds": 5,
            "sqft": 1042,
            "soldDate": "2025-03-14",
            "distanceMiles": 0.32
          },
          {
            "address": "108 Upper Parliament Street",
            "postcode": "L5 4DQ",
            "price": 176902,
            "beds": 5,
            "sqft": 1153,
            "soldDate": "2025-07-22",
            "distanceMiles": 0.57
          },
          {
            "address": "31 Lodge Lane",
            "postcode": "L5 2JD",
            "price": 151164,
            "beds": 5,
            "sqft": 1123,
            "soldDate": "2025-07-27",
            "distanceMiles": 0.27
          },
          {
            "address": "64 Lodge Lane",
            "postcode": "L5 1LQ",
            "price": 143704,
            "beds": 5,
            "sqft": 1283,
            "soldDate": "2025-07-18",
            "distanceMiles": 0.64
          }
        ]
      },
      "refurb": {
        "kitchen": 3217,
        "bathrooms": 2190,
        "flooring": 1628,
        "paint": 1023,
        "electrics": 2145,
        "boiler": 1736,
        "roof": 1890,
        "damp": 217,
        "bedroomConversion": 3303,
        "saFinish": 2009,
        "contingencyPct": 15,
        "contingencyAmount": 2904,
        "total": 22261
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 95000,
            "refurb": 20480,
            "purchaseCosts": 3325,
            "bridgeInterest": 5985,
            "bridgeFees": 1330,
            "totalProjectCost": 126120,
            "cashIn": 59620,
            "gdv": 174960,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131220,
            "cashOut": 64720,
            "capitalStuck": 0,
            "pullOutPct": 109
          },
          "base": {
            "purchasePrice": 97000,
            "refurb": 22261,
            "purchaseCosts": 3395,
            "bridgeInterest": 6111,
            "bridgeFees": 1358,
            "totalProjectCost": 130125,
            "cashIn": 62225,
            "gdv": 162000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 121500,
            "cashOut": 53600,
            "capitalStuck": 8625,
            "pullOutPct": 86
          },
          "worst": {
            "purchasePrice": 100000,
            "refurb": 24932,
            "purchaseCosts": 3500,
            "bridgeInterest": 6300,
            "bridgeFees": 1400,
            "totalProjectCost": 136132,
            "cashIn": 66132,
            "gdv": 149040,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111780,
            "cashOut": 41780,
            "capitalStuck": 24352,
            "pullOutPct": 63
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 95000,
            "refurb": 20480,
            "purchaseCosts": 3325,
            "totalProjectCost": 118805,
            "cashIn": 118805,
            "gdv": 174960,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131220,
            "cashOut": 118805,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 97000,
            "refurb": 22261,
            "purchaseCosts": 3395,
            "totalProjectCost": 122656,
            "cashIn": 122656,
            "gdv": 162000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 121500,
            "cashOut": 121500,
            "capitalStuck": 1156,
            "pullOutPct": 99
          },
          "worst": {
            "purchasePrice": 100000,
            "refurb": 24932,
            "purchaseCosts": 3500,
            "totalProjectCost": 128432,
            "cashIn": 128432,
            "gdv": 149040,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111780,
            "cashOut": 111780,
            "capitalStuck": 16652,
            "pullOutPct": 87
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 8625
      },
      "income": {
        "airbnb75th": 2004,
        "councilLeaseLhaPct": 80,
        "councilLeaseMonthly": 700,
        "hybridMonthly": 1222,
        "lhaWeekly": 202,
        "notes": "Airbnb 75th percentile for 5-bed in L5. Council lease modelled at 80% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 147,
        "priceReductions": 2,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 8,
        "ofstedRating": "Good",
        "transportScore": 6,
        "greenSpaceScore": 8,
        "dealQualityScore": 9,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-014",
    "address": "171 Belmont Road, Tuebrook",
    "postcode": "L6 2YX",
    "city": "liverpool",
    "area": "L6",
    "price": 117000,
    "sqft": 969,
    "beds": 2,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-14",
    "description": "2-bed terraced in Tuebrook / Kensington with strong potential to reconfigure to 3 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.41785,
      "lng": -2.95509
    },
    "tenure": "freehold",
    "targetBeds": 3,
    "gdv": 170820,
    "capitalStuck": 21202,
    "monthlyIncome": 1264,
    "quality": "good",
    "capitalTag": "jv_recommended",
    "cashInBase": 69874,
    "createdAt": "2026-05-20",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 969,
        "ageCategory": "1945-1980"
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Only one reception currently"
        ],
        "currentBeds": 2,
        "targetBeds": 3,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 170820,
        "sampleSize": 6,
        "gdvRealistic": 170820,
        "gdvStretch": 184486,
        "gdvConservative": 157154,
        "comps": [
          {
            "address": "70 West Derby Road",
            "postcode": "L6 2AS",
            "price": 146362,
            "beds": 3,
            "sqft": 944,
            "soldDate": "2025-12-09",
            "distanceMiles": 0
          },
          {
            "address": "147 Walton Lane",
            "postcode": "L6 4ZL",
            "price": 150466,
            "beds": 3,
            "sqft": 925,
            "soldDate": "2025-02-27",
            "distanceMiles": 0.34
          },
          {
            "address": "80 Prescot Road",
            "postcode": "L6 1UN",
            "price": 152204,
            "beds": 3,
            "sqft": 1025,
            "soldDate": "2025-03-22",
            "distanceMiles": 0.62
          },
          {
            "address": "29 Edge Lane",
            "postcode": "L6 9CI",
            "price": 150873,
            "beds": 3,
            "sqft": 925,
            "soldDate": "2025-07-28",
            "distanceMiles": 0.07
          },
          {
            "address": "99 Kensington",
            "postcode": "L6 1AZ",
            "price": 162326,
            "beds": 3,
            "sqft": 1107,
            "soldDate": "2025-12-15",
            "distanceMiles": 0.68
          },
          {
            "address": "58 Prescot Road",
            "postcode": "L6 2IR",
            "price": 179879,
            "beds": 3,
            "sqft": 986,
            "soldDate": "2025-04-02",
            "distanceMiles": 0.47
          }
        ]
      },
      "refurb": {
        "kitchen": 3596,
        "bathrooms": 3058,
        "flooring": 1254,
        "paint": 1262,
        "electrics": 2232,
        "boiler": 75,
        "roof": 705,
        "damp": 2378,
        "bedroomConversion": 3343,
        "saFinish": 2198,
        "contingencyPct": 15,
        "contingencyAmount": 3015,
        "total": 23116
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 111150,
            "refurb": 21267,
            "purchaseCosts": 3890,
            "bridgeInterest": 7002,
            "bridgeFees": 1556,
            "totalProjectCost": 144865,
            "cashIn": 67060,
            "gdv": 184486,
            "refinanceLtv": 0.75,
            "refinanceAmount": 138365,
            "cashOut": 60560,
            "capitalStuck": 6500,
            "pullOutPct": 90
          },
          "base": {
            "purchasePrice": 113490,
            "refurb": 23116,
            "purchaseCosts": 3972,
            "bridgeInterest": 7150,
            "bridgeFees": 1589,
            "totalProjectCost": 149317,
            "cashIn": 69874,
            "gdv": 170820,
            "refinanceLtv": 0.75,
            "refinanceAmount": 128115,
            "cashOut": 48672,
            "capitalStuck": 21202,
            "pullOutPct": 70
          },
          "worst": {
            "purchasePrice": 117000,
            "refurb": 25890,
            "purchaseCosts": 4095,
            "bridgeInterest": 7371,
            "bridgeFees": 1638,
            "totalProjectCost": 155994,
            "cashIn": 74094,
            "gdv": 157154,
            "refinanceLtv": 0.75,
            "refinanceAmount": 117866,
            "cashOut": 35966,
            "capitalStuck": 38128,
            "pullOutPct": 49
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 111150,
            "refurb": 21267,
            "purchaseCosts": 3890,
            "totalProjectCost": 136307,
            "cashIn": 136307,
            "gdv": 184486,
            "refinanceLtv": 0.75,
            "refinanceAmount": 138365,
            "cashOut": 136307,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 113490,
            "refurb": 23116,
            "purchaseCosts": 3972,
            "totalProjectCost": 140578,
            "cashIn": 140578,
            "gdv": 170820,
            "refinanceLtv": 0.75,
            "refinanceAmount": 128115,
            "cashOut": 128115,
            "capitalStuck": 12463,
            "pullOutPct": 91
          },
          "worst": {
            "purchasePrice": 117000,
            "refurb": 25890,
            "purchaseCosts": 4095,
            "totalProjectCost": 146985,
            "cashIn": 146985,
            "gdv": 157154,
            "refinanceLtv": 0.75,
            "refinanceAmount": 117866,
            "cashOut": 117866,
            "capitalStuck": 29119,
            "pullOutPct": 80
          }
        },
        "quality": "good",
        "capitalStuckBase": 21202
      },
      "income": {
        "airbnb75th": 2253,
        "councilLeaseLhaPct": 84,
        "councilLeaseMonthly": 604,
        "hybridMonthly": 1264,
        "lhaWeekly": 166,
        "notes": "Airbnb 75th percentile for 3-bed in L6. Council lease modelled at 84% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 96,
        "priceReductions": 2,
        "auction": false,
        "distressedKeywords": [
          "motivated seller",
          "chain-free"
        ],
        "crimeScore": 3,
        "ofstedRating": "Good",
        "transportScore": 7,
        "greenSpaceScore": 5,
        "dealQualityScore": 6,
        "reasoning": "Solid numbers with acceptable capital left in; watch refurb overruns and local licensing."
      }
    }
  },
  {
    "id": "deal-015",
    "address": "98 Priory Road, Edge Hill",
    "postcode": "L7 4XZ",
    "city": "liverpool",
    "area": "L7",
    "price": 127000,
    "sqft": 631,
    "beds": 3,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-15",
    "description": "3-bed semi-detached in Edge Hill / Fairfield with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.39738,
      "lng": -2.94352
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 158750,
    "capitalStuck": 68059,
    "monthlyIncome": 1484,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 100889,
    "createdAt": "2026-03-17",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 631,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 3,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "Tight sqft for +1 bed"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 158750,
        "sampleSize": 5,
        "gdvRealistic": 158750,
        "gdvStretch": 171450,
        "gdvConservative": 146050,
        "comps": [
          {
            "address": "93 Upper Parliament Street",
            "postcode": "L7 9GC",
            "price": 151862,
            "beds": 4,
            "sqft": 655,
            "soldDate": "2025-03-15",
            "distanceMiles": 0.62
          },
          {
            "address": "39 Aigburth Road",
            "postcode": "L7 3LB",
            "price": 153258,
            "beds": 4,
            "sqft": 569,
            "soldDate": "2025-06-28",
            "distanceMiles": 0.71
          },
          {
            "address": "21 Park Road",
            "postcode": "L7 8GZ",
            "price": 166780,
            "beds": 4,
            "sqft": 693,
            "soldDate": "2025-04-06",
            "distanceMiles": 0.41
          },
          {
            "address": "147 Kensington",
            "postcode": "L7 3KX",
            "price": 153176,
            "beds": 4,
            "sqft": 731,
            "soldDate": "2025-01-15",
            "distanceMiles": 0.73
          },
          {
            "address": "113 Mill Street",
            "postcode": "L7 9QO",
            "price": 152818,
            "beds": 4,
            "sqft": 637,
            "soldDate": "2025-09-18",
            "distanceMiles": 0.67
          }
        ]
      },
      "refurb": {
        "kitchen": 8971,
        "bathrooms": 4565,
        "flooring": 5024,
        "paint": 2190,
        "electrics": 3281,
        "boiler": 951,
        "roof": 4153,
        "damp": 318,
        "bedroomConversion": 8625,
        "saFinish": 5516,
        "contingencyPct": 15,
        "contingencyAmount": 6539,
        "total": 50134
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 120650,
            "refurb": 46123,
            "purchaseCosts": 4223,
            "bridgeInterest": 7601,
            "bridgeFees": 1689,
            "totalProjectCost": 180286,
            "cashIn": 95831,
            "gdv": 171450,
            "refinanceLtv": 0.75,
            "refinanceAmount": 128588,
            "cashOut": 44133,
            "capitalStuck": 51698,
            "pullOutPct": 46
          },
          "base": {
            "purchasePrice": 123190,
            "refurb": 50134,
            "purchaseCosts": 4312,
            "bridgeInterest": 7761,
            "bridgeFees": 1725,
            "totalProjectCost": 187122,
            "cashIn": 100889,
            "gdv": 158750,
            "refinanceLtv": 0.75,
            "refinanceAmount": 119063,
            "cashOut": 32830,
            "capitalStuck": 68059,
            "pullOutPct": 33
          },
          "worst": {
            "purchasePrice": 127000,
            "refurb": 56150,
            "purchaseCosts": 4445,
            "bridgeInterest": 8001,
            "bridgeFees": 1778,
            "totalProjectCost": 197374,
            "cashIn": 108474,
            "gdv": 146050,
            "refinanceLtv": 0.75,
            "refinanceAmount": 109538,
            "cashOut": 20638,
            "capitalStuck": 87836,
            "pullOutPct": 19
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 120650,
            "refurb": 46123,
            "purchaseCosts": 4223,
            "totalProjectCost": 170996,
            "cashIn": 170996,
            "gdv": 171450,
            "refinanceLtv": 0.75,
            "refinanceAmount": 128588,
            "cashOut": 128588,
            "capitalStuck": 42408,
            "pullOutPct": 75
          },
          "base": {
            "purchasePrice": 123190,
            "refurb": 50134,
            "purchaseCosts": 4312,
            "totalProjectCost": 177636,
            "cashIn": 177636,
            "gdv": 158750,
            "refinanceLtv": 0.75,
            "refinanceAmount": 119063,
            "cashOut": 119063,
            "capitalStuck": 58573,
            "pullOutPct": 67
          },
          "worst": {
            "purchasePrice": 127000,
            "refurb": 56150,
            "purchaseCosts": 4445,
            "totalProjectCost": 187595,
            "cashIn": 187595,
            "gdv": 146050,
            "refinanceLtv": 0.75,
            "refinanceAmount": 109538,
            "cashOut": 109538,
            "capitalStuck": 78057,
            "pullOutPct": 58
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 68059
      },
      "income": {
        "airbnb75th": 2634,
        "councilLeaseLhaPct": 76,
        "councilLeaseMonthly": 718,
        "hybridMonthly": 1484,
        "lhaWeekly": 218,
        "notes": "Airbnb 75th percentile for 4-bed in L7. Council lease modelled at 76% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": true,
        "additionalHmo": true,
        "conservation": true,
        "floodZone": 1,
        "flags": [
          "Article 4 direction",
          "Selective licensing",
          "Additional HMO licensing",
          "Conservation area"
        ]
      },
      "risk": {
        "daysOnMarket": 96,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [
          "probate",
          "chain-free"
        ],
        "crimeScore": 6,
        "ofstedRating": "Requires Improvement",
        "transportScore": 9,
        "greenSpaceScore": 4,
        "dealQualityScore": 6,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-016",
    "address": "75 Wavertree Road, Toxteth",
    "postcode": "L8 3NK",
    "city": "liverpool",
    "area": "L8",
    "price": 76000,
    "sqft": 941,
    "beds": 3,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-16",
    "description": "3-bed semi-detached in Toxteth / Dingle with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.3827,
      "lng": -2.97818
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 121600,
    "capitalStuck": 13466,
    "monthlyIncome": 1712,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 53062,
    "createdAt": "2026-03-17",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 941,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 7,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 121600,
        "sampleSize": 5,
        "gdvRealistic": 121600,
        "gdvStretch": 131328,
        "gdvConservative": 111872,
        "comps": [
          {
            "address": "134 Aigburth Road",
            "postcode": "L8 5TK",
            "price": 120252,
            "beds": 4,
            "sqft": 1089,
            "soldDate": "2025-04-16",
            "distanceMiles": 0.7
          },
          {
            "address": "52 Priory Road",
            "postcode": "L8 5BM",
            "price": 129045,
            "beds": 4,
            "sqft": 965,
            "soldDate": "2025-11-27",
            "distanceMiles": 0.06
          },
          {
            "address": "114 Aigburth Road",
            "postcode": "L8 3PL",
            "price": 108861,
            "beds": 4,
            "sqft": 1038,
            "soldDate": "2025-07-22",
            "distanceMiles": 0.38
          },
          {
            "address": "147 Park Road",
            "postcode": "L8 3WJ",
            "price": 118696,
            "beds": 4,
            "sqft": 903,
            "soldDate": "2025-11-23",
            "distanceMiles": 0.31
          },
          {
            "address": "145 Mill Street",
            "postcode": "L8 7FH",
            "price": 126191,
            "beds": 4,
            "sqft": 850,
            "soldDate": "2025-04-19",
            "distanceMiles": 0.69
          }
        ]
      },
      "refurb": {
        "kitchen": 4533,
        "bathrooms": 2455,
        "flooring": 1350,
        "paint": 1285,
        "electrics": 1260,
        "boiler": 502,
        "roof": 2014,
        "damp": 1224,
        "bedroomConversion": 3078,
        "saFinish": 2030,
        "contingencyPct": 15,
        "contingencyAmount": 2960,
        "total": 22690
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 72200,
            "refurb": 20875,
            "purchaseCosts": 2527,
            "bridgeInterest": 4549,
            "bridgeFees": 1011,
            "totalProjectCost": 101162,
            "cashIn": 50622,
            "gdv": 131328,
            "refinanceLtv": 0.75,
            "refinanceAmount": 98496,
            "cashOut": 47956,
            "capitalStuck": 2666,
            "pullOutPct": 95
          },
          "base": {
            "purchasePrice": 73720,
            "refurb": 22690,
            "purchaseCosts": 2580,
            "bridgeInterest": 4644,
            "bridgeFees": 1032,
            "totalProjectCost": 104666,
            "cashIn": 53062,
            "gdv": 121600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 91200,
            "cashOut": 39596,
            "capitalStuck": 13466,
            "pullOutPct": 75
          },
          "worst": {
            "purchasePrice": 76000,
            "refurb": 25413,
            "purchaseCosts": 2660,
            "bridgeInterest": 4788,
            "bridgeFees": 1064,
            "totalProjectCost": 109925,
            "cashIn": 56725,
            "gdv": 111872,
            "refinanceLtv": 0.75,
            "refinanceAmount": 83904,
            "cashOut": 30704,
            "capitalStuck": 26021,
            "pullOutPct": 54
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 72200,
            "refurb": 20875,
            "purchaseCosts": 2527,
            "totalProjectCost": 95602,
            "cashIn": 95602,
            "gdv": 131328,
            "refinanceLtv": 0.75,
            "refinanceAmount": 98496,
            "cashOut": 95602,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 73720,
            "refurb": 22690,
            "purchaseCosts": 2580,
            "totalProjectCost": 98990,
            "cashIn": 98990,
            "gdv": 121600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 91200,
            "cashOut": 91200,
            "capitalStuck": 7790,
            "pullOutPct": 92
          },
          "worst": {
            "purchasePrice": 76000,
            "refurb": 25413,
            "purchaseCosts": 2660,
            "totalProjectCost": 104073,
            "cashIn": 104073,
            "gdv": 111872,
            "refinanceLtv": 0.75,
            "refinanceAmount": 83904,
            "cashOut": 83904,
            "capitalStuck": 20169,
            "pullOutPct": 81
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 13466
      },
      "income": {
        "airbnb75th": 3195,
        "councilLeaseLhaPct": 86,
        "councilLeaseMonthly": 723,
        "hybridMonthly": 1712,
        "lhaWeekly": 194,
        "notes": "Airbnb 75th percentile for 4-bed in L8. Council lease modelled at 86% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": true,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction",
          "Selective licensing",
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 30,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [
          "probate"
        ],
        "crimeScore": 8,
        "ofstedRating": "Outstanding",
        "transportScore": 7,
        "greenSpaceScore": 8,
        "dealQualityScore": 10,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-017",
    "address": "106 West Derby Road, Wavertree",
    "postcode": "L15 7LV",
    "city": "liverpool",
    "area": "L15",
    "price": 96000,
    "sqft": 782,
    "beds": 2,
    "baths": 1,
    "propertyType": "End-terrace",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-17",
    "description": "2-bed terraced in Wavertree / Picton with strong potential to reconfigure to 3 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.39229,
      "lng": -2.92472
    },
    "tenure": "freehold",
    "targetBeds": 3,
    "gdv": 140160,
    "capitalStuck": 27196,
    "monthlyIncome": 1310,
    "quality": "good",
    "capitalTag": "jv_recommended",
    "cashInBase": 67132,
    "createdAt": "2026-02-27",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 782,
        "ageCategory": "1919-1945"
      },
      "conversion": {
        "score": 6,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Only one reception currently"
        ],
        "currentBeds": 2,
        "targetBeds": 3,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 140160,
        "sampleSize": 7,
        "gdvRealistic": 140160,
        "gdvStretch": 151373,
        "gdvConservative": 128947,
        "comps": [
          {
            "address": "23 Aigburth Road",
            "postcode": "L15 8DI",
            "price": 136877,
            "beds": 3,
            "sqft": 817,
            "soldDate": "2025-02-16",
            "distanceMiles": 0.61
          },
          {
            "address": "82 Aigburth Road",
            "postcode": "L15 6OD",
            "price": 146540,
            "beds": 3,
            "sqft": 799,
            "soldDate": "2025-01-22",
            "distanceMiles": 0.13
          },
          {
            "address": "45 Walton Lane",
            "postcode": "L15 7QH",
            "price": 140583,
            "beds": 3,
            "sqft": 689,
            "soldDate": "2025-08-08",
            "distanceMiles": 0.03
          },
          {
            "address": "87 Mill Street",
            "postcode": "L15 1XP",
            "price": 136633,
            "beds": 3,
            "sqft": 792,
            "soldDate": "2025-03-23",
            "distanceMiles": 0.17
          },
          {
            "address": "114 Lodge Lane",
            "postcode": "L15 9RR",
            "price": 129412,
            "beds": 3,
            "sqft": 722,
            "soldDate": "2025-06-06",
            "distanceMiles": 0.74
          },
          {
            "address": "106 Priory Road",
            "postcode": "L15 2VL",
            "price": 151888,
            "beds": 3,
            "sqft": 758,
            "soldDate": "2025-12-03",
            "distanceMiles": 0.47
          },
          {
            "address": "52 Park Road",
            "postcode": "L15 1FX",
            "price": 149317,
            "beds": 3,
            "sqft": 805,
            "soldDate": "2025-01-06",
            "distanceMiles": 0.57
          }
        ]
      },
      "refurb": {
        "kitchen": 3809,
        "bathrooms": 3757,
        "flooring": 2207,
        "paint": 1515,
        "electrics": 2558,
        "boiler": 751,
        "roof": 2843,
        "damp": 2047,
        "bedroomConversion": 3667,
        "saFinish": 1860,
        "contingencyPct": 15,
        "contingencyAmount": 3752,
        "total": 28766
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 91200,
            "refurb": 26465,
            "purchaseCosts": 3192,
            "bridgeInterest": 5746,
            "bridgeFees": 1277,
            "totalProjectCost": 127880,
            "cashIn": 64040,
            "gdv": 151373,
            "refinanceLtv": 0.75,
            "refinanceAmount": 113530,
            "cashOut": 49690,
            "capitalStuck": 14350,
            "pullOutPct": 78
          },
          "base": {
            "purchasePrice": 93120,
            "refurb": 28766,
            "purchaseCosts": 3259,
            "bridgeInterest": 5867,
            "bridgeFees": 1304,
            "totalProjectCost": 132316,
            "cashIn": 67132,
            "gdv": 140160,
            "refinanceLtv": 0.75,
            "refinanceAmount": 105120,
            "cashOut": 39936,
            "capitalStuck": 27196,
            "pullOutPct": 59
          },
          "worst": {
            "purchasePrice": 96000,
            "refurb": 32218,
            "purchaseCosts": 3360,
            "bridgeInterest": 6048,
            "bridgeFees": 1344,
            "totalProjectCost": 138970,
            "cashIn": 71770,
            "gdv": 128947,
            "refinanceLtv": 0.75,
            "refinanceAmount": 96710,
            "cashOut": 29510,
            "capitalStuck": 42260,
            "pullOutPct": 41
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 91200,
            "refurb": 26465,
            "purchaseCosts": 3192,
            "totalProjectCost": 120857,
            "cashIn": 120857,
            "gdv": 151373,
            "refinanceLtv": 0.75,
            "refinanceAmount": 113530,
            "cashOut": 113530,
            "capitalStuck": 7327,
            "pullOutPct": 94
          },
          "base": {
            "purchasePrice": 93120,
            "refurb": 28766,
            "purchaseCosts": 3259,
            "totalProjectCost": 125145,
            "cashIn": 125145,
            "gdv": 140160,
            "refinanceLtv": 0.75,
            "refinanceAmount": 105120,
            "cashOut": 105120,
            "capitalStuck": 20025,
            "pullOutPct": 84
          },
          "worst": {
            "purchasePrice": 96000,
            "refurb": 32218,
            "purchaseCosts": 3360,
            "totalProjectCost": 131578,
            "cashIn": 131578,
            "gdv": 128947,
            "refinanceLtv": 0.75,
            "refinanceAmount": 96710,
            "cashOut": 96710,
            "capitalStuck": 34868,
            "pullOutPct": 74
          }
        },
        "quality": "good",
        "capitalStuckBase": 27196
      },
      "income": {
        "airbnb75th": 2428,
        "councilLeaseLhaPct": 88,
        "councilLeaseMonthly": 564,
        "hybridMonthly": 1310,
        "lhaWeekly": 148,
        "notes": "Airbnb 75th percentile for 3-bed in L15. Council lease modelled at 88% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction"
        ]
      },
      "risk": {
        "daysOnMarket": 138,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 4,
        "ofstedRating": "Requires Improvement",
        "transportScore": 4,
        "greenSpaceScore": 6,
        "dealQualityScore": 7,
        "reasoning": "Solid numbers with acceptable capital left in; watch refurb overruns and local licensing."
      }
    }
  },
  {
    "id": "deal-018",
    "address": "187 Wilmslow Road, Ardwick",
    "postcode": "M13 9QV",
    "city": "manchester",
    "area": "M13",
    "price": 154000,
    "sqft": 748,
    "beds": 3,
    "baths": 2,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-18",
    "description": "3-bed terraced in Ardwick / Longsight with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.46967,
      "lng": -2.21194
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 177100,
    "capitalStuck": 79918,
    "monthlyIncome": 1626,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 108177,
    "createdAt": "2026-01-02",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 748,
        "ageCategory": "post-1980"
      },
      "conversion": {
        "score": 6,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "Tight sqft for +1 bed"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 177100,
        "sampleSize": 7,
        "gdvRealistic": 177100,
        "gdvStretch": 191268,
        "gdvConservative": 162932,
        "comps": [
          {
            "address": "129 Barlow Road",
            "postcode": "M13 8GZ",
            "price": 166276,
            "beds": 4,
            "sqft": 885,
            "soldDate": "2025-09-21",
            "distanceMiles": 0.13
          },
          {
            "address": "36 Moston Lane",
            "postcode": "M13 4IL",
            "price": 152798,
            "beds": 4,
            "sqft": 658,
            "soldDate": "2025-06-07",
            "distanceMiles": 0.44
          },
          {
            "address": "63 Hyde Road",
            "postcode": "M13 9QH",
            "price": 155408,
            "beds": 4,
            "sqft": 830,
            "soldDate": "2025-04-13",
            "distanceMiles": 0.58
          },
          {
            "address": "102 Dickenson Road",
            "postcode": "M13 3MB",
            "price": 161345,
            "beds": 4,
            "sqft": 722,
            "soldDate": "2025-01-06",
            "distanceMiles": 0.75
          },
          {
            "address": "94 Dickenson Road",
            "postcode": "M13 3EW",
            "price": 188484,
            "beds": 4,
            "sqft": 889,
            "soldDate": "2025-10-26",
            "distanceMiles": 0.79
          },
          {
            "address": "89 Plymouth Grove",
            "postcode": "M13 7DB",
            "price": 184852,
            "beds": 4,
            "sqft": 852,
            "soldDate": "2025-12-20",
            "distanceMiles": 0.44
          },
          {
            "address": "108 Slade Lane",
            "postcode": "M13 8OP",
            "price": 150927,
            "beds": 4,
            "sqft": 831,
            "soldDate": "2025-12-12",
            "distanceMiles": 0.59
          }
        ]
      },
      "refurb": {
        "kitchen": 8503,
        "bathrooms": 5638,
        "flooring": 4147,
        "paint": 1947,
        "electrics": 5549,
        "boiler": 3963,
        "roof": 279,
        "damp": 1035,
        "bedroomConversion": 4559,
        "saFinish": 4931,
        "contingencyPct": 15,
        "contingencyAmount": 6082,
        "total": 46633
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 146300,
            "refurb": 42902,
            "purchaseCosts": 5121,
            "bridgeInterest": 9217,
            "bridgeFees": 2048,
            "totalProjectCost": 205588,
            "cashIn": 103178,
            "gdv": 191268,
            "refinanceLtv": 0.75,
            "refinanceAmount": 143451,
            "cashOut": 41041,
            "capitalStuck": 62137,
            "pullOutPct": 40
          },
          "base": {
            "purchasePrice": 149380,
            "refurb": 46633,
            "purchaseCosts": 5228,
            "bridgeInterest": 9411,
            "bridgeFees": 2091,
            "totalProjectCost": 212743,
            "cashIn": 108177,
            "gdv": 177100,
            "refinanceLtv": 0.75,
            "refinanceAmount": 132825,
            "cashOut": 28259,
            "capitalStuck": 79918,
            "pullOutPct": 26
          },
          "worst": {
            "purchasePrice": 154000,
            "refurb": 52229,
            "purchaseCosts": 5390,
            "bridgeInterest": 9702,
            "bridgeFees": 2156,
            "totalProjectCost": 223477,
            "cashIn": 115677,
            "gdv": 162932,
            "refinanceLtv": 0.75,
            "refinanceAmount": 122199,
            "cashOut": 14399,
            "capitalStuck": 101278,
            "pullOutPct": 12
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 146300,
            "refurb": 42902,
            "purchaseCosts": 5121,
            "totalProjectCost": 194323,
            "cashIn": 194323,
            "gdv": 191268,
            "refinanceLtv": 0.75,
            "refinanceAmount": 143451,
            "cashOut": 143451,
            "capitalStuck": 50872,
            "pullOutPct": 74
          },
          "base": {
            "purchasePrice": 149380,
            "refurb": 46633,
            "purchaseCosts": 5228,
            "totalProjectCost": 201241,
            "cashIn": 201241,
            "gdv": 177100,
            "refinanceLtv": 0.75,
            "refinanceAmount": 132825,
            "cashOut": 132825,
            "capitalStuck": 68416,
            "pullOutPct": 66
          },
          "worst": {
            "purchasePrice": 154000,
            "refurb": 52229,
            "purchaseCosts": 5390,
            "totalProjectCost": 211619,
            "cashIn": 211619,
            "gdv": 162932,
            "refinanceLtv": 0.75,
            "refinanceAmount": 122199,
            "cashOut": 122199,
            "capitalStuck": 89420,
            "pullOutPct": 58
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 79918
      },
      "income": {
        "airbnb75th": 2850,
        "councilLeaseLhaPct": 85,
        "councilLeaseMonthly": 810,
        "hybridMonthly": 1626,
        "lhaWeekly": 220,
        "notes": "Airbnb 75th percentile for 4-bed in M13. Council lease modelled at 85% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction",
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 97,
        "priceReductions": 0,
        "auction": false,
        "distressedKeywords": [
          "chain-free"
        ],
        "crimeScore": 6,
        "ofstedRating": "Good",
        "transportScore": 4,
        "greenSpaceScore": 6,
        "dealQualityScore": 4,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-019",
    "address": "108 Oxford Road, Levenshulme",
    "postcode": "M19 1NL",
    "city": "manchester",
    "area": "M19",
    "price": 83000,
    "sqft": 967,
    "beds": 2,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-19",
    "description": "2-bed semi-detached in Levenshulme / Burnage with strong potential to reconfigure to 3 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.45215,
      "lng": -2.18709
    },
    "tenure": "freehold",
    "targetBeds": 3,
    "gdv": 135290,
    "capitalStuck": 8551,
    "monthlyIncome": 1340,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 53662,
    "createdAt": "2026-08-24",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 967,
        "ageCategory": "1919-1945"
      },
      "conversion": {
        "score": 7,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Only one reception currently",
          "May need partition fire-rating"
        ],
        "currentBeds": 2,
        "targetBeds": 3,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 135290,
        "sampleSize": 6,
        "gdvRealistic": 135290,
        "gdvStretch": 146113,
        "gdvConservative": 124467,
        "comps": [
          {
            "address": "56 Ashton Old Road",
            "postcode": "M19 3PN",
            "price": 144566,
            "beds": 3,
            "sqft": 1117,
            "soldDate": "2025-11-12",
            "distanceMiles": 0.38
          },
          {
            "address": "128 Wilmslow Road",
            "postcode": "M19 6RI",
            "price": 141638,
            "beds": 3,
            "sqft": 1077,
            "soldDate": "2025-09-21",
            "distanceMiles": 0.07
          },
          {
            "address": "31 Claremont Road",
            "postcode": "M19 6UE",
            "price": 124137,
            "beds": 3,
            "sqft": 966,
            "soldDate": "2025-08-03",
            "distanceMiles": 0.09
          },
          {
            "address": "132 Stockport Road",
            "postcode": "M19 1BF",
            "price": 119085,
            "beds": 3,
            "sqft": 1112,
            "soldDate": "2025-03-13",
            "distanceMiles": 0.05
          },
          {
            "address": "55 Rochdale Road",
            "postcode": "M19 9HR",
            "price": 126292,
            "beds": 3,
            "sqft": 1068,
            "soldDate": "2025-01-10",
            "distanceMiles": 0.46
          },
          {
            "address": "101 Cheetham Hill Road",
            "postcode": "M19 4HP",
            "price": 129370,
            "beds": 3,
            "sqft": 969,
            "soldDate": "2025-07-10",
            "distanceMiles": 0.67
          }
        ]
      },
      "refurb": {
        "kitchen": 2729,
        "bathrooms": 3332,
        "flooring": 1689,
        "paint": 842,
        "electrics": 2141,
        "boiler": 520,
        "roof": 1038,
        "damp": 813,
        "bedroomConversion": 3210,
        "saFinish": 1505,
        "contingencyPct": 15,
        "contingencyAmount": 2673,
        "total": 20492
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 78850,
            "refurb": 18853,
            "purchaseCosts": 2760,
            "bridgeInterest": 4968,
            "bridgeFees": 1104,
            "totalProjectCost": 106535,
            "cashIn": 51340,
            "gdv": 146113,
            "refinanceLtv": 0.75,
            "refinanceAmount": 109585,
            "cashOut": 54390,
            "capitalStuck": 0,
            "pullOutPct": 106
          },
          "base": {
            "purchasePrice": 80510,
            "refurb": 20492,
            "purchaseCosts": 2818,
            "bridgeInterest": 5072,
            "bridgeFees": 1127,
            "totalProjectCost": 110019,
            "cashIn": 53662,
            "gdv": 135290,
            "refinanceLtv": 0.75,
            "refinanceAmount": 101468,
            "cashOut": 45111,
            "capitalStuck": 8551,
            "pullOutPct": 84
          },
          "worst": {
            "purchasePrice": 83000,
            "refurb": 22951,
            "purchaseCosts": 2905,
            "bridgeInterest": 5229,
            "bridgeFees": 1162,
            "totalProjectCost": 115247,
            "cashIn": 57147,
            "gdv": 124467,
            "refinanceLtv": 0.75,
            "refinanceAmount": 93350,
            "cashOut": 35250,
            "capitalStuck": 21897,
            "pullOutPct": 62
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 78850,
            "refurb": 18853,
            "purchaseCosts": 2760,
            "totalProjectCost": 100463,
            "cashIn": 100463,
            "gdv": 146113,
            "refinanceLtv": 0.75,
            "refinanceAmount": 109585,
            "cashOut": 100463,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 80510,
            "refurb": 20492,
            "purchaseCosts": 2818,
            "totalProjectCost": 103820,
            "cashIn": 103820,
            "gdv": 135290,
            "refinanceLtv": 0.75,
            "refinanceAmount": 101468,
            "cashOut": 101468,
            "capitalStuck": 2352,
            "pullOutPct": 98
          },
          "worst": {
            "purchasePrice": 83000,
            "refurb": 22951,
            "purchaseCosts": 2905,
            "totalProjectCost": 108856,
            "cashIn": 108856,
            "gdv": 124467,
            "refinanceLtv": 0.75,
            "refinanceAmount": 93350,
            "cashOut": 93350,
            "capitalStuck": 15506,
            "pullOutPct": 86
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 8551
      },
      "income": {
        "airbnb75th": 2424,
        "councilLeaseLhaPct": 77,
        "councilLeaseMonthly": 617,
        "hybridMonthly": 1340,
        "lhaWeekly": 185,
        "notes": "Airbnb 75th percentile for 3-bed in M19. Council lease modelled at 77% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 9,
        "priceReductions": 0,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 4,
        "ofstedRating": "N/A",
        "transportScore": 8,
        "greenSpaceScore": 9,
        "dealQualityScore": 10,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-020",
    "address": "148 Cheetham Hill Road, Clayton",
    "postcode": "M11 1FD",
    "city": "manchester",
    "area": "M11",
    "price": 100000,
    "sqft": 1041,
    "beds": 2,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba36295?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-20",
    "description": "2-bed terraced in Clayton / Openshaw with strong potential to reconfigure to 3 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.48261,
      "lng": -2.1668
    },
    "tenure": "leasehold",
    "targetBeds": 3,
    "gdv": 148000,
    "capitalStuck": 23497,
    "monthlyIncome": 1282,
    "quality": "good",
    "capitalTag": "jv_recommended",
    "cashInBase": 66597,
    "createdAt": "2026-09-04",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 1041,
        "ageCategory": "1945-1980",
        "leaseYearsRemaining": 85
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Only one reception currently",
          "May need partition fire-rating"
        ],
        "currentBeds": 2,
        "targetBeds": 3,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 148000,
        "sampleSize": 4,
        "gdvRealistic": 148000,
        "gdvStretch": 159840,
        "gdvConservative": 136160,
        "comps": [
          {
            "address": "31 Oxford Road",
            "postcode": "M11 1AA",
            "price": 135245,
            "beds": 3,
            "sqft": 1024,
            "soldDate": "2025-10-07",
            "distanceMiles": 0.68
          },
          {
            "address": "131 Burnage Lane",
            "postcode": "M11 7YT",
            "price": 150320,
            "beds": 3,
            "sqft": 953,
            "soldDate": "2025-05-05",
            "distanceMiles": 0.14
          },
          {
            "address": "41 Mauldeth Road",
            "postcode": "M11 8NP",
            "price": 159392,
            "beds": 3,
            "sqft": 1041,
            "soldDate": "2025-09-24",
            "distanceMiles": 0.33
          },
          {
            "address": "68 Barlow Road",
            "postcode": "M11 2KT",
            "price": 144934,
            "beds": 3,
            "sqft": 952,
            "soldDate": "2025-03-05",
            "distanceMiles": 0.79
          }
        ]
      },
      "refurb": {
        "kitchen": 6655,
        "bathrooms": 1809,
        "flooring": 1228,
        "paint": 912,
        "electrics": 2706,
        "boiler": 346,
        "roof": 2734,
        "damp": 1301,
        "bedroomConversion": 2611,
        "saFinish": 2857,
        "contingencyPct": 15,
        "contingencyAmount": 3474,
        "total": 26633
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 95000,
            "refurb": 24502,
            "purchaseCosts": 3325,
            "bridgeInterest": 5985,
            "bridgeFees": 1330,
            "totalProjectCost": 130142,
            "cashIn": 63642,
            "gdv": 159840,
            "refinanceLtv": 0.75,
            "refinanceAmount": 119880,
            "cashOut": 53380,
            "capitalStuck": 10262,
            "pullOutPct": 84
          },
          "base": {
            "purchasePrice": 97000,
            "refurb": 26633,
            "purchaseCosts": 3395,
            "bridgeInterest": 6111,
            "bridgeFees": 1358,
            "totalProjectCost": 134497,
            "cashIn": 66597,
            "gdv": 148000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111000,
            "cashOut": 43100,
            "capitalStuck": 23497,
            "pullOutPct": 65
          },
          "worst": {
            "purchasePrice": 100000,
            "refurb": 29829,
            "purchaseCosts": 3500,
            "bridgeInterest": 6300,
            "bridgeFees": 1400,
            "totalProjectCost": 141029,
            "cashIn": 71029,
            "gdv": 136160,
            "refinanceLtv": 0.75,
            "refinanceAmount": 102120,
            "cashOut": 32120,
            "capitalStuck": 38909,
            "pullOutPct": 45
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 95000,
            "refurb": 24502,
            "purchaseCosts": 3325,
            "totalProjectCost": 122827,
            "cashIn": 122827,
            "gdv": 159840,
            "refinanceLtv": 0.75,
            "refinanceAmount": 119880,
            "cashOut": 119880,
            "capitalStuck": 2947,
            "pullOutPct": 98
          },
          "base": {
            "purchasePrice": 97000,
            "refurb": 26633,
            "purchaseCosts": 3395,
            "totalProjectCost": 127028,
            "cashIn": 127028,
            "gdv": 148000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111000,
            "cashOut": 111000,
            "capitalStuck": 16028,
            "pullOutPct": 87
          },
          "worst": {
            "purchasePrice": 100000,
            "refurb": 29829,
            "purchaseCosts": 3500,
            "totalProjectCost": 133329,
            "cashIn": 133329,
            "gdv": 136160,
            "refinanceLtv": 0.75,
            "refinanceAmount": 102120,
            "cashOut": 102120,
            "capitalStuck": 31209,
            "pullOutPct": 77
          }
        },
        "quality": "good",
        "capitalStuckBase": 23497
      },
      "income": {
        "airbnb75th": 2168,
        "councilLeaseLhaPct": 75,
        "councilLeaseMonthly": 692,
        "hybridMonthly": 1282,
        "lhaWeekly": 213,
        "notes": "Airbnb 75th percentile for 3-bed in M11. Council lease modelled at 75% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 3,
        "flags": [
          "Flood zone 3"
        ]
      },
      "risk": {
        "daysOnMarket": 64,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 7,
        "ofstedRating": "Good",
        "transportScore": 4,
        "greenSpaceScore": 3,
        "dealQualityScore": 8,
        "reasoning": "Solid numbers with acceptable capital left in; watch refurb overruns and local licensing."
      }
    }
  },
  {
    "id": "deal-021",
    "address": "55 Wilmslow Road, Cheetham",
    "postcode": "M8 4TE",
    "city": "manchester",
    "area": "M8",
    "price": 174000,
    "sqft": 743,
    "beds": 3,
    "baths": 2,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-21",
    "description": "3-bed terraced in Cheetham / Crumpsall with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.50235,
      "lng": -2.23101
    },
    "tenure": "leasehold",
    "targetBeds": 4,
    "gdv": 208800,
    "capitalStuck": 83868,
    "monthlyIncome": 1746,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 122322,
    "createdAt": "2026-04-16",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 743,
        "ageCategory": "1945-1980",
        "leaseYearsRemaining": 106
      },
      "conversion": {
        "score": 3,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 208800,
        "sampleSize": 7,
        "gdvRealistic": 208800,
        "gdvStretch": 225504,
        "gdvConservative": 192096,
        "comps": [
          {
            "address": "15 Barlow Road",
            "postcode": "M8 9UD",
            "price": 198688,
            "beds": 4,
            "sqft": 818,
            "soldDate": "2025-10-26",
            "distanceMiles": 0.1
          },
          {
            "address": "68 Barlow Road",
            "postcode": "M8 6IC",
            "price": 185280,
            "beds": 4,
            "sqft": 715,
            "soldDate": "2025-09-09",
            "distanceMiles": 0.19
          },
          {
            "address": "148 Claremont Road",
            "postcode": "M8 5DJ",
            "price": 184201,
            "beds": 4,
            "sqft": 846,
            "soldDate": "2025-03-06",
            "distanceMiles": 0.64
          },
          {
            "address": "16 Wilmslow Road",
            "postcode": "M8 3SA",
            "price": 226466,
            "beds": 4,
            "sqft": 829,
            "soldDate": "2025-04-11",
            "distanceMiles": 0.01
          },
          {
            "address": "127 Mauldeth Road",
            "postcode": "M8 3CZ",
            "price": 224550,
            "beds": 4,
            "sqft": 864,
            "soldDate": "2025-09-28",
            "distanceMiles": 0.57
          },
          {
            "address": "145 Plymouth Grove",
            "postcode": "M8 2YV",
            "price": 184419,
            "beds": 4,
            "sqft": 803,
            "soldDate": "2025-12-17",
            "distanceMiles": 0.1
          },
          {
            "address": "33 Claremont Road",
            "postcode": "M8 1UZ",
            "price": 195879,
            "beds": 4,
            "sqft": 822,
            "soldDate": "2025-02-08",
            "distanceMiles": 0.23
          }
        ]
      },
      "refurb": {
        "kitchen": 10727,
        "bathrooms": 6654,
        "flooring": 4823,
        "paint": 2350,
        "electrics": 918,
        "boiler": 3198,
        "roof": 6111,
        "damp": 1280,
        "bedroomConversion": 4478,
        "saFinish": 5363,
        "contingencyPct": 15,
        "contingencyAmount": 6885,
        "total": 52785
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 165300,
            "refurb": 48562,
            "purchaseCosts": 5786,
            "bridgeInterest": 10414,
            "bridgeFees": 2314,
            "totalProjectCost": 232376,
            "cashIn": 116666,
            "gdv": 225504,
            "refinanceLtv": 0.75,
            "refinanceAmount": 169128,
            "cashOut": 53418,
            "capitalStuck": 63248,
            "pullOutPct": 46
          },
          "base": {
            "purchasePrice": 168780,
            "refurb": 52785,
            "purchaseCosts": 5907,
            "bridgeInterest": 10633,
            "bridgeFees": 2363,
            "totalProjectCost": 240468,
            "cashIn": 122322,
            "gdv": 208800,
            "refinanceLtv": 0.75,
            "refinanceAmount": 156600,
            "cashOut": 38454,
            "capitalStuck": 83868,
            "pullOutPct": 31
          },
          "worst": {
            "purchasePrice": 174000,
            "refurb": 59119,
            "purchaseCosts": 6090,
            "bridgeInterest": 10962,
            "bridgeFees": 2436,
            "totalProjectCost": 252607,
            "cashIn": 130807,
            "gdv": 192096,
            "refinanceLtv": 0.75,
            "refinanceAmount": 144072,
            "cashOut": 22272,
            "capitalStuck": 108535,
            "pullOutPct": 17
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 165300,
            "refurb": 48562,
            "purchaseCosts": 5786,
            "totalProjectCost": 219648,
            "cashIn": 219648,
            "gdv": 225504,
            "refinanceLtv": 0.75,
            "refinanceAmount": 169128,
            "cashOut": 169128,
            "capitalStuck": 50520,
            "pullOutPct": 77
          },
          "base": {
            "purchasePrice": 168780,
            "refurb": 52785,
            "purchaseCosts": 5907,
            "totalProjectCost": 227472,
            "cashIn": 227472,
            "gdv": 208800,
            "refinanceLtv": 0.75,
            "refinanceAmount": 156600,
            "cashOut": 156600,
            "capitalStuck": 70872,
            "pullOutPct": 69
          },
          "worst": {
            "purchasePrice": 174000,
            "refurb": 59119,
            "purchaseCosts": 6090,
            "totalProjectCost": 239209,
            "cashIn": 239209,
            "gdv": 192096,
            "refinanceLtv": 0.75,
            "refinanceAmount": 144072,
            "cashOut": 144072,
            "capitalStuck": 95137,
            "pullOutPct": 60
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 83868
      },
      "income": {
        "airbnb75th": 3099,
        "councilLeaseLhaPct": 84,
        "councilLeaseMonthly": 844,
        "hybridMonthly": 1746,
        "lhaWeekly": 232,
        "notes": "Airbnb 75th percentile for 4-bed in M8. Council lease modelled at 84% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 2,
        "flags": [
          "Article 4 direction",
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 155,
        "priceReductions": 0,
        "auction": false,
        "distressedKeywords": [
          "chain-free"
        ],
        "crimeScore": 7,
        "ofstedRating": "N/A",
        "transportScore": 4,
        "greenSpaceScore": 9,
        "dealQualityScore": 4,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-022",
    "address": "78 Ashton Old Road, Fallowfield",
    "postcode": "M14 8HE",
    "city": "manchester",
    "area": "M14",
    "price": 120000,
    "sqft": 837,
    "beds": 3,
    "baths": 2,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-22",
    "description": "3-bed end-terrace in Fallowfield / Rusholme with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.45042,
      "lng": -2.2226
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 189600,
    "capitalStuck": 7790,
    "monthlyIncome": 2023,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 68510,
    "createdAt": "2026-09-03",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 837,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 189600,
        "sampleSize": 4,
        "gdvRealistic": 189600,
        "gdvStretch": 204768,
        "gdvConservative": 174432,
        "comps": [
          {
            "address": "107 Ashton Old Road",
            "postcode": "M14 1CB",
            "price": 176808,
            "beds": 4,
            "sqft": 833,
            "soldDate": "2025-05-07",
            "distanceMiles": 0.69
          },
          {
            "address": "29 Ashton Old Road",
            "postcode": "M14 3KL",
            "price": 183098,
            "beds": 4,
            "sqft": 977,
            "soldDate": "2025-03-19",
            "distanceMiles": 0.67
          },
          {
            "address": "38 Oxford Road",
            "postcode": "M14 8YL",
            "price": 174481,
            "beds": 4,
            "sqft": 866,
            "soldDate": "2025-01-28",
            "distanceMiles": 0.5
          },
          {
            "address": "127 Stockport Road",
            "postcode": "M14 9GX",
            "price": 161942,
            "beds": 4,
            "sqft": 804,
            "soldDate": "2025-09-16",
            "distanceMiles": 0.08
          }
        ]
      },
      "refurb": {
        "kitchen": 4454,
        "bathrooms": 2924,
        "flooring": 930,
        "paint": 763,
        "electrics": 1073,
        "boiler": 648,
        "roof": 2120,
        "damp": 1687,
        "bedroomConversion": 2148,
        "saFinish": 1126,
        "contingencyPct": 15,
        "contingencyAmount": 2681,
        "total": 20553
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 114000,
            "refurb": 18909,
            "purchaseCosts": 3990,
            "bridgeInterest": 7182,
            "bridgeFees": 1596,
            "totalProjectCost": 145677,
            "cashIn": 65877,
            "gdv": 204768,
            "refinanceLtv": 0.75,
            "refinanceAmount": 153576,
            "cashOut": 73776,
            "capitalStuck": 0,
            "pullOutPct": 112
          },
          "base": {
            "purchasePrice": 116400,
            "refurb": 20553,
            "purchaseCosts": 4074,
            "bridgeInterest": 7333,
            "bridgeFees": 1630,
            "totalProjectCost": 149990,
            "cashIn": 68510,
            "gdv": 189600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 142200,
            "cashOut": 60720,
            "capitalStuck": 7790,
            "pullOutPct": 89
          },
          "worst": {
            "purchasePrice": 120000,
            "refurb": 23019,
            "purchaseCosts": 4200,
            "bridgeInterest": 7560,
            "bridgeFees": 1680,
            "totalProjectCost": 156459,
            "cashIn": 72459,
            "gdv": 174432,
            "refinanceLtv": 0.75,
            "refinanceAmount": 130824,
            "cashOut": 46824,
            "capitalStuck": 25635,
            "pullOutPct": 65
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 114000,
            "refurb": 18909,
            "purchaseCosts": 3990,
            "totalProjectCost": 136899,
            "cashIn": 136899,
            "gdv": 204768,
            "refinanceLtv": 0.75,
            "refinanceAmount": 153576,
            "cashOut": 136899,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 116400,
            "refurb": 20553,
            "purchaseCosts": 4074,
            "totalProjectCost": 141027,
            "cashIn": 141027,
            "gdv": 189600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 142200,
            "cashOut": 141027,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "worst": {
            "purchasePrice": 120000,
            "refurb": 23019,
            "purchaseCosts": 4200,
            "totalProjectCost": 147219,
            "cashIn": 147219,
            "gdv": 174432,
            "refinanceLtv": 0.75,
            "refinanceAmount": 130824,
            "cashOut": 130824,
            "capitalStuck": 16395,
            "pullOutPct": 89
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 7790
      },
      "income": {
        "airbnb75th": 3537,
        "councilLeaseLhaPct": 87,
        "councilLeaseMonthly": 1014,
        "hybridMonthly": 2023,
        "lhaWeekly": 269,
        "notes": "Airbnb 75th percentile for 4-bed in M14. Council lease modelled at 87% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 2,
        "flags": [
          "Selective licensing",
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 43,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 7,
        "ofstedRating": "Outstanding",
        "transportScore": 6,
        "greenSpaceScore": 8,
        "dealQualityScore": 9,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-023",
    "address": "96 Park Road, Anfield",
    "postcode": "L4 6UA",
    "city": "liverpool",
    "area": "L4",
    "price": 125000,
    "sqft": 756,
    "beds": 3,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1580587771525-78b9dba36295?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-23",
    "description": "3-bed semi-detached in Anfield / Walton with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.42493,
      "lng": -2.97425
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 175000,
    "capitalStuck": 32330,
    "monthlyIncome": 1409,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 78705,
    "createdAt": "2026-08-27",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 756,
        "ageCategory": "1945-1980"
      },
      "conversion": {
        "score": 5,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 175000,
        "sampleSize": 5,
        "gdvRealistic": 175000,
        "gdvStretch": 189000,
        "gdvConservative": 161000,
        "comps": [
          {
            "address": "38 Aigburth Road",
            "postcode": "L4 8TL",
            "price": 183759,
            "beds": 4,
            "sqft": 775,
            "soldDate": "2025-10-19",
            "distanceMiles": 0.26
          },
          {
            "address": "91 Breck Road",
            "postcode": "L4 7RA",
            "price": 162455,
            "beds": 4,
            "sqft": 741,
            "soldDate": "2025-01-23",
            "distanceMiles": 0.38
          },
          {
            "address": "19 Park Road",
            "postcode": "L4 6DE",
            "price": 149176,
            "beds": 4,
            "sqft": 905,
            "soldDate": "2025-08-05",
            "distanceMiles": 0.19
          },
          {
            "address": "40 Smithdown Road",
            "postcode": "L4 8JY",
            "price": 187359,
            "beds": 4,
            "sqft": 748,
            "soldDate": "2025-11-19",
            "distanceMiles": 0.44
          },
          {
            "address": "134 Mill Street",
            "postcode": "L4 5IA",
            "price": 186629,
            "beds": 4,
            "sqft": 807,
            "soldDate": "2025-01-06",
            "distanceMiles": 0.41
          }
        ]
      },
      "refurb": {
        "kitchen": 6160,
        "bathrooms": 3725,
        "flooring": 1259,
        "paint": 1554,
        "electrics": 1671,
        "boiler": 943,
        "roof": 609,
        "damp": 2290,
        "bedroomConversion": 5316,
        "saFinish": 1472,
        "contingencyPct": 15,
        "contingencyAmount": 3750,
        "total": 28749
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 118750,
            "refurb": 26449,
            "purchaseCosts": 4156,
            "bridgeInterest": 7481,
            "bridgeFees": 1663,
            "totalProjectCost": 158499,
            "cashIn": 75374,
            "gdv": 189000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 141750,
            "cashOut": 58625,
            "capitalStuck": 16749,
            "pullOutPct": 78
          },
          "base": {
            "purchasePrice": 121250,
            "refurb": 28749,
            "purchaseCosts": 4244,
            "bridgeInterest": 7639,
            "bridgeFees": 1698,
            "totalProjectCost": 163580,
            "cashIn": 78705,
            "gdv": 175000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131250,
            "cashOut": 46375,
            "capitalStuck": 32330,
            "pullOutPct": 59
          },
          "worst": {
            "purchasePrice": 125000,
            "refurb": 32199,
            "purchaseCosts": 4375,
            "bridgeInterest": 7875,
            "bridgeFees": 1750,
            "totalProjectCost": 171199,
            "cashIn": 83699,
            "gdv": 161000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120750,
            "cashOut": 33250,
            "capitalStuck": 50449,
            "pullOutPct": 40
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 118750,
            "refurb": 26449,
            "purchaseCosts": 4156,
            "totalProjectCost": 149355,
            "cashIn": 149355,
            "gdv": 189000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 141750,
            "cashOut": 141750,
            "capitalStuck": 7605,
            "pullOutPct": 95
          },
          "base": {
            "purchasePrice": 121250,
            "refurb": 28749,
            "purchaseCosts": 4244,
            "totalProjectCost": 154243,
            "cashIn": 154243,
            "gdv": 175000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131250,
            "cashOut": 131250,
            "capitalStuck": 22993,
            "pullOutPct": 85
          },
          "worst": {
            "purchasePrice": 125000,
            "refurb": 32199,
            "purchaseCosts": 4375,
            "totalProjectCost": 161574,
            "cashIn": 161574,
            "gdv": 161000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120750,
            "cashOut": 120750,
            "capitalStuck": 40824,
            "pullOutPct": 75
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 32330
      },
      "income": {
        "airbnb75th": 2545,
        "councilLeaseLhaPct": 78,
        "councilLeaseMonthly": 652,
        "hybridMonthly": 1409,
        "lhaWeekly": 193,
        "notes": "Airbnb 75th percentile for 4-bed in L4. Council lease modelled at 78% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 110,
        "priceReductions": 2,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 3,
        "ofstedRating": "Outstanding",
        "transportScore": 6,
        "greenSpaceScore": 9,
        "dealQualityScore": 4,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-024",
    "address": "167 Edge Lane, Everton",
    "postcode": "L5 2HO",
    "city": "liverpool",
    "area": "L5",
    "price": 153000,
    "sqft": 824,
    "beds": 3,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-24",
    "description": "3-bed terraced in Everton / Kirkdale with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.42057,
      "lng": -2.97556
    },
    "tenure": "leasehold",
    "targetBeds": 4,
    "gdv": 179010,
    "capitalStuck": 80574,
    "monthlyIncome": 1457,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 110945,
    "createdAt": "2026-08-21",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 824,
        "ageCategory": "1945-1980",
        "leaseYearsRemaining": 100
      },
      "conversion": {
        "score": 5,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 179010,
        "sampleSize": 7,
        "gdvRealistic": 179010,
        "gdvStretch": 193331,
        "gdvConservative": 164689,
        "comps": [
          {
            "address": "87 Belmont Road",
            "postcode": "L5 8ZE",
            "price": 182124,
            "beds": 4,
            "sqft": 896,
            "soldDate": "2025-09-08",
            "distanceMiles": 0.3
          },
          {
            "address": "76 Priory Road",
            "postcode": "L5 9FC",
            "price": 169192,
            "beds": 4,
            "sqft": 870,
            "soldDate": "2025-08-23",
            "distanceMiles": 0.16
          },
          {
            "address": "66 West Derby Road",
            "postcode": "L5 9SQ",
            "price": 184407,
            "beds": 4,
            "sqft": 738,
            "soldDate": "2025-10-01",
            "distanceMiles": 0.44
          },
          {
            "address": "63 Prescot Road",
            "postcode": "L5 7DZ",
            "price": 170864,
            "beds": 4,
            "sqft": 912,
            "soldDate": "2025-08-21",
            "distanceMiles": 0.5
          },
          {
            "address": "66 Upper Parliament Street",
            "postcode": "L5 2LB",
            "price": 186646,
            "beds": 4,
            "sqft": 860,
            "soldDate": "2025-06-27",
            "distanceMiles": 0.71
          },
          {
            "address": "126 West Derby Road",
            "postcode": "L5 4UA",
            "price": 178118,
            "beds": 4,
            "sqft": 776,
            "soldDate": "2025-11-03",
            "distanceMiles": 0.07
          },
          {
            "address": "137 Belmont Road",
            "postcode": "L5 1LB",
            "price": 191853,
            "beds": 4,
            "sqft": 925,
            "soldDate": "2025-02-26",
            "distanceMiles": 0.02
          }
        ]
      },
      "refurb": {
        "kitchen": 9795,
        "bathrooms": 7754,
        "flooring": 5158,
        "paint": 1385,
        "electrics": 4120,
        "boiler": 1253,
        "roof": 209,
        "damp": 716,
        "bedroomConversion": 8768,
        "saFinish": 4145,
        "contingencyPct": 15,
        "contingencyAmount": 6496,
        "total": 49800
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 145350,
            "refurb": 45816,
            "purchaseCosts": 5087,
            "bridgeInterest": 9157,
            "bridgeFees": 2035,
            "totalProjectCost": 207445,
            "cashIn": 105700,
            "gdv": 193331,
            "refinanceLtv": 0.75,
            "refinanceAmount": 144998,
            "cashOut": 43253,
            "capitalStuck": 62447,
            "pullOutPct": 41
          },
          "base": {
            "purchasePrice": 148410,
            "refurb": 49800,
            "purchaseCosts": 5194,
            "bridgeInterest": 9350,
            "bridgeFees": 2078,
            "totalProjectCost": 214832,
            "cashIn": 110945,
            "gdv": 179010,
            "refinanceLtv": 0.75,
            "refinanceAmount": 134258,
            "cashOut": 30371,
            "capitalStuck": 80574,
            "pullOutPct": 27
          },
          "worst": {
            "purchasePrice": 153000,
            "refurb": 55776,
            "purchaseCosts": 5355,
            "bridgeInterest": 9639,
            "bridgeFees": 2142,
            "totalProjectCost": 225912,
            "cashIn": 118812,
            "gdv": 164689,
            "refinanceLtv": 0.75,
            "refinanceAmount": 123517,
            "cashOut": 16417,
            "capitalStuck": 102395,
            "pullOutPct": 14
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 145350,
            "refurb": 45816,
            "purchaseCosts": 5087,
            "totalProjectCost": 196253,
            "cashIn": 196253,
            "gdv": 193331,
            "refinanceLtv": 0.75,
            "refinanceAmount": 144998,
            "cashOut": 144998,
            "capitalStuck": 51255,
            "pullOutPct": 74
          },
          "base": {
            "purchasePrice": 148410,
            "refurb": 49800,
            "purchaseCosts": 5194,
            "totalProjectCost": 203404,
            "cashIn": 203404,
            "gdv": 179010,
            "refinanceLtv": 0.75,
            "refinanceAmount": 134258,
            "cashOut": 134258,
            "capitalStuck": 69146,
            "pullOutPct": 66
          },
          "worst": {
            "purchasePrice": 153000,
            "refurb": 55776,
            "purchaseCosts": 5355,
            "totalProjectCost": 214131,
            "cashIn": 214131,
            "gdv": 164689,
            "refinanceLtv": 0.75,
            "refinanceAmount": 123517,
            "cashOut": 123517,
            "capitalStuck": 90614,
            "pullOutPct": 58
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 80574
      },
      "income": {
        "airbnb75th": 2392,
        "councilLeaseLhaPct": 89,
        "councilLeaseMonthly": 833,
        "hybridMonthly": 1457,
        "lhaWeekly": 216,
        "notes": "Airbnb 75th percentile for 4-bed in L5. Council lease modelled at 89% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 166,
        "priceReductions": 3,
        "auction": true,
        "distressedKeywords": [
          "auction"
        ],
        "crimeScore": 6,
        "ofstedRating": "Good",
        "transportScore": 8,
        "greenSpaceScore": 4,
        "dealQualityScore": 4,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-025",
    "address": "58 Smithdown Road, Tuebrook",
    "postcode": "L6 1JS",
    "city": "liverpool",
    "area": "L6",
    "price": 80000,
    "sqft": 972,
    "beds": 3,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-25",
    "description": "3-bed terraced in Tuebrook / Kensington with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.42465,
      "lng": -2.9573
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 130400,
    "capitalStuck": 9805,
    "monthlyIncome": 1334,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 53285,
    "createdAt": "2026-09-03",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 972,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 9,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 130400,
        "sampleSize": 7,
        "gdvRealistic": 130400,
        "gdvStretch": 140832,
        "gdvConservative": 119968,
        "comps": [
          {
            "address": "128 Priory Road",
            "postcode": "L6 6MC",
            "price": 125781,
            "beds": 4,
            "sqft": 1110,
            "soldDate": "2025-12-18",
            "distanceMiles": 0.31
          },
          {
            "address": "132 Edge Lane",
            "postcode": "L6 6WF",
            "price": 132282,
            "beds": 4,
            "sqft": 1069,
            "soldDate": "2025-01-10",
            "distanceMiles": 0.41
          },
          {
            "address": "127 Mill Street",
            "postcode": "L6 4ZN",
            "price": 119066,
            "beds": 4,
            "sqft": 921,
            "soldDate": "2025-11-04",
            "distanceMiles": 0.36
          },
          {
            "address": "141 Walton Lane",
            "postcode": "L6 5DB",
            "price": 133102,
            "beds": 4,
            "sqft": 934,
            "soldDate": "2025-04-28",
            "distanceMiles": 0.33
          },
          {
            "address": "104 Wavertree Road",
            "postcode": "L6 1TM",
            "price": 137432,
            "beds": 4,
            "sqft": 1016,
            "soldDate": "2025-02-09",
            "distanceMiles": 0.5
          },
          {
            "address": "18 Park Road",
            "postcode": "L6 5TA",
            "price": 114680,
            "beds": 4,
            "sqft": 956,
            "soldDate": "2025-06-18",
            "distanceMiles": 0.8
          },
          {
            "address": "146 Wavertree Road",
            "postcode": "L6 6DI",
            "price": 122828,
            "beds": 4,
            "sqft": 886,
            "soldDate": "2025-03-20",
            "distanceMiles": 0.05
          }
        ]
      },
      "refurb": {
        "kitchen": 4490,
        "bathrooms": 2704,
        "flooring": 1570,
        "paint": 530,
        "electrics": 1216,
        "boiler": 1661,
        "roof": 974,
        "damp": 1363,
        "bedroomConversion": 1681,
        "saFinish": 2345,
        "contingencyPct": 15,
        "contingencyAmount": 2780,
        "total": 21314
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 76000,
            "refurb": 19609,
            "purchaseCosts": 2660,
            "bridgeInterest": 4788,
            "bridgeFees": 1064,
            "totalProjectCost": 104121,
            "cashIn": 50921,
            "gdv": 140832,
            "refinanceLtv": 0.75,
            "refinanceAmount": 105624,
            "cashOut": 52424,
            "capitalStuck": 0,
            "pullOutPct": 103
          },
          "base": {
            "purchasePrice": 77600,
            "refurb": 21314,
            "purchaseCosts": 2716,
            "bridgeInterest": 4889,
            "bridgeFees": 1086,
            "totalProjectCost": 107605,
            "cashIn": 53285,
            "gdv": 130400,
            "refinanceLtv": 0.75,
            "refinanceAmount": 97800,
            "cashOut": 43480,
            "capitalStuck": 9805,
            "pullOutPct": 82
          },
          "worst": {
            "purchasePrice": 80000,
            "refurb": 23872,
            "purchaseCosts": 2800,
            "bridgeInterest": 5040,
            "bridgeFees": 1120,
            "totalProjectCost": 112832,
            "cashIn": 56832,
            "gdv": 119968,
            "refinanceLtv": 0.75,
            "refinanceAmount": 89976,
            "cashOut": 33976,
            "capitalStuck": 22856,
            "pullOutPct": 60
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 76000,
            "refurb": 19609,
            "purchaseCosts": 2660,
            "totalProjectCost": 98269,
            "cashIn": 98269,
            "gdv": 140832,
            "refinanceLtv": 0.75,
            "refinanceAmount": 105624,
            "cashOut": 98269,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 77600,
            "refurb": 21314,
            "purchaseCosts": 2716,
            "totalProjectCost": 101630,
            "cashIn": 101630,
            "gdv": 130400,
            "refinanceLtv": 0.75,
            "refinanceAmount": 97800,
            "cashOut": 97800,
            "capitalStuck": 3830,
            "pullOutPct": 96
          },
          "worst": {
            "purchasePrice": 80000,
            "refurb": 23872,
            "purchaseCosts": 2800,
            "totalProjectCost": 106672,
            "cashIn": 106672,
            "gdv": 119968,
            "refinanceLtv": 0.75,
            "refinanceAmount": 89976,
            "cashOut": 89976,
            "capitalStuck": 16696,
            "pullOutPct": 84
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 9805
      },
      "income": {
        "airbnb75th": 2212,
        "councilLeaseLhaPct": 80,
        "councilLeaseMonthly": 749,
        "hybridMonthly": 1334,
        "lhaWeekly": 216,
        "notes": "Airbnb 75th percentile for 4-bed in L6. Council lease modelled at 80% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 2,
        "flags": [
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 71,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 5,
        "ofstedRating": "Good",
        "transportScore": 8,
        "greenSpaceScore": 8,
        "dealQualityScore": 8,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-026",
    "address": "83 West Derby Road, Edge Hill",
    "postcode": "L7 1KQ",
    "city": "liverpool",
    "area": "L7",
    "price": 157000,
    "sqft": 656,
    "beds": 4,
    "baths": 2,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-26",
    "description": "4-bed terraced in Edge Hill / Fairfield with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.40055,
      "lng": -2.95514
    },
    "tenure": "freehold",
    "targetBeds": 5,
    "gdv": 216660,
    "capitalStuck": 32468,
    "monthlyIncome": 1463,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 88360,
    "createdAt": "2026-06-03",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 656,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "Tight sqft for +1 bed"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 216660,
        "sampleSize": 5,
        "gdvRealistic": 216660,
        "gdvStretch": 233993,
        "gdvConservative": 199327,
        "comps": [
          {
            "address": "77 Mill Street",
            "postcode": "L7 5NB",
            "price": 201197,
            "beds": 5,
            "sqft": 779,
            "soldDate": "2025-10-01",
            "distanceMiles": 0.06
          },
          {
            "address": "128 Park Road",
            "postcode": "L7 9JC",
            "price": 185783,
            "beds": 5,
            "sqft": 805,
            "soldDate": "2025-10-19",
            "distanceMiles": 0.63
          },
          {
            "address": "45 Park Road",
            "postcode": "L7 4EE",
            "price": 205726,
            "beds": 5,
            "sqft": 590,
            "soldDate": "2025-06-05",
            "distanceMiles": 0.57
          },
          {
            "address": "147 Breck Road",
            "postcode": "L7 2XV",
            "price": 228463,
            "beds": 5,
            "sqft": 768,
            "soldDate": "2025-02-22",
            "distanceMiles": 0.29
          },
          {
            "address": "99 Smithdown Road",
            "postcode": "L7 8ZW",
            "price": 185688,
            "beds": 5,
            "sqft": 649,
            "soldDate": "2025-06-24",
            "distanceMiles": 0.27
          }
        ]
      },
      "refurb": {
        "kitchen": 3700,
        "bathrooms": 1922,
        "flooring": 1702,
        "paint": 1368,
        "electrics": 2758,
        "boiler": 2443,
        "roof": 1379,
        "damp": 2329,
        "bedroomConversion": 3210,
        "saFinish": 1465,
        "contingencyPct": 15,
        "contingencyAmount": 3341,
        "total": 25617
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 149150,
            "refurb": 23568,
            "purchaseCosts": 5220,
            "bridgeInterest": 9396,
            "bridgeFees": 2088,
            "totalProjectCost": 189422,
            "cashIn": 85017,
            "gdv": 233993,
            "refinanceLtv": 0.75,
            "refinanceAmount": 175495,
            "cashOut": 71090,
            "capitalStuck": 13927,
            "pullOutPct": 84
          },
          "base": {
            "purchasePrice": 152290,
            "refurb": 25617,
            "purchaseCosts": 5330,
            "bridgeInterest": 9594,
            "bridgeFees": 2132,
            "totalProjectCost": 194963,
            "cashIn": 88360,
            "gdv": 216660,
            "refinanceLtv": 0.75,
            "refinanceAmount": 162495,
            "cashOut": 55892,
            "capitalStuck": 32468,
            "pullOutPct": 63
          },
          "worst": {
            "purchasePrice": 157000,
            "refurb": 28691,
            "purchaseCosts": 5495,
            "bridgeInterest": 9891,
            "bridgeFees": 2198,
            "totalProjectCost": 203275,
            "cashIn": 93375,
            "gdv": 199327,
            "refinanceLtv": 0.75,
            "refinanceAmount": 149495,
            "cashOut": 39595,
            "capitalStuck": 53780,
            "pullOutPct": 42
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 149150,
            "refurb": 23568,
            "purchaseCosts": 5220,
            "totalProjectCost": 177938,
            "cashIn": 177938,
            "gdv": 233993,
            "refinanceLtv": 0.75,
            "refinanceAmount": 175495,
            "cashOut": 175495,
            "capitalStuck": 2443,
            "pullOutPct": 99
          },
          "base": {
            "purchasePrice": 152290,
            "refurb": 25617,
            "purchaseCosts": 5330,
            "totalProjectCost": 183237,
            "cashIn": 183237,
            "gdv": 216660,
            "refinanceLtv": 0.75,
            "refinanceAmount": 162495,
            "cashOut": 162495,
            "capitalStuck": 20742,
            "pullOutPct": 89
          },
          "worst": {
            "purchasePrice": 157000,
            "refurb": 28691,
            "purchaseCosts": 5495,
            "totalProjectCost": 191186,
            "cashIn": 191186,
            "gdv": 199327,
            "refinanceLtv": 0.75,
            "refinanceAmount": 149495,
            "cashOut": 149495,
            "capitalStuck": 41691,
            "pullOutPct": 78
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 32468
      },
      "income": {
        "airbnb75th": 2548,
        "councilLeaseLhaPct": 87,
        "councilLeaseMonthly": 739,
        "hybridMonthly": 1463,
        "lhaWeekly": 196,
        "notes": "Airbnb 75th percentile for 5-bed in L7. Council lease modelled at 87% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": true,
        "floodZone": 1,
        "flags": [
          "Conservation area"
        ]
      },
      "risk": {
        "daysOnMarket": 165,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 5,
        "ofstedRating": "Outstanding",
        "transportScore": 6,
        "greenSpaceScore": 4,
        "dealQualityScore": 6,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-027",
    "address": "37 Smithdown Road, Toxteth",
    "postcode": "L8 7WM",
    "city": "liverpool",
    "area": "L8",
    "price": 163000,
    "sqft": 692,
    "beds": 3,
    "baths": 1,
    "propertyType": "End-terrace",
    "photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-27",
    "description": "3-bed terraced in Toxteth / Dingle with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.38087,
      "lng": -2.958
    },
    "tenure": "leasehold",
    "targetBeds": 4,
    "gdv": 192340,
    "capitalStuck": 84980,
    "monthlyIncome": 1394,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 118558,
    "createdAt": "2026-07-19",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 692,
        "ageCategory": "pre-1919",
        "leaseYearsRemaining": 76
      },
      "conversion": {
        "score": 4,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 192340,
        "sampleSize": 6,
        "gdvRealistic": 192340,
        "gdvStretch": 207727,
        "gdvConservative": 176953,
        "comps": [
          {
            "address": "102 Breck Road",
            "postcode": "L8 5YZ",
            "price": 197540,
            "beds": 4,
            "sqft": 794,
            "soldDate": "2025-07-02",
            "distanceMiles": 0.58
          },
          {
            "address": "110 Kensington",
            "postcode": "L8 6YH",
            "price": 194185,
            "beds": 4,
            "sqft": 607,
            "soldDate": "2025-01-03",
            "distanceMiles": 0.77
          },
          {
            "address": "46 Priory Road",
            "postcode": "L8 1NL",
            "price": 182965,
            "beds": 4,
            "sqft": 594,
            "soldDate": "2025-07-14",
            "distanceMiles": 0.48
          },
          {
            "address": "106 Wavertree Road",
            "postcode": "L8 2HE",
            "price": 200715,
            "beds": 4,
            "sqft": 617,
            "soldDate": "2025-07-15",
            "distanceMiles": 0.56
          },
          {
            "address": "140 Park Road",
            "postcode": "L8 1KZ",
            "price": 199069,
            "beds": 4,
            "sqft": 841,
            "soldDate": "2025-12-22",
            "distanceMiles": 0.43
          },
          {
            "address": "119 Edge Lane",
            "postcode": "L8 3QW",
            "price": 179904,
            "beds": 4,
            "sqft": 811,
            "soldDate": "2025-06-08",
            "distanceMiles": 0.65
          }
        ]
      },
      "refurb": {
        "kitchen": 8282,
        "bathrooms": 4969,
        "flooring": 2957,
        "paint": 3178,
        "electrics": 3100,
        "boiler": 1854,
        "roof": 5229,
        "damp": 2112,
        "bedroomConversion": 8931,
        "saFinish": 5837,
        "contingencyPct": 15,
        "contingencyAmount": 6968,
        "total": 53416
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 154850,
            "refurb": 49143,
            "purchaseCosts": 5420,
            "bridgeInterest": 9756,
            "bridgeFees": 2168,
            "totalProjectCost": 221337,
            "cashIn": 112942,
            "gdv": 207727,
            "refinanceLtv": 0.75,
            "refinanceAmount": 155795,
            "cashOut": 47400,
            "capitalStuck": 65542,
            "pullOutPct": 42
          },
          "base": {
            "purchasePrice": 158110,
            "refurb": 53416,
            "purchaseCosts": 5534,
            "bridgeInterest": 9961,
            "bridgeFees": 2214,
            "totalProjectCost": 229235,
            "cashIn": 118558,
            "gdv": 192340,
            "refinanceLtv": 0.75,
            "refinanceAmount": 144255,
            "cashOut": 33578,
            "capitalStuck": 84980,
            "pullOutPct": 28
          },
          "worst": {
            "purchasePrice": 163000,
            "refurb": 59826,
            "purchaseCosts": 5705,
            "bridgeInterest": 10269,
            "bridgeFees": 2282,
            "totalProjectCost": 241082,
            "cashIn": 126982,
            "gdv": 176953,
            "refinanceLtv": 0.75,
            "refinanceAmount": 132715,
            "cashOut": 18615,
            "capitalStuck": 108367,
            "pullOutPct": 15
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 154850,
            "refurb": 49143,
            "purchaseCosts": 5420,
            "totalProjectCost": 209413,
            "cashIn": 209413,
            "gdv": 207727,
            "refinanceLtv": 0.75,
            "refinanceAmount": 155795,
            "cashOut": 155795,
            "capitalStuck": 53618,
            "pullOutPct": 74
          },
          "base": {
            "purchasePrice": 158110,
            "refurb": 53416,
            "purchaseCosts": 5534,
            "totalProjectCost": 217060,
            "cashIn": 217060,
            "gdv": 192340,
            "refinanceLtv": 0.75,
            "refinanceAmount": 144255,
            "cashOut": 144255,
            "capitalStuck": 72805,
            "pullOutPct": 66
          },
          "worst": {
            "purchasePrice": 163000,
            "refurb": 59826,
            "purchaseCosts": 5705,
            "totalProjectCost": 228531,
            "cashIn": 228531,
            "gdv": 176953,
            "refinanceLtv": 0.75,
            "refinanceAmount": 132715,
            "cashOut": 132715,
            "capitalStuck": 95816,
            "pullOutPct": 58
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 84980
      },
      "income": {
        "airbnb75th": 2371,
        "councilLeaseLhaPct": 79,
        "councilLeaseMonthly": 743,
        "hybridMonthly": 1394,
        "lhaWeekly": 217,
        "notes": "Airbnb 75th percentile for 4-bed in L8. Council lease modelled at 79% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 3,
        "flags": [
          "Selective licensing",
          "Additional HMO licensing",
          "Flood zone 3"
        ]
      },
      "risk": {
        "daysOnMarket": 69,
        "priceReductions": 1,
        "auction": true,
        "distressedKeywords": [
          "auction"
        ],
        "crimeScore": 7,
        "ofstedRating": "Good",
        "transportScore": 4,
        "greenSpaceScore": 4,
        "dealQualityScore": 3,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-028",
    "address": "179 West Derby Road, Wavertree",
    "postcode": "L15 7BT",
    "city": "liverpool",
    "area": "L15",
    "price": 127000,
    "sqft": 899,
    "beds": 3,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-28",
    "description": "3-bed terraced in Wavertree / Picton with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.40397,
      "lng": -2.90882
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 191770,
    "capitalStuck": 11915,
    "monthlyIncome": 1255,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 69510,
    "createdAt": "2026-01-10",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 899,
        "ageCategory": "post-1980"
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 191770,
        "sampleSize": 5,
        "gdvRealistic": 191770,
        "gdvStretch": 207112,
        "gdvConservative": 176428,
        "comps": [
          {
            "address": "44 Smithdown Road",
            "postcode": "L15 8UJ",
            "price": 189642,
            "beds": 4,
            "sqft": 916,
            "soldDate": "2025-05-11",
            "distanceMiles": 0.09
          },
          {
            "address": "137 Mill Street",
            "postcode": "L15 9AB",
            "price": 190419,
            "beds": 4,
            "sqft": 992,
            "soldDate": "2025-01-22",
            "distanceMiles": 0.47
          },
          {
            "address": "103 Belmont Road",
            "postcode": "L15 3JK",
            "price": 165417,
            "beds": 4,
            "sqft": 989,
            "soldDate": "2025-11-05",
            "distanceMiles": 0.18
          },
          {
            "address": "57 Lodge Lane",
            "postcode": "L15 6OL",
            "price": 204754,
            "beds": 4,
            "sqft": 866,
            "soldDate": "2025-07-28",
            "distanceMiles": 0.62
          },
          {
            "address": "109 West Derby Road",
            "postcode": "L15 5EK",
            "price": 169664,
            "beds": 4,
            "sqft": 806,
            "soldDate": "2025-11-06",
            "distanceMiles": 0.11
          }
        ]
      },
      "refurb": {
        "kitchen": 3331,
        "bathrooms": 1526,
        "flooring": 907,
        "paint": 1194,
        "electrics": 427,
        "boiler": 1264,
        "roof": 1915,
        "damp": 1543,
        "bedroomConversion": 2762,
        "saFinish": 1440,
        "contingencyPct": 15,
        "contingencyAmount": 2446,
        "total": 18755
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 120650,
            "refurb": 17255,
            "purchaseCosts": 4223,
            "bridgeInterest": 7601,
            "bridgeFees": 1689,
            "totalProjectCost": 151418,
            "cashIn": 66963,
            "gdv": 207112,
            "refinanceLtv": 0.75,
            "refinanceAmount": 155334,
            "cashOut": 70879,
            "capitalStuck": 0,
            "pullOutPct": 106
          },
          "base": {
            "purchasePrice": 123190,
            "refurb": 18755,
            "purchaseCosts": 4312,
            "bridgeInterest": 7761,
            "bridgeFees": 1725,
            "totalProjectCost": 155743,
            "cashIn": 69510,
            "gdv": 191770,
            "refinanceLtv": 0.75,
            "refinanceAmount": 143828,
            "cashOut": 57595,
            "capitalStuck": 11915,
            "pullOutPct": 83
          },
          "worst": {
            "purchasePrice": 127000,
            "refurb": 21006,
            "purchaseCosts": 4445,
            "bridgeInterest": 8001,
            "bridgeFees": 1778,
            "totalProjectCost": 162230,
            "cashIn": 73330,
            "gdv": 176428,
            "refinanceLtv": 0.75,
            "refinanceAmount": 132321,
            "cashOut": 43421,
            "capitalStuck": 29909,
            "pullOutPct": 59
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 120650,
            "refurb": 17255,
            "purchaseCosts": 4223,
            "totalProjectCost": 142128,
            "cashIn": 142128,
            "gdv": 207112,
            "refinanceLtv": 0.75,
            "refinanceAmount": 155334,
            "cashOut": 142128,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 123190,
            "refurb": 18755,
            "purchaseCosts": 4312,
            "totalProjectCost": 146257,
            "cashIn": 146257,
            "gdv": 191770,
            "refinanceLtv": 0.75,
            "refinanceAmount": 143828,
            "cashOut": 143828,
            "capitalStuck": 2429,
            "pullOutPct": 98
          },
          "worst": {
            "purchasePrice": 127000,
            "refurb": 21006,
            "purchaseCosts": 4445,
            "totalProjectCost": 152451,
            "cashIn": 152451,
            "gdv": 176428,
            "refinanceLtv": 0.75,
            "refinanceAmount": 132321,
            "cashOut": 132321,
            "capitalStuck": 20130,
            "pullOutPct": 87
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 11915
      },
      "income": {
        "airbnb75th": 2097,
        "councilLeaseLhaPct": 88,
        "councilLeaseMonthly": 694,
        "hybridMonthly": 1255,
        "lhaWeekly": 182,
        "notes": "Airbnb 75th percentile for 4-bed in L15. Council lease modelled at 88% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction",
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 44,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [
          "motivated seller"
        ],
        "crimeScore": 4,
        "ofstedRating": "Requires Improvement",
        "transportScore": 4,
        "greenSpaceScore": 5,
        "dealQualityScore": 10,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-029",
    "address": "73 Claremont Road, Ardwick",
    "postcode": "M13 5BL",
    "city": "manchester",
    "area": "M13",
    "price": 103000,
    "sqft": 1138,
    "beds": 3,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-29",
    "description": "3-bed semi-detached in Ardwick / Longsight with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.45468,
      "lng": -2.22536
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 140080,
    "capitalStuck": 30235,
    "monthlyIncome": 1912,
    "quality": "marginal",
    "capitalTag": "jv_recommended",
    "cashInBase": 65358,
    "createdAt": "2026-05-25",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 1138,
        "ageCategory": "post-1980"
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 140080,
        "sampleSize": 5,
        "gdvRealistic": 140080,
        "gdvStretch": 151286,
        "gdvConservative": 128874,
        "comps": [
          {
            "address": "144 Barlow Road",
            "postcode": "M13 5CH",
            "price": 152537,
            "beds": 4,
            "sqft": 1044,
            "soldDate": "2025-08-04",
            "distanceMiles": 0.47
          },
          {
            "address": "49 Hyde Road",
            "postcode": "M13 4TW",
            "price": 147537,
            "beds": 4,
            "sqft": 1116,
            "soldDate": "2025-09-28",
            "distanceMiles": 0.76
          },
          {
            "address": "26 Rochdale Road",
            "postcode": "M13 5NQ",
            "price": 123066,
            "beds": 4,
            "sqft": 1039,
            "soldDate": "2025-07-26",
            "distanceMiles": 0.48
          },
          {
            "address": "26 Moston Lane",
            "postcode": "M13 4OL",
            "price": 143606,
            "beds": 4,
            "sqft": 1077,
            "soldDate": "2025-07-05",
            "distanceMiles": 0.4
          },
          {
            "address": "109 Oxford Road",
            "postcode": "M13 4DZ",
            "price": 137362,
            "beds": 4,
            "sqft": 1156,
            "soldDate": "2025-07-24",
            "distanceMiles": 0.31
          }
        ]
      },
      "refurb": {
        "kitchen": 3537,
        "bathrooms": 2839,
        "flooring": 1481,
        "paint": 1758,
        "electrics": 1303,
        "boiler": 2622,
        "roof": 2121,
        "damp": 1696,
        "bedroomConversion": 2460,
        "saFinish": 1222,
        "contingencyPct": 15,
        "contingencyAmount": 3156,
        "total": 24195
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 97850,
            "refurb": 22259,
            "purchaseCosts": 3425,
            "bridgeInterest": 6165,
            "bridgeFees": 1370,
            "totalProjectCost": 131069,
            "cashIn": 62574,
            "gdv": 151286,
            "refinanceLtv": 0.75,
            "refinanceAmount": 113465,
            "cashOut": 44970,
            "capitalStuck": 17604,
            "pullOutPct": 72
          },
          "base": {
            "purchasePrice": 99910,
            "refurb": 24195,
            "purchaseCosts": 3497,
            "bridgeInterest": 6294,
            "bridgeFees": 1399,
            "totalProjectCost": 135295,
            "cashIn": 65358,
            "gdv": 140080,
            "refinanceLtv": 0.75,
            "refinanceAmount": 105060,
            "cashOut": 35123,
            "capitalStuck": 30235,
            "pullOutPct": 54
          },
          "worst": {
            "purchasePrice": 103000,
            "refurb": 27098,
            "purchaseCosts": 3605,
            "bridgeInterest": 6489,
            "bridgeFees": 1442,
            "totalProjectCost": 141634,
            "cashIn": 69534,
            "gdv": 128874,
            "refinanceLtv": 0.75,
            "refinanceAmount": 96656,
            "cashOut": 24556,
            "capitalStuck": 44978,
            "pullOutPct": 35
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 97850,
            "refurb": 22259,
            "purchaseCosts": 3425,
            "totalProjectCost": 123534,
            "cashIn": 123534,
            "gdv": 151286,
            "refinanceLtv": 0.75,
            "refinanceAmount": 113465,
            "cashOut": 113465,
            "capitalStuck": 10069,
            "pullOutPct": 92
          },
          "base": {
            "purchasePrice": 99910,
            "refurb": 24195,
            "purchaseCosts": 3497,
            "totalProjectCost": 127602,
            "cashIn": 127602,
            "gdv": 140080,
            "refinanceLtv": 0.75,
            "refinanceAmount": 105060,
            "cashOut": 105060,
            "capitalStuck": 22542,
            "pullOutPct": 82
          },
          "worst": {
            "purchasePrice": 103000,
            "refurb": 27098,
            "purchaseCosts": 3605,
            "totalProjectCost": 133703,
            "cashIn": 133703,
            "gdv": 128874,
            "refinanceLtv": 0.75,
            "refinanceAmount": 96656,
            "cashOut": 96656,
            "capitalStuck": 37047,
            "pullOutPct": 72
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 30235
      },
      "income": {
        "airbnb75th": 3367,
        "councilLeaseLhaPct": 87,
        "councilLeaseMonthly": 942,
        "hybridMonthly": 1912,
        "lhaWeekly": 250,
        "notes": "Airbnb 75th percentile for 4-bed in M13. Council lease modelled at 87% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 3,
        "flags": [
          "Additional HMO licensing",
          "Flood zone 3"
        ]
      },
      "risk": {
        "daysOnMarket": 143,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [
          "chain-free"
        ],
        "crimeScore": 4,
        "ofstedRating": "Requires Improvement",
        "transportScore": 8,
        "greenSpaceScore": 6,
        "dealQualityScore": 5,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-030",
    "address": "33 Barlow Road, Levenshulme",
    "postcode": "M19 3PA",
    "city": "manchester",
    "area": "M19",
    "price": 152000,
    "sqft": 908,
    "beds": 3,
    "baths": 1,
    "propertyType": "End-terrace",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-30",
    "description": "3-bed terraced in Levenshulme / Burnage with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.44986,
      "lng": -2.17917
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 186960,
    "capitalStuck": 70337,
    "monthlyIncome": 1841,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 107349,
    "createdAt": "2026-06-25",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 908,
        "ageCategory": "1919-1945"
      },
      "conversion": {
        "score": 4,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 186960,
        "sampleSize": 4,
        "gdvRealistic": 186960,
        "gdvStretch": 201917,
        "gdvConservative": 172003,
        "comps": [
          {
            "address": "32 Rochdale Road",
            "postcode": "M19 8MH",
            "price": 205576,
            "beds": 4,
            "sqft": 852,
            "soldDate": "2025-05-04",
            "distanceMiles": 0.57
          },
          {
            "address": "90 Mauldeth Road",
            "postcode": "M19 2FC",
            "price": 193735,
            "beds": 4,
            "sqft": 832,
            "soldDate": "2025-04-18",
            "distanceMiles": 0.09
          },
          {
            "address": "81 Barlow Road",
            "postcode": "M19 5RU",
            "price": 194931,
            "beds": 4,
            "sqft": 846,
            "soldDate": "2025-06-03",
            "distanceMiles": 0.51
          },
          {
            "address": "49 Wilmslow Road",
            "postcode": "M19 8ZK",
            "price": 159358,
            "beds": 4,
            "sqft": 819,
            "soldDate": "2025-08-12",
            "distanceMiles": 0.28
          }
        ]
      },
      "refurb": {
        "kitchen": 11934,
        "bathrooms": 3639,
        "flooring": 3328,
        "paint": 2975,
        "electrics": 2237,
        "boiler": 456,
        "roof": 5289,
        "damp": 1382,
        "bedroomConversion": 3851,
        "saFinish": 5435,
        "contingencyPct": 15,
        "contingencyAmount": 6079,
        "total": 46604
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 144400,
            "refurb": 42876,
            "purchaseCosts": 5054,
            "bridgeInterest": 9097,
            "bridgeFees": 2022,
            "totalProjectCost": 203449,
            "cashIn": 102369,
            "gdv": 201917,
            "refinanceLtv": 0.75,
            "refinanceAmount": 151438,
            "cashOut": 50358,
            "capitalStuck": 52011,
            "pullOutPct": 49
          },
          "base": {
            "purchasePrice": 147440,
            "refurb": 46604,
            "purchaseCosts": 5160,
            "bridgeInterest": 9289,
            "bridgeFees": 2064,
            "totalProjectCost": 210557,
            "cashIn": 107349,
            "gdv": 186960,
            "refinanceLtv": 0.75,
            "refinanceAmount": 140220,
            "cashOut": 37012,
            "capitalStuck": 70337,
            "pullOutPct": 34
          },
          "worst": {
            "purchasePrice": 152000,
            "refurb": 52196,
            "purchaseCosts": 5320,
            "bridgeInterest": 9576,
            "bridgeFees": 2128,
            "totalProjectCost": 221220,
            "cashIn": 114820,
            "gdv": 172003,
            "refinanceLtv": 0.75,
            "refinanceAmount": 129002,
            "cashOut": 22602,
            "capitalStuck": 92218,
            "pullOutPct": 20
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 144400,
            "refurb": 42876,
            "purchaseCosts": 5054,
            "totalProjectCost": 192330,
            "cashIn": 192330,
            "gdv": 201917,
            "refinanceLtv": 0.75,
            "refinanceAmount": 151438,
            "cashOut": 151438,
            "capitalStuck": 40892,
            "pullOutPct": 79
          },
          "base": {
            "purchasePrice": 147440,
            "refurb": 46604,
            "purchaseCosts": 5160,
            "totalProjectCost": 199204,
            "cashIn": 199204,
            "gdv": 186960,
            "refinanceLtv": 0.75,
            "refinanceAmount": 140220,
            "cashOut": 140220,
            "capitalStuck": 58984,
            "pullOutPct": 70
          },
          "worst": {
            "purchasePrice": 152000,
            "refurb": 52196,
            "purchaseCosts": 5320,
            "totalProjectCost": 209516,
            "cashIn": 209516,
            "gdv": 172003,
            "refinanceLtv": 0.75,
            "refinanceAmount": 129002,
            "cashOut": 129002,
            "capitalStuck": 80514,
            "pullOutPct": 62
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 70337
      },
      "income": {
        "airbnb75th": 3251,
        "councilLeaseLhaPct": 77,
        "councilLeaseMonthly": 901,
        "hybridMonthly": 1841,
        "lhaWeekly": 270,
        "notes": "Airbnb 75th percentile for 4-bed in M19. Council lease modelled at 77% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": true,
        "conservation": true,
        "floodZone": 2,
        "flags": [
          "Selective licensing",
          "Additional HMO licensing",
          "Conservation area"
        ]
      },
      "risk": {
        "daysOnMarket": 174,
        "priceReductions": 3,
        "auction": true,
        "distressedKeywords": [
          "auction"
        ],
        "crimeScore": 5,
        "ofstedRating": "N/A",
        "transportScore": 5,
        "greenSpaceScore": 3,
        "dealQualityScore": 5,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-031",
    "address": "53 Barlow Road, Clayton",
    "postcode": "M11 1TM",
    "city": "manchester",
    "area": "M11",
    "price": 79000,
    "sqft": 1006,
    "beds": 4,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-31",
    "description": "4-bed terraced in Clayton / Openshaw with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.47119,
      "lng": -2.18051
    },
    "tenure": "freehold",
    "targetBeds": 5,
    "gdv": 115340,
    "capitalStuck": 23038,
    "monthlyIncome": 1956,
    "quality": "good",
    "capitalTag": "jv_recommended",
    "cashInBase": 55902,
    "createdAt": "2026-05-24",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 1006,
        "ageCategory": "post-1980"
      },
      "conversion": {
        "score": 9,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 115340,
        "sampleSize": 5,
        "gdvRealistic": 115340,
        "gdvStretch": 124567,
        "gdvConservative": 106113,
        "comps": [
          {
            "address": "110 Hyde Road",
            "postcode": "M11 9EG",
            "price": 122839,
            "beds": 5,
            "sqft": 1114,
            "soldDate": "2025-02-11",
            "distanceMiles": 0.49
          },
          {
            "address": "124 Burnage Lane",
            "postcode": "M11 7KO",
            "price": 123285,
            "beds": 5,
            "sqft": 941,
            "soldDate": "2025-02-04",
            "distanceMiles": 0.1
          },
          {
            "address": "35 Mauldeth Road",
            "postcode": "M11 7VF",
            "price": 117432,
            "beds": 5,
            "sqft": 1015,
            "soldDate": "2025-05-26",
            "distanceMiles": 0.48
          },
          {
            "address": "17 Moston Lane",
            "postcode": "M11 4UO",
            "price": 109469,
            "beds": 5,
            "sqft": 1152,
            "soldDate": "2025-10-21",
            "distanceMiles": 0.13
          },
          {
            "address": "150 Claremont Road",
            "postcode": "M11 6PI",
            "price": 101034,
            "beds": 5,
            "sqft": 1085,
            "soldDate": "2025-10-20",
            "distanceMiles": 0.79
          }
        ]
      },
      "refurb": {
        "kitchen": 4962,
        "bathrooms": 2128,
        "flooring": 1874,
        "paint": 748,
        "electrics": 2407,
        "boiler": 1312,
        "roof": 365,
        "damp": 747,
        "bedroomConversion": 4172,
        "saFinish": 2441,
        "contingencyPct": 15,
        "contingencyAmount": 3174,
        "total": 24330
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 75050,
            "refurb": 22384,
            "purchaseCosts": 2627,
            "bridgeInterest": 4728,
            "bridgeFees": 1051,
            "totalProjectCost": 105840,
            "cashIn": 53305,
            "gdv": 124567,
            "refinanceLtv": 0.75,
            "refinanceAmount": 93425,
            "cashOut": 40890,
            "capitalStuck": 12415,
            "pullOutPct": 77
          },
          "base": {
            "purchasePrice": 76630,
            "refurb": 24330,
            "purchaseCosts": 2682,
            "bridgeInterest": 4828,
            "bridgeFees": 1073,
            "totalProjectCost": 109543,
            "cashIn": 55902,
            "gdv": 115340,
            "refinanceLtv": 0.75,
            "refinanceAmount": 86505,
            "cashOut": 32864,
            "capitalStuck": 23038,
            "pullOutPct": 59
          },
          "worst": {
            "purchasePrice": 79000,
            "refurb": 27250,
            "purchaseCosts": 2765,
            "bridgeInterest": 4977,
            "bridgeFees": 1106,
            "totalProjectCost": 115098,
            "cashIn": 59798,
            "gdv": 106113,
            "refinanceLtv": 0.75,
            "refinanceAmount": 79585,
            "cashOut": 24285,
            "capitalStuck": 35513,
            "pullOutPct": 41
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 75050,
            "refurb": 22384,
            "purchaseCosts": 2627,
            "totalProjectCost": 100061,
            "cashIn": 100061,
            "gdv": 124567,
            "refinanceLtv": 0.75,
            "refinanceAmount": 93425,
            "cashOut": 93425,
            "capitalStuck": 6636,
            "pullOutPct": 93
          },
          "base": {
            "purchasePrice": 76630,
            "refurb": 24330,
            "purchaseCosts": 2682,
            "totalProjectCost": 103642,
            "cashIn": 103642,
            "gdv": 115340,
            "refinanceLtv": 0.75,
            "refinanceAmount": 86505,
            "cashOut": 86505,
            "capitalStuck": 17137,
            "pullOutPct": 83
          },
          "worst": {
            "purchasePrice": 79000,
            "refurb": 27250,
            "purchaseCosts": 2765,
            "totalProjectCost": 109015,
            "cashIn": 109015,
            "gdv": 106113,
            "refinanceLtv": 0.75,
            "refinanceAmount": 79585,
            "cashOut": 79585,
            "capitalStuck": 29430,
            "pullOutPct": 73
          }
        },
        "quality": "good",
        "capitalStuckBase": 23038
      },
      "income": {
        "airbnb75th": 3499,
        "councilLeaseLhaPct": 83,
        "councilLeaseMonthly": 928,
        "hybridMonthly": 1956,
        "lhaWeekly": 258,
        "notes": "Airbnb 75th percentile for 5-bed in M11. Council lease modelled at 83% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction"
        ]
      },
      "risk": {
        "daysOnMarket": 126,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [
          "motivated seller"
        ],
        "crimeScore": 7,
        "ofstedRating": "Good",
        "transportScore": 5,
        "greenSpaceScore": 6,
        "dealQualityScore": 7,
        "reasoning": "Solid numbers with acceptable capital left in; watch refurb overruns and local licensing."
      }
    }
  },
  {
    "id": "deal-032",
    "address": "140 Barlow Road, Cheetham",
    "postcode": "M8 2YB",
    "city": "manchester",
    "area": "M8",
    "price": 146000,
    "sqft": 1055,
    "beds": 3,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba36295?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-32",
    "description": "3-bed semi-detached in Cheetham / Crumpsall with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.51615,
      "lng": -2.23066
    },
    "tenure": "leasehold",
    "targetBeds": 4,
    "gdv": 207320,
    "capitalStuck": 32160,
    "monthlyIncome": 1541,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 88516,
    "createdAt": "2026-01-03",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 1055,
        "ageCategory": "pre-1919",
        "leaseYearsRemaining": 100
      },
      "conversion": {
        "score": 6,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 207320,
        "sampleSize": 7,
        "gdvRealistic": 207320,
        "gdvStretch": 223906,
        "gdvConservative": 190734,
        "comps": [
          {
            "address": "136 Wilmslow Road",
            "postcode": "M8 6FS",
            "price": 206668,
            "beds": 4,
            "sqft": 1109,
            "soldDate": "2025-06-01",
            "distanceMiles": 0.26
          },
          {
            "address": "45 Slade Lane",
            "postcode": "M8 5OY",
            "price": 192280,
            "beds": 4,
            "sqft": 986,
            "soldDate": "2025-01-01",
            "distanceMiles": 0.49
          },
          {
            "address": "128 Moston Lane",
            "postcode": "M8 8PT",
            "price": 193960,
            "beds": 4,
            "sqft": 958,
            "soldDate": "2025-09-22",
            "distanceMiles": 0.04
          },
          {
            "address": "59 Slade Lane",
            "postcode": "M8 1VA",
            "price": 204676,
            "beds": 4,
            "sqft": 1178,
            "soldDate": "2025-12-06",
            "distanceMiles": 0.72
          },
          {
            "address": "120 Slade Lane",
            "postcode": "M8 4AI",
            "price": 179265,
            "beds": 4,
            "sqft": 1136,
            "soldDate": "2025-05-25",
            "distanceMiles": 0.44
          },
          {
            "address": "72 Slade Lane",
            "postcode": "M8 7ZH",
            "price": 200710,
            "beds": 4,
            "sqft": 1057,
            "soldDate": "2025-05-10",
            "distanceMiles": 0.71
          },
          {
            "address": "49 Cheetham Hill Road",
            "postcode": "M8 8IC",
            "price": 211878,
            "beds": 4,
            "sqft": 1092,
            "soldDate": "2025-11-17",
            "distanceMiles": 0.2
          }
        ]
      },
      "refurb": {
        "kitchen": 5913,
        "bathrooms": 4018,
        "flooring": 2769,
        "paint": 871,
        "electrics": 504,
        "boiler": 2216,
        "roof": 2467,
        "damp": 2269,
        "bedroomConversion": 2150,
        "saFinish": 3056,
        "contingencyPct": 15,
        "contingencyAmount": 3935,
        "total": 30168
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 138700,
            "refurb": 27755,
            "purchaseCosts": 4855,
            "bridgeInterest": 8738,
            "bridgeFees": 1942,
            "totalProjectCost": 181990,
            "cashIn": 84900,
            "gdv": 223906,
            "refinanceLtv": 0.75,
            "refinanceAmount": 167930,
            "cashOut": 70840,
            "capitalStuck": 14060,
            "pullOutPct": 83
          },
          "base": {
            "purchasePrice": 141620,
            "refurb": 30168,
            "purchaseCosts": 4957,
            "bridgeInterest": 8922,
            "bridgeFees": 1983,
            "totalProjectCost": 187650,
            "cashIn": 88516,
            "gdv": 207320,
            "refinanceLtv": 0.75,
            "refinanceAmount": 155490,
            "cashOut": 56356,
            "capitalStuck": 32160,
            "pullOutPct": 64
          },
          "worst": {
            "purchasePrice": 146000,
            "refurb": 33788,
            "purchaseCosts": 5110,
            "bridgeInterest": 9198,
            "bridgeFees": 2044,
            "totalProjectCost": 196140,
            "cashIn": 93940,
            "gdv": 190734,
            "refinanceLtv": 0.75,
            "refinanceAmount": 143051,
            "cashOut": 40851,
            "capitalStuck": 53089,
            "pullOutPct": 43
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 138700,
            "refurb": 27755,
            "purchaseCosts": 4855,
            "totalProjectCost": 171310,
            "cashIn": 171310,
            "gdv": 223906,
            "refinanceLtv": 0.75,
            "refinanceAmount": 167930,
            "cashOut": 167930,
            "capitalStuck": 3380,
            "pullOutPct": 98
          },
          "base": {
            "purchasePrice": 141620,
            "refurb": 30168,
            "purchaseCosts": 4957,
            "totalProjectCost": 176745,
            "cashIn": 176745,
            "gdv": 207320,
            "refinanceLtv": 0.75,
            "refinanceAmount": 155490,
            "cashOut": 155490,
            "capitalStuck": 21255,
            "pullOutPct": 88
          },
          "worst": {
            "purchasePrice": 146000,
            "refurb": 33788,
            "purchaseCosts": 5110,
            "totalProjectCost": 184898,
            "cashIn": 184898,
            "gdv": 190734,
            "refinanceLtv": 0.75,
            "refinanceAmount": 143051,
            "cashOut": 143051,
            "capitalStuck": 41847,
            "pullOutPct": 77
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 32160
      },
      "income": {
        "airbnb75th": 2317,
        "councilLeaseLhaPct": 85,
        "councilLeaseMonthly": 1024,
        "hybridMonthly": 1541,
        "lhaWeekly": 278,
        "notes": "Airbnb 75th percentile for 4-bed in M8. Council lease modelled at 85% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 2,
        "flags": [
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 98,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 8,
        "ofstedRating": "N/A",
        "transportScore": 9,
        "greenSpaceScore": 3,
        "dealQualityScore": 3,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-033",
    "address": "179 Rochdale Road, Fallowfield",
    "postcode": "M14 2TE",
    "city": "manchester",
    "area": "M14",
    "price": 177000,
    "sqft": 1117,
    "beds": 2,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-33",
    "description": "2-bed end-terrace in Fallowfield / Rusholme with strong potential to reconfigure to 3 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.45262,
      "lng": -2.23607
    },
    "tenure": "freehold",
    "targetBeds": 3,
    "gdv": 224790,
    "capitalStuck": 69737,
    "monthlyIncome": 1622,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 118147,
    "createdAt": "2026-07-17",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 1117,
        "ageCategory": "1945-1980"
      },
      "conversion": {
        "score": 4,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Only one reception currently"
        ],
        "currentBeds": 2,
        "targetBeds": 3,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 224790,
        "sampleSize": 7,
        "gdvRealistic": 224790,
        "gdvStretch": 242773,
        "gdvConservative": 206807,
        "comps": [
          {
            "address": "95 Dickenson Road",
            "postcode": "M14 2CW",
            "price": 204910,
            "beds": 3,
            "sqft": 1081,
            "soldDate": "2025-12-28",
            "distanceMiles": 0.63
          },
          {
            "address": "28 Burnage Lane",
            "postcode": "M14 5QC",
            "price": 240603,
            "beds": 3,
            "sqft": 1121,
            "soldDate": "2025-06-03",
            "distanceMiles": 0.47
          },
          {
            "address": "30 Dickenson Road",
            "postcode": "M14 5SH",
            "price": 243842,
            "beds": 3,
            "sqft": 1179,
            "soldDate": "2025-02-11",
            "distanceMiles": 0.44
          },
          {
            "address": "31 Slade Lane",
            "postcode": "M14 1DJ",
            "price": 192001,
            "beds": 3,
            "sqft": 1126,
            "soldDate": "2025-05-24",
            "distanceMiles": 0.2
          },
          {
            "address": "112 Stockport Road",
            "postcode": "M14 3HG",
            "price": 202223,
            "beds": 3,
            "sqft": 1063,
            "soldDate": "2025-03-07",
            "distanceMiles": 0.69
          },
          {
            "address": "47 Wilmslow Road",
            "postcode": "M14 3BC",
            "price": 230613,
            "beds": 3,
            "sqft": 1190,
            "soldDate": "2025-11-08",
            "distanceMiles": 0.53
          },
          {
            "address": "40 Wilmslow Road",
            "postcode": "M14 3IO",
            "price": 239416,
            "beds": 3,
            "sqft": 1137,
            "soldDate": "2025-08-04",
            "distanceMiles": 0.34
          }
        ]
      },
      "refurb": {
        "kitchen": 11416,
        "bathrooms": 6223,
        "flooring": 3699,
        "paint": 2081,
        "electrics": 2644,
        "boiler": 4496,
        "roof": 2011,
        "damp": 2045,
        "bedroomConversion": 4503,
        "saFinish": 2108,
        "contingencyPct": 15,
        "contingencyAmount": 6184,
        "total": 47411
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 168150,
            "refurb": 43618,
            "purchaseCosts": 5885,
            "bridgeInterest": 10593,
            "bridgeFees": 2354,
            "totalProjectCost": 230600,
            "cashIn": 112895,
            "gdv": 242773,
            "refinanceLtv": 0.75,
            "refinanceAmount": 182080,
            "cashOut": 64375,
            "capitalStuck": 48520,
            "pullOutPct": 57
          },
          "base": {
            "purchasePrice": 171690,
            "refurb": 47411,
            "purchaseCosts": 6009,
            "bridgeInterest": 10816,
            "bridgeFees": 2404,
            "totalProjectCost": 238330,
            "cashIn": 118147,
            "gdv": 224790,
            "refinanceLtv": 0.75,
            "refinanceAmount": 168593,
            "cashOut": 48410,
            "capitalStuck": 69737,
            "pullOutPct": 41
          },
          "worst": {
            "purchasePrice": 177000,
            "refurb": 53100,
            "purchaseCosts": 6195,
            "bridgeInterest": 11151,
            "bridgeFees": 2478,
            "totalProjectCost": 249924,
            "cashIn": 126024,
            "gdv": 206807,
            "refinanceLtv": 0.75,
            "refinanceAmount": 155105,
            "cashOut": 31205,
            "capitalStuck": 94819,
            "pullOutPct": 25
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 168150,
            "refurb": 43618,
            "purchaseCosts": 5885,
            "totalProjectCost": 217653,
            "cashIn": 217653,
            "gdv": 242773,
            "refinanceLtv": 0.75,
            "refinanceAmount": 182080,
            "cashOut": 182080,
            "capitalStuck": 35573,
            "pullOutPct": 84
          },
          "base": {
            "purchasePrice": 171690,
            "refurb": 47411,
            "purchaseCosts": 6009,
            "totalProjectCost": 225110,
            "cashIn": 225110,
            "gdv": 224790,
            "refinanceLtv": 0.75,
            "refinanceAmount": 168593,
            "cashOut": 168593,
            "capitalStuck": 56517,
            "pullOutPct": 75
          },
          "worst": {
            "purchasePrice": 177000,
            "refurb": 53100,
            "purchaseCosts": 6195,
            "totalProjectCost": 236295,
            "cashIn": 236295,
            "gdv": 206807,
            "refinanceLtv": 0.75,
            "refinanceAmount": 155105,
            "cashOut": 155105,
            "capitalStuck": 81190,
            "pullOutPct": 66
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 69737
      },
      "income": {
        "airbnb75th": 2999,
        "councilLeaseLhaPct": 77,
        "councilLeaseMonthly": 704,
        "hybridMonthly": 1622,
        "lhaWeekly": 211,
        "notes": "Airbnb 75th percentile for 3-bed in M14. Council lease modelled at 77% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 161,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 5,
        "ofstedRating": "Good",
        "transportScore": 6,
        "greenSpaceScore": 9,
        "dealQualityScore": 3,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-034",
    "address": "197 Park Road, Anfield",
    "postcode": "L4 7BL",
    "city": "liverpool",
    "area": "L4",
    "price": 76000,
    "sqft": 907,
    "beds": 3,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-34",
    "description": "3-bed terraced in Anfield / Walton with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.42734,
      "lng": -2.96182
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 121600,
    "capitalStuck": 10199,
    "monthlyIncome": 1490,
    "quality": "excellent",
    "capitalTag": "solo_doable",
    "cashInBase": 49795,
    "createdAt": "2026-01-15",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 907,
        "ageCategory": "post-1980"
      },
      "conversion": {
        "score": 10,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 121600,
        "sampleSize": 4,
        "gdvRealistic": 121600,
        "gdvStretch": 131328,
        "gdvConservative": 111872,
        "comps": [
          {
            "address": "11 Smithdown Road",
            "postcode": "L4 2MN",
            "price": 127822,
            "beds": 4,
            "sqft": 807,
            "soldDate": "2025-11-21",
            "distanceMiles": 0.13
          },
          {
            "address": "137 Smithdown Road",
            "postcode": "L4 4IN",
            "price": 128720,
            "beds": 4,
            "sqft": 1043,
            "soldDate": "2025-03-27",
            "distanceMiles": 0.5
          },
          {
            "address": "70 Park Road",
            "postcode": "L4 1CQ",
            "price": 108898,
            "beds": 4,
            "sqft": 987,
            "soldDate": "2025-01-15",
            "distanceMiles": 0.43
          },
          {
            "address": "91 Wavertree Road",
            "postcode": "L4 2TS",
            "price": 111839,
            "beds": 4,
            "sqft": 937,
            "soldDate": "2025-07-24",
            "distanceMiles": 0.23
          }
        ]
      },
      "refurb": {
        "kitchen": 3958,
        "bathrooms": 1460,
        "flooring": 1629,
        "paint": 597,
        "electrics": 1096,
        "boiler": 1289,
        "roof": 1338,
        "damp": 1412,
        "bedroomConversion": 2487,
        "saFinish": 1623,
        "contingencyPct": 15,
        "contingencyAmount": 2533,
        "total": 19423
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 72200,
            "refurb": 17869,
            "purchaseCosts": 2527,
            "bridgeInterest": 4549,
            "bridgeFees": 1011,
            "totalProjectCost": 98156,
            "cashIn": 47616,
            "gdv": 131328,
            "refinanceLtv": 0.75,
            "refinanceAmount": 98496,
            "cashOut": 47956,
            "capitalStuck": 0,
            "pullOutPct": 101
          },
          "base": {
            "purchasePrice": 73720,
            "refurb": 19423,
            "purchaseCosts": 2580,
            "bridgeInterest": 4644,
            "bridgeFees": 1032,
            "totalProjectCost": 101399,
            "cashIn": 49795,
            "gdv": 121600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 91200,
            "cashOut": 39596,
            "capitalStuck": 10199,
            "pullOutPct": 80
          },
          "worst": {
            "purchasePrice": 76000,
            "refurb": 21754,
            "purchaseCosts": 2660,
            "bridgeInterest": 4788,
            "bridgeFees": 1064,
            "totalProjectCost": 106266,
            "cashIn": 53066,
            "gdv": 111872,
            "refinanceLtv": 0.75,
            "refinanceAmount": 83904,
            "cashOut": 30704,
            "capitalStuck": 22362,
            "pullOutPct": 58
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 72200,
            "refurb": 17869,
            "purchaseCosts": 2527,
            "totalProjectCost": 92596,
            "cashIn": 92596,
            "gdv": 131328,
            "refinanceLtv": 0.75,
            "refinanceAmount": 98496,
            "cashOut": 92596,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 73720,
            "refurb": 19423,
            "purchaseCosts": 2580,
            "totalProjectCost": 95723,
            "cashIn": 95723,
            "gdv": 121600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 91200,
            "cashOut": 91200,
            "capitalStuck": 4523,
            "pullOutPct": 95
          },
          "worst": {
            "purchasePrice": 76000,
            "refurb": 21754,
            "purchaseCosts": 2660,
            "totalProjectCost": 100414,
            "cashIn": 100414,
            "gdv": 111872,
            "refinanceLtv": 0.75,
            "refinanceAmount": 83904,
            "cashOut": 83904,
            "capitalStuck": 16510,
            "pullOutPct": 84
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 10199
      },
      "income": {
        "airbnb75th": 2521,
        "councilLeaseLhaPct": 85,
        "councilLeaseMonthly": 803,
        "hybridMonthly": 1490,
        "lhaWeekly": 218,
        "notes": "Airbnb 75th percentile for 4-bed in L4. Council lease modelled at 85% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 3,
        "flags": [
          "Flood zone 3"
        ]
      },
      "risk": {
        "daysOnMarket": 146,
        "priceReductions": 3,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 8,
        "ofstedRating": "Outstanding",
        "transportScore": 5,
        "greenSpaceScore": 4,
        "dealQualityScore": 9,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-035",
    "address": "154 Lodge Lane, Everton",
    "postcode": "L5 5ZR",
    "city": "liverpool",
    "area": "L5",
    "price": 115000,
    "sqft": 654,
    "beds": 4,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1580587771525-78b9dba36295?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-35",
    "description": "4-bed terraced in Everton / Kirkdale with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.42346,
      "lng": -2.96739
    },
    "tenure": "leasehold",
    "targetBeds": 5,
    "gdv": 161000,
    "capitalStuck": 28913,
    "monthlyIncome": 1408,
    "quality": "good",
    "capitalTag": "jv_recommended",
    "cashInBase": 71578,
    "createdAt": "2026-07-24",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 654,
        "ageCategory": "pre-1919",
        "leaseYearsRemaining": 91
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 161000,
        "sampleSize": 7,
        "gdvRealistic": 161000,
        "gdvStretch": 173880,
        "gdvConservative": 148120,
        "comps": [
          {
            "address": "77 Breck Road",
            "postcode": "L5 8LN",
            "price": 138485,
            "beds": 5,
            "sqft": 693,
            "soldDate": "2025-01-17",
            "distanceMiles": 0.6
          },
          {
            "address": "143 Lodge Lane",
            "postcode": "L5 7GF",
            "price": 141291,
            "beds": 5,
            "sqft": 646,
            "soldDate": "2025-10-27",
            "distanceMiles": 0.75
          },
          {
            "address": "87 Edge Lane",
            "postcode": "L5 8GB",
            "price": 162693,
            "beds": 5,
            "sqft": 559,
            "soldDate": "2025-05-09",
            "distanceMiles": 0.42
          },
          {
            "address": "105 Priory Road",
            "postcode": "L5 2GS",
            "price": 151754,
            "beds": 5,
            "sqft": 559,
            "soldDate": "2025-10-24",
            "distanceMiles": 0.08
          },
          {
            "address": "69 Breck Road",
            "postcode": "L5 3XA",
            "price": 159776,
            "beds": 5,
            "sqft": 663,
            "soldDate": "2025-04-08",
            "distanceMiles": 0.38
          },
          {
            "address": "31 Walton Lane",
            "postcode": "L5 9CP",
            "price": 149283,
            "beds": 5,
            "sqft": 559,
            "soldDate": "2025-01-24",
            "distanceMiles": 0.55
          },
          {
            "address": "71 West Derby Road",
            "postcode": "L5 8ZV",
            "price": 174716,
            "beds": 5,
            "sqft": 734,
            "soldDate": "2025-07-21",
            "distanceMiles": 0.3
          }
        ]
      },
      "refurb": {
        "kitchen": 4528,
        "bathrooms": 2684,
        "flooring": 2255,
        "paint": 792,
        "electrics": 1926,
        "boiler": 1017,
        "roof": 2979,
        "damp": 752,
        "bedroomConversion": 3787,
        "saFinish": 1557,
        "contingencyPct": 15,
        "contingencyAmount": 3342,
        "total": 25619
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 109250,
            "refurb": 23569,
            "purchaseCosts": 3824,
            "bridgeInterest": 6883,
            "bridgeFees": 1530,
            "totalProjectCost": 145056,
            "cashIn": 68581,
            "gdv": 173880,
            "refinanceLtv": 0.75,
            "refinanceAmount": 130410,
            "cashOut": 53935,
            "capitalStuck": 14646,
            "pullOutPct": 79
          },
          "base": {
            "purchasePrice": 111550,
            "refurb": 25619,
            "purchaseCosts": 3904,
            "bridgeInterest": 7028,
            "bridgeFees": 1562,
            "totalProjectCost": 149663,
            "cashIn": 71578,
            "gdv": 161000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120750,
            "cashOut": 42665,
            "capitalStuck": 28913,
            "pullOutPct": 60
          },
          "worst": {
            "purchasePrice": 115000,
            "refurb": 28693,
            "purchaseCosts": 4025,
            "bridgeInterest": 7245,
            "bridgeFees": 1610,
            "totalProjectCost": 156573,
            "cashIn": 76073,
            "gdv": 148120,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111090,
            "cashOut": 30590,
            "capitalStuck": 45483,
            "pullOutPct": 40
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 109250,
            "refurb": 23569,
            "purchaseCosts": 3824,
            "totalProjectCost": 136643,
            "cashIn": 136643,
            "gdv": 173880,
            "refinanceLtv": 0.75,
            "refinanceAmount": 130410,
            "cashOut": 130410,
            "capitalStuck": 6233,
            "pullOutPct": 95
          },
          "base": {
            "purchasePrice": 111550,
            "refurb": 25619,
            "purchaseCosts": 3904,
            "totalProjectCost": 141073,
            "cashIn": 141073,
            "gdv": 161000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120750,
            "cashOut": 120750,
            "capitalStuck": 20323,
            "pullOutPct": 86
          },
          "worst": {
            "purchasePrice": 115000,
            "refurb": 28693,
            "purchaseCosts": 4025,
            "totalProjectCost": 147718,
            "cashIn": 147718,
            "gdv": 148120,
            "refinanceLtv": 0.75,
            "refinanceAmount": 111090,
            "cashOut": 111090,
            "capitalStuck": 36628,
            "pullOutPct": 75
          }
        },
        "quality": "good",
        "capitalStuckBase": 28913
      },
      "income": {
        "airbnb75th": 2455,
        "councilLeaseLhaPct": 90,
        "councilLeaseMonthly": 710,
        "hybridMonthly": 1408,
        "lhaWeekly": 182,
        "notes": "Airbnb 75th percentile for 5-bed in L5. Council lease modelled at 90% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": true,
        "conservation": true,
        "floodZone": 1,
        "flags": [
          "Additional HMO licensing",
          "Conservation area"
        ]
      },
      "risk": {
        "daysOnMarket": 83,
        "priceReductions": 1,
        "auction": true,
        "distressedKeywords": [
          "auction"
        ],
        "crimeScore": 8,
        "ofstedRating": "N/A",
        "transportScore": 6,
        "greenSpaceScore": 6,
        "dealQualityScore": 7,
        "reasoning": "Solid numbers with acceptable capital left in; watch refurb overruns and local licensing."
      }
    }
  },
  {
    "id": "deal-036",
    "address": "43 Walton Lane, Tuebrook",
    "postcode": "L6 8QX",
    "city": "liverpool",
    "area": "L6",
    "price": 195000,
    "sqft": 644,
    "beds": 3,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-36",
    "description": "3-bed end-terrace in Tuebrook / Kensington with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.41845,
      "lng": -2.93524
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 249600,
    "capitalStuck": 66779,
    "monthlyIncome": 1172,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 121574,
    "createdAt": "2026-04-26",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 644,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 3,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "Tight sqft for +1 bed"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 249600,
        "sampleSize": 4,
        "gdvRealistic": 249600,
        "gdvStretch": 269568,
        "gdvConservative": 229632,
        "comps": [
          {
            "address": "63 Priory Road",
            "postcode": "L6 7ZV",
            "price": 249524,
            "beds": 4,
            "sqft": 678,
            "soldDate": "2025-05-21",
            "distanceMiles": 0.39
          },
          {
            "address": "104 Lodge Lane",
            "postcode": "L6 5HG",
            "price": 274423,
            "beds": 4,
            "sqft": 678,
            "soldDate": "2025-10-05",
            "distanceMiles": 0.17
          },
          {
            "address": "51 Edge Lane",
            "postcode": "L6 8HL",
            "price": 229201,
            "beds": 4,
            "sqft": 600,
            "soldDate": "2025-01-02",
            "distanceMiles": 0.4
          },
          {
            "address": "116 Mill Street",
            "postcode": "L6 7RN",
            "price": 233938,
            "beds": 4,
            "sqft": 669,
            "soldDate": "2025-10-19",
            "distanceMiles": 0.08
          }
        ]
      },
      "refurb": {
        "kitchen": 7522,
        "bathrooms": 5700,
        "flooring": 2182,
        "paint": 2611,
        "electrics": 4154,
        "boiler": 890,
        "roof": 658,
        "damp": 3237,
        "bedroomConversion": 6271,
        "saFinish": 4727,
        "contingencyPct": 15,
        "contingencyAmount": 5692,
        "total": 43645
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 185250,
            "refurb": 40153,
            "purchaseCosts": 6484,
            "bridgeInterest": 11671,
            "bridgeFees": 2594,
            "totalProjectCost": 246152,
            "cashIn": 116477,
            "gdv": 269568,
            "refinanceLtv": 0.75,
            "refinanceAmount": 202176,
            "cashOut": 72501,
            "capitalStuck": 43976,
            "pullOutPct": 62
          },
          "base": {
            "purchasePrice": 189150,
            "refurb": 43645,
            "purchaseCosts": 6620,
            "bridgeInterest": 11916,
            "bridgeFees": 2648,
            "totalProjectCost": 253979,
            "cashIn": 121574,
            "gdv": 249600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 187200,
            "cashOut": 54795,
            "capitalStuck": 66779,
            "pullOutPct": 45
          },
          "worst": {
            "purchasePrice": 195000,
            "refurb": 48882,
            "purchaseCosts": 6825,
            "bridgeInterest": 12285,
            "bridgeFees": 2730,
            "totalProjectCost": 265722,
            "cashIn": 129222,
            "gdv": 229632,
            "refinanceLtv": 0.75,
            "refinanceAmount": 172224,
            "cashOut": 35724,
            "capitalStuck": 93498,
            "pullOutPct": 28
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 185250,
            "refurb": 40153,
            "purchaseCosts": 6484,
            "totalProjectCost": 231887,
            "cashIn": 231887,
            "gdv": 269568,
            "refinanceLtv": 0.75,
            "refinanceAmount": 202176,
            "cashOut": 202176,
            "capitalStuck": 29711,
            "pullOutPct": 87
          },
          "base": {
            "purchasePrice": 189150,
            "refurb": 43645,
            "purchaseCosts": 6620,
            "totalProjectCost": 239415,
            "cashIn": 239415,
            "gdv": 249600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 187200,
            "cashOut": 187200,
            "capitalStuck": 52215,
            "pullOutPct": 78
          },
          "worst": {
            "purchasePrice": 195000,
            "refurb": 48882,
            "purchaseCosts": 6825,
            "totalProjectCost": 250707,
            "cashIn": 250707,
            "gdv": 229632,
            "refinanceLtv": 0.75,
            "refinanceAmount": 172224,
            "cashOut": 172224,
            "capitalStuck": 78483,
            "pullOutPct": 69
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 66779
      },
      "income": {
        "airbnb75th": 1800,
        "councilLeaseLhaPct": 90,
        "councilLeaseMonthly": 753,
        "hybridMonthly": 1172,
        "lhaWeekly": 193,
        "notes": "Airbnb 75th percentile for 4-bed in L6. Council lease modelled at 90% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 3,
        "flags": [
          "Flood zone 3"
        ]
      },
      "risk": {
        "daysOnMarket": 124,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 3,
        "ofstedRating": "N/A",
        "transportScore": 9,
        "greenSpaceScore": 9,
        "dealQualityScore": 3,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-037",
    "address": "98 Upper Parliament Street, Edge Hill",
    "postcode": "L7 6HE",
    "city": "liverpool",
    "area": "L7",
    "price": 128000,
    "sqft": 683,
    "beds": 4,
    "baths": 1,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-37",
    "description": "4-bed semi-detached in Edge Hill / Fairfield with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.40532,
      "lng": -2.9557
    },
    "tenure": "freehold",
    "targetBeds": 5,
    "gdv": 204800,
    "capitalStuck": 7998,
    "monthlyIncome": 1625,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 74686,
    "createdAt": "2026-03-21",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 683,
        "ageCategory": "1919-1945"
      },
      "conversion": {
        "score": 9,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 204800,
        "sampleSize": 7,
        "gdvRealistic": 204800,
        "gdvStretch": 221184,
        "gdvConservative": 188416,
        "comps": [
          {
            "address": "118 Edge Lane",
            "postcode": "L7 5ZV",
            "price": 209879,
            "beds": 5,
            "sqft": 720,
            "soldDate": "2025-10-09",
            "distanceMiles": 0.12
          },
          {
            "address": "122 Upper Parliament Street",
            "postcode": "L7 5GO",
            "price": 206038,
            "beds": 5,
            "sqft": 731,
            "soldDate": "2025-06-24",
            "distanceMiles": 0.43
          },
          {
            "address": "17 Park Road",
            "postcode": "L7 8VY",
            "price": 205019,
            "beds": 5,
            "sqft": 679,
            "soldDate": "2025-10-12",
            "distanceMiles": 0.45
          },
          {
            "address": "42 Kensington",
            "postcode": "L7 8OJ",
            "price": 224940,
            "beds": 5,
            "sqft": 748,
            "soldDate": "2025-11-23",
            "distanceMiles": 0.71
          },
          {
            "address": "23 Smithdown Road",
            "postcode": "L7 7TQ",
            "price": 207315,
            "beds": 5,
            "sqft": 761,
            "soldDate": "2025-09-12",
            "distanceMiles": 0.39
          },
          {
            "address": "19 Wavertree Road",
            "postcode": "L7 3YB",
            "price": 175313,
            "beds": 5,
            "sqft": 662,
            "soldDate": "2025-06-26",
            "distanceMiles": 0.59
          },
          {
            "address": "96 Lodge Lane",
            "postcode": "L7 3SY",
            "price": 186930,
            "beds": 5,
            "sqft": 679,
            "soldDate": "2025-08-05",
            "distanceMiles": 0.52
          }
        ]
      },
      "refurb": {
        "kitchen": 3819,
        "bathrooms": 3563,
        "flooring": 1023,
        "paint": 1308,
        "electrics": 1117,
        "boiler": 1667,
        "roof": 1024,
        "damp": 1361,
        "bedroomConversion": 4489,
        "saFinish": 1090,
        "contingencyPct": 15,
        "contingencyAmount": 3069,
        "total": 23532
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 121600,
            "refurb": 21649,
            "purchaseCosts": 4256,
            "bridgeInterest": 7661,
            "bridgeFees": 1702,
            "totalProjectCost": 156868,
            "cashIn": 71748,
            "gdv": 221184,
            "refinanceLtv": 0.75,
            "refinanceAmount": 165888,
            "cashOut": 80768,
            "capitalStuck": 0,
            "pullOutPct": 113
          },
          "base": {
            "purchasePrice": 124160,
            "refurb": 23532,
            "purchaseCosts": 4346,
            "bridgeInterest": 7822,
            "bridgeFees": 1738,
            "totalProjectCost": 161598,
            "cashIn": 74686,
            "gdv": 204800,
            "refinanceLtv": 0.75,
            "refinanceAmount": 153600,
            "cashOut": 66688,
            "capitalStuck": 7998,
            "pullOutPct": 89
          },
          "worst": {
            "purchasePrice": 128000,
            "refurb": 26356,
            "purchaseCosts": 4480,
            "bridgeInterest": 8064,
            "bridgeFees": 1792,
            "totalProjectCost": 168692,
            "cashIn": 79092,
            "gdv": 188416,
            "refinanceLtv": 0.75,
            "refinanceAmount": 141312,
            "cashOut": 51712,
            "capitalStuck": 27380,
            "pullOutPct": 65
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 121600,
            "refurb": 21649,
            "purchaseCosts": 4256,
            "totalProjectCost": 147505,
            "cashIn": 147505,
            "gdv": 221184,
            "refinanceLtv": 0.75,
            "refinanceAmount": 165888,
            "cashOut": 147505,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 124160,
            "refurb": 23532,
            "purchaseCosts": 4346,
            "totalProjectCost": 152038,
            "cashIn": 152038,
            "gdv": 204800,
            "refinanceLtv": 0.75,
            "refinanceAmount": 153600,
            "cashOut": 152038,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "worst": {
            "purchasePrice": 128000,
            "refurb": 26356,
            "purchaseCosts": 4480,
            "totalProjectCost": 158836,
            "cashIn": 158836,
            "gdv": 188416,
            "refinanceLtv": 0.75,
            "refinanceAmount": 141312,
            "cashOut": 141312,
            "capitalStuck": 17524,
            "pullOutPct": 89
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 7998
      },
      "income": {
        "airbnb75th": 2886,
        "councilLeaseLhaPct": 85,
        "councilLeaseMonthly": 785,
        "hybridMonthly": 1625,
        "lhaWeekly": 213,
        "notes": "Airbnb 75th percentile for 5-bed in L7. Council lease modelled at 85% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 2,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 59,
        "priceReductions": 2,
        "auction": false,
        "distressedKeywords": [
          "motivated seller"
        ],
        "crimeScore": 5,
        "ofstedRating": "N/A",
        "transportScore": 6,
        "greenSpaceScore": 9,
        "dealQualityScore": 8,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-038",
    "address": "106 Mill Street, Toxteth",
    "postcode": "L8 3UQ",
    "city": "liverpool",
    "area": "L8",
    "price": 125000,
    "sqft": 1005,
    "beds": 4,
    "baths": 2,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-38",
    "description": "4-bed terraced in Toxteth / Dingle with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.39153,
      "lng": -2.96378
    },
    "tenure": "freehold",
    "targetBeds": 5,
    "gdv": 175000,
    "capitalStuck": 32452,
    "monthlyIncome": 1254,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 78827,
    "createdAt": "2026-06-06",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 1005,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 5,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Generous floor area for target beds"
        ],
        "negatives": [
          "Bathroom on ground floor only",
          "May need partition fire-rating"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 175000,
        "sampleSize": 6,
        "gdvRealistic": 175000,
        "gdvStretch": 189000,
        "gdvConservative": 161000,
        "comps": [
          {
            "address": "120 Smithdown Road",
            "postcode": "L8 5TC",
            "price": 152916,
            "beds": 5,
            "sqft": 1035,
            "soldDate": "2025-03-03",
            "distanceMiles": 0.27
          },
          {
            "address": "141 Upper Parliament Street",
            "postcode": "L8 4ZH",
            "price": 178088,
            "beds": 5,
            "sqft": 1006,
            "soldDate": "2025-05-09",
            "distanceMiles": 0.72
          },
          {
            "address": "77 Wavertree Road",
            "postcode": "L8 4VY",
            "price": 189227,
            "beds": 5,
            "sqft": 1128,
            "soldDate": "2025-07-23",
            "distanceMiles": 0.54
          },
          {
            "address": "88 Edge Lane",
            "postcode": "L8 4TG",
            "price": 191443,
            "beds": 5,
            "sqft": 1018,
            "soldDate": "2025-11-20",
            "distanceMiles": 0.11
          },
          {
            "address": "57 Walton Lane",
            "postcode": "L8 8SI",
            "price": 189974,
            "beds": 5,
            "sqft": 1061,
            "soldDate": "2025-12-27",
            "distanceMiles": 0.02
          },
          {
            "address": "94 Prescot Road",
            "postcode": "L8 9XF",
            "price": 157233,
            "beds": 5,
            "sqft": 952,
            "soldDate": "2025-10-06",
            "distanceMiles": 0.51
          }
        ]
      },
      "refurb": {
        "kitchen": 5697,
        "bathrooms": 3090,
        "flooring": 1896,
        "paint": 1623,
        "electrics": 766,
        "boiler": 2515,
        "roof": 3141,
        "damp": 803,
        "bedroomConversion": 2945,
        "saFinish": 2629,
        "contingencyPct": 15,
        "contingencyAmount": 3766,
        "total": 28871
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 118750,
            "refurb": 26561,
            "purchaseCosts": 4156,
            "bridgeInterest": 7481,
            "bridgeFees": 1663,
            "totalProjectCost": 158611,
            "cashIn": 75486,
            "gdv": 189000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 141750,
            "cashOut": 58625,
            "capitalStuck": 16861,
            "pullOutPct": 78
          },
          "base": {
            "purchasePrice": 121250,
            "refurb": 28871,
            "purchaseCosts": 4244,
            "bridgeInterest": 7639,
            "bridgeFees": 1698,
            "totalProjectCost": 163702,
            "cashIn": 78827,
            "gdv": 175000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131250,
            "cashOut": 46375,
            "capitalStuck": 32452,
            "pullOutPct": 59
          },
          "worst": {
            "purchasePrice": 125000,
            "refurb": 32336,
            "purchaseCosts": 4375,
            "bridgeInterest": 7875,
            "bridgeFees": 1750,
            "totalProjectCost": 171336,
            "cashIn": 83836,
            "gdv": 161000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120750,
            "cashOut": 33250,
            "capitalStuck": 50586,
            "pullOutPct": 40
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 118750,
            "refurb": 26561,
            "purchaseCosts": 4156,
            "totalProjectCost": 149467,
            "cashIn": 149467,
            "gdv": 189000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 141750,
            "cashOut": 141750,
            "capitalStuck": 7717,
            "pullOutPct": 95
          },
          "base": {
            "purchasePrice": 121250,
            "refurb": 28871,
            "purchaseCosts": 4244,
            "totalProjectCost": 154365,
            "cashIn": 154365,
            "gdv": 175000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 131250,
            "cashOut": 131250,
            "capitalStuck": 23115,
            "pullOutPct": 85
          },
          "worst": {
            "purchasePrice": 125000,
            "refurb": 32336,
            "purchaseCosts": 4375,
            "totalProjectCost": 161711,
            "cashIn": 161711,
            "gdv": 161000,
            "refinanceLtv": 0.75,
            "refinanceAmount": 120750,
            "cashOut": 120750,
            "capitalStuck": 40961,
            "pullOutPct": 75
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 32452
      },
      "income": {
        "airbnb75th": 2000,
        "councilLeaseLhaPct": 80,
        "councilLeaseMonthly": 756,
        "hybridMonthly": 1254,
        "lhaWeekly": 218,
        "notes": "Airbnb 75th percentile for 5-bed in L8. Council lease modelled at 80% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 11,
        "priceReductions": 2,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 6,
        "ofstedRating": "Good",
        "transportScore": 5,
        "greenSpaceScore": 5,
        "dealQualityScore": 4,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-039",
    "address": "90 Kensington, Wavertree",
    "postcode": "L15 5OQ",
    "city": "liverpool",
    "area": "L15",
    "price": 172000,
    "sqft": 681,
    "beds": 3,
    "baths": 2,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-39",
    "description": "3-bed terraced in Wavertree / Picton with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.40228,
      "lng": -2.9203
    },
    "tenure": "leasehold",
    "targetBeds": 4,
    "gdv": 209840,
    "capitalStuck": 73279,
    "monthlyIncome": 1638,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 113871,
    "createdAt": "2026-06-28",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": false,
        "sqft": 681,
        "ageCategory": "1919-1945",
        "leaseYearsRemaining": 116
      },
      "conversion": {
        "score": 4,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 209840,
        "sampleSize": 5,
        "gdvRealistic": 209840,
        "gdvStretch": 226627,
        "gdvConservative": 193053,
        "comps": [
          {
            "address": "38 Lodge Lane",
            "postcode": "L15 9YF",
            "price": 223021,
            "beds": 4,
            "sqft": 820,
            "soldDate": "2025-01-12",
            "distanceMiles": 0.13
          },
          {
            "address": "84 Park Road",
            "postcode": "L15 8BW",
            "price": 228770,
            "beds": 4,
            "sqft": 814,
            "soldDate": "2025-05-10",
            "distanceMiles": 0.01
          },
          {
            "address": "23 Belmont Road",
            "postcode": "L15 3FA",
            "price": 188208,
            "beds": 4,
            "sqft": 781,
            "soldDate": "2025-02-13",
            "distanceMiles": 0.39
          },
          {
            "address": "130 Edge Lane",
            "postcode": "L15 4IF",
            "price": 208942,
            "beds": 4,
            "sqft": 646,
            "soldDate": "2025-10-12",
            "distanceMiles": 0.3
          },
          {
            "address": "108 Aigburth Road",
            "postcode": "L15 2HQ",
            "price": 184528,
            "beds": 4,
            "sqft": 698,
            "soldDate": "2025-05-21",
            "distanceMiles": 0.72
          }
        ]
      },
      "refurb": {
        "kitchen": 9727,
        "bathrooms": 6119,
        "flooring": 5244,
        "paint": 1506,
        "electrics": 772,
        "boiler": 3768,
        "roof": 1080,
        "damp": 806,
        "bedroomConversion": 7805,
        "saFinish": 2419,
        "contingencyPct": 15,
        "contingencyAmount": 5887,
        "total": 45133
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 163400,
            "refurb": 41522,
            "purchaseCosts": 5719,
            "bridgeInterest": 10294,
            "bridgeFees": 2288,
            "totalProjectCost": 223223,
            "cashIn": 108843,
            "gdv": 226627,
            "refinanceLtv": 0.75,
            "refinanceAmount": 169970,
            "cashOut": 55590,
            "capitalStuck": 53253,
            "pullOutPct": 51
          },
          "base": {
            "purchasePrice": 166840,
            "refurb": 45133,
            "purchaseCosts": 5839,
            "bridgeInterest": 10511,
            "bridgeFees": 2336,
            "totalProjectCost": 230659,
            "cashIn": 113871,
            "gdv": 209840,
            "refinanceLtv": 0.75,
            "refinanceAmount": 157380,
            "cashOut": 40592,
            "capitalStuck": 73279,
            "pullOutPct": 36
          },
          "worst": {
            "purchasePrice": 172000,
            "refurb": 50549,
            "purchaseCosts": 6020,
            "bridgeInterest": 10836,
            "bridgeFees": 2408,
            "totalProjectCost": 241813,
            "cashIn": 121413,
            "gdv": 193053,
            "refinanceLtv": 0.75,
            "refinanceAmount": 144790,
            "cashOut": 24390,
            "capitalStuck": 97023,
            "pullOutPct": 20
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 163400,
            "refurb": 41522,
            "purchaseCosts": 5719,
            "totalProjectCost": 210641,
            "cashIn": 210641,
            "gdv": 226627,
            "refinanceLtv": 0.75,
            "refinanceAmount": 169970,
            "cashOut": 169970,
            "capitalStuck": 40671,
            "pullOutPct": 81
          },
          "base": {
            "purchasePrice": 166840,
            "refurb": 45133,
            "purchaseCosts": 5839,
            "totalProjectCost": 217812,
            "cashIn": 217812,
            "gdv": 209840,
            "refinanceLtv": 0.75,
            "refinanceAmount": 157380,
            "cashOut": 157380,
            "capitalStuck": 60432,
            "pullOutPct": 72
          },
          "worst": {
            "purchasePrice": 172000,
            "refurb": 50549,
            "purchaseCosts": 6020,
            "totalProjectCost": 228569,
            "cashIn": 228569,
            "gdv": 193053,
            "refinanceLtv": 0.75,
            "refinanceAmount": 144790,
            "cashOut": 144790,
            "capitalStuck": 83779,
            "pullOutPct": 63
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 73279
      },
      "income": {
        "airbnb75th": 2943,
        "councilLeaseLhaPct": 84,
        "councilLeaseMonthly": 768,
        "hybridMonthly": 1638,
        "lhaWeekly": 211,
        "notes": "Airbnb 75th percentile for 4-bed in L15. Council lease modelled at 84% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 26,
        "priceReductions": 3,
        "auction": true,
        "distressedKeywords": [
          "auction"
        ],
        "crimeScore": 8,
        "ofstedRating": "Requires Improvement",
        "transportScore": 9,
        "greenSpaceScore": 7,
        "dealQualityScore": 5,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-040",
    "address": "94 Rochdale Road, Ardwick",
    "postcode": "M13 9OI",
    "city": "manchester",
    "area": "M13",
    "price": 107000,
    "sqft": 1021,
    "beds": 2,
    "baths": 1,
    "propertyType": "End-terrace",
    "photos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-40",
    "description": "2-bed semi-detached in Ardwick / Longsight with strong potential to reconfigure to 3 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.47018,
      "lng": -2.2038
    },
    "tenure": "leasehold",
    "targetBeds": 3,
    "gdv": 171200,
    "capitalStuck": 9043,
    "monthlyIncome": 1398,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 64790,
    "createdAt": "2026-04-24",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 1021,
        "ageCategory": "pre-1919",
        "leaseYearsRemaining": 113
      },
      "conversion": {
        "score": 7,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Only one reception currently",
          "May need partition fire-rating"
        ],
        "currentBeds": 2,
        "targetBeds": 3,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 171200,
        "sampleSize": 4,
        "gdvRealistic": 171200,
        "gdvStretch": 184896,
        "gdvConservative": 157504,
        "comps": [
          {
            "address": "66 Wilmslow Road",
            "postcode": "M13 4VJ",
            "price": 164202,
            "beds": 3,
            "sqft": 951,
            "soldDate": "2025-07-15",
            "distanceMiles": 0.42
          },
          {
            "address": "112 Wilmslow Road",
            "postcode": "M13 9HG",
            "price": 148383,
            "beds": 3,
            "sqft": 1129,
            "soldDate": "2025-04-23",
            "distanceMiles": 0.07
          },
          {
            "address": "61 Mauldeth Road",
            "postcode": "M13 8RG",
            "price": 173328,
            "beds": 3,
            "sqft": 1101,
            "soldDate": "2025-02-22",
            "distanceMiles": 0.28
          },
          {
            "address": "62 Hyde Road",
            "postcode": "M13 7CZ",
            "price": 163018,
            "beds": 3,
            "sqft": 1137,
            "soldDate": "2025-04-05",
            "distanceMiles": 0.03
          }
        ]
      },
      "refurb": {
        "kitchen": 6001,
        "bathrooms": 2632,
        "flooring": 2136,
        "paint": 615,
        "electrics": 2084,
        "boiler": 1447,
        "roof": 293,
        "damp": 120,
        "bedroomConversion": 2693,
        "saFinish": 1134,
        "contingencyPct": 15,
        "contingencyAmount": 2873,
        "total": 22028
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 101650,
            "refurb": 20266,
            "purchaseCosts": 3558,
            "bridgeInterest": 6404,
            "bridgeFees": 1423,
            "totalProjectCost": 133301,
            "cashIn": 62146,
            "gdv": 184896,
            "refinanceLtv": 0.75,
            "refinanceAmount": 138672,
            "cashOut": 67517,
            "capitalStuck": 0,
            "pullOutPct": 109
          },
          "base": {
            "purchasePrice": 103790,
            "refurb": 22028,
            "purchaseCosts": 3633,
            "bridgeInterest": 6539,
            "bridgeFees": 1453,
            "totalProjectCost": 137443,
            "cashIn": 64790,
            "gdv": 171200,
            "refinanceLtv": 0.75,
            "refinanceAmount": 128400,
            "cashOut": 55747,
            "capitalStuck": 9043,
            "pullOutPct": 86
          },
          "worst": {
            "purchasePrice": 107000,
            "refurb": 24671,
            "purchaseCosts": 3745,
            "bridgeInterest": 6741,
            "bridgeFees": 1498,
            "totalProjectCost": 143655,
            "cashIn": 68755,
            "gdv": 157504,
            "refinanceLtv": 0.75,
            "refinanceAmount": 118128,
            "cashOut": 43228,
            "capitalStuck": 25527,
            "pullOutPct": 63
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 101650,
            "refurb": 20266,
            "purchaseCosts": 3558,
            "totalProjectCost": 125474,
            "cashIn": 125474,
            "gdv": 184896,
            "refinanceLtv": 0.75,
            "refinanceAmount": 138672,
            "cashOut": 125474,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 103790,
            "refurb": 22028,
            "purchaseCosts": 3633,
            "totalProjectCost": 129451,
            "cashIn": 129451,
            "gdv": 171200,
            "refinanceLtv": 0.75,
            "refinanceAmount": 128400,
            "cashOut": 128400,
            "capitalStuck": 1051,
            "pullOutPct": 99
          },
          "worst": {
            "purchasePrice": 107000,
            "refurb": 24671,
            "purchaseCosts": 3745,
            "totalProjectCost": 135416,
            "cashIn": 135416,
            "gdv": 157504,
            "refinanceLtv": 0.75,
            "refinanceAmount": 118128,
            "cashOut": 118128,
            "capitalStuck": 17288,
            "pullOutPct": 87
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 9043
      },
      "income": {
        "airbnb75th": 2562,
        "councilLeaseLhaPct": 84,
        "councilLeaseMonthly": 622,
        "hybridMonthly": 1398,
        "lhaWeekly": 171,
        "notes": "Airbnb 75th percentile for 3-bed in M13. Council lease modelled at 84% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": false,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction",
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 97,
        "priceReductions": 2,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 3,
        "ofstedRating": "Outstanding",
        "transportScore": 4,
        "greenSpaceScore": 5,
        "dealQualityScore": 9,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-041",
    "address": "65 Moston Lane, Levenshulme",
    "postcode": "M19 8YT",
    "city": "manchester",
    "area": "M19",
    "price": 114000,
    "sqft": 751,
    "beds": 3,
    "baths": 2,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-41",
    "description": "3-bed end-terrace in Levenshulme / Burnage with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.45143,
      "lng": -2.19883
    },
    "tenure": "leasehold",
    "targetBeds": 4,
    "gdv": 166440,
    "capitalStuck": 21375,
    "monthlyIncome": 1649,
    "quality": "good",
    "capitalTag": "jv_recommended",
    "cashInBase": 68799,
    "createdAt": "2026-04-22",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 751,
        "ageCategory": "1945-1980",
        "leaseYearsRemaining": 79
      },
      "conversion": {
        "score": 5,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 166440,
        "sampleSize": 4,
        "gdvRealistic": 166440,
        "gdvStretch": 179755,
        "gdvConservative": 153125,
        "comps": [
          {
            "address": "138 Wilmslow Road",
            "postcode": "M19 4DX",
            "price": 182731,
            "beds": 4,
            "sqft": 836,
            "soldDate": "2025-08-25",
            "distanceMiles": 0.32
          },
          {
            "address": "102 Cheetham Hill Road",
            "postcode": "M19 6IA",
            "price": 169031,
            "beds": 4,
            "sqft": 877,
            "soldDate": "2025-05-16",
            "distanceMiles": 0.54
          },
          {
            "address": "94 Burnage Lane",
            "postcode": "M19 2RU",
            "price": 149589,
            "beds": 4,
            "sqft": 737,
            "soldDate": "2025-05-25",
            "distanceMiles": 0.78
          },
          {
            "address": "12 Rochdale Road",
            "postcode": "M19 9YX",
            "price": 179604,
            "beds": 4,
            "sqft": 827,
            "soldDate": "2025-10-03",
            "distanceMiles": 0.29
          }
        ]
      },
      "refurb": {
        "kitchen": 3617,
        "bathrooms": 3004,
        "flooring": 1200,
        "paint": 1121,
        "electrics": 2430,
        "boiler": 709,
        "roof": 1312,
        "damp": 620,
        "bedroomConversion": 2777,
        "saFinish": 3419,
        "contingencyPct": 15,
        "contingencyAmount": 3031,
        "total": 23240
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 108300,
            "refurb": 21381,
            "purchaseCosts": 3791,
            "bridgeInterest": 6823,
            "bridgeFees": 1516,
            "totalProjectCost": 141811,
            "cashIn": 66001,
            "gdv": 179755,
            "refinanceLtv": 0.75,
            "refinanceAmount": 134816,
            "cashOut": 59006,
            "capitalStuck": 6995,
            "pullOutPct": 89
          },
          "base": {
            "purchasePrice": 110580,
            "refurb": 23240,
            "purchaseCosts": 3870,
            "bridgeInterest": 6967,
            "bridgeFees": 1548,
            "totalProjectCost": 146205,
            "cashIn": 68799,
            "gdv": 166440,
            "refinanceLtv": 0.75,
            "refinanceAmount": 124830,
            "cashOut": 47424,
            "capitalStuck": 21375,
            "pullOutPct": 69
          },
          "worst": {
            "purchasePrice": 114000,
            "refurb": 26029,
            "purchaseCosts": 3990,
            "bridgeInterest": 7182,
            "bridgeFees": 1596,
            "totalProjectCost": 152797,
            "cashIn": 72997,
            "gdv": 153125,
            "refinanceLtv": 0.75,
            "refinanceAmount": 114844,
            "cashOut": 35044,
            "capitalStuck": 37953,
            "pullOutPct": 48
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 108300,
            "refurb": 21381,
            "purchaseCosts": 3791,
            "totalProjectCost": 133472,
            "cashIn": 133472,
            "gdv": 179755,
            "refinanceLtv": 0.75,
            "refinanceAmount": 134816,
            "cashOut": 133472,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 110580,
            "refurb": 23240,
            "purchaseCosts": 3870,
            "totalProjectCost": 137690,
            "cashIn": 137690,
            "gdv": 166440,
            "refinanceLtv": 0.75,
            "refinanceAmount": 124830,
            "cashOut": 124830,
            "capitalStuck": 12860,
            "pullOutPct": 91
          },
          "worst": {
            "purchasePrice": 114000,
            "refurb": 26029,
            "purchaseCosts": 3990,
            "totalProjectCost": 144019,
            "cashIn": 144019,
            "gdv": 153125,
            "refinanceLtv": 0.75,
            "refinanceAmount": 114844,
            "cashOut": 114844,
            "capitalStuck": 29175,
            "pullOutPct": 80
          }
        },
        "quality": "good",
        "capitalStuckBase": 21375
      },
      "income": {
        "airbnb75th": 2888,
        "councilLeaseLhaPct": 76,
        "councilLeaseMonthly": 823,
        "hybridMonthly": 1649,
        "lhaWeekly": 250,
        "notes": "Airbnb 75th percentile for 4-bed in M19. Council lease modelled at 76% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction",
          "Selective licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 118,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [
          "motivated seller"
        ],
        "crimeScore": 7,
        "ofstedRating": "Outstanding",
        "transportScore": 9,
        "greenSpaceScore": 8,
        "dealQualityScore": 6,
        "reasoning": "Solid numbers with acceptable capital left in; watch refurb overruns and local licensing."
      }
    }
  },
  {
    "id": "deal-042",
    "address": "30 Claremont Road, Clayton",
    "postcode": "M11 6KW",
    "city": "manchester",
    "area": "M11",
    "price": 194000,
    "sqft": 758,
    "beds": 4,
    "baths": 1,
    "propertyType": "End-terrace",
    "photos": [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-42",
    "description": "4-bed terraced in Clayton / Openshaw with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.47823,
      "lng": -2.165
    },
    "tenure": "freehold",
    "targetBeds": 5,
    "gdv": 236680,
    "capitalStuck": 85653,
    "monthlyIncome": 1535,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 131437,
    "createdAt": "2026-08-01",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 758,
        "ageCategory": "1919-1945"
      },
      "conversion": {
        "score": 6,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 236680,
        "sampleSize": 4,
        "gdvRealistic": 236680,
        "gdvStretch": 255614,
        "gdvConservative": 217746,
        "comps": [
          {
            "address": "75 Stockport Road",
            "postcode": "M11 6GO",
            "price": 216718,
            "beds": 5,
            "sqft": 766,
            "soldDate": "2025-02-18",
            "distanceMiles": 0.77
          },
          {
            "address": "31 Barlow Road",
            "postcode": "M11 2XO",
            "price": 219088,
            "beds": 5,
            "sqft": 708,
            "soldDate": "2025-01-28",
            "distanceMiles": 0.74
          },
          {
            "address": "126 Hyde Road",
            "postcode": "M11 2CQ",
            "price": 237678,
            "beds": 5,
            "sqft": 798,
            "soldDate": "2025-08-21",
            "distanceMiles": 0.61
          },
          {
            "address": "127 Wilmslow Road",
            "postcode": "M11 8NE",
            "price": 235962,
            "beds": 5,
            "sqft": 671,
            "soldDate": "2025-03-20",
            "distanceMiles": 0.23
          }
        ]
      },
      "refurb": {
        "kitchen": 11180,
        "bathrooms": 7194,
        "flooring": 2799,
        "paint": 2008,
        "electrics": 4247,
        "boiler": 3127,
        "roof": 3434,
        "damp": 1579,
        "bedroomConversion": 6885,
        "saFinish": 4424,
        "contingencyPct": 15,
        "contingencyAmount": 7031,
        "total": 53907
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 184300,
            "refurb": 49594,
            "purchaseCosts": 6451,
            "bridgeInterest": 11611,
            "bridgeFees": 2580,
            "totalProjectCost": 254536,
            "cashIn": 125526,
            "gdv": 255614,
            "refinanceLtv": 0.75,
            "refinanceAmount": 191711,
            "cashOut": 62701,
            "capitalStuck": 62825,
            "pullOutPct": 50
          },
          "base": {
            "purchasePrice": 188180,
            "refurb": 53907,
            "purchaseCosts": 6586,
            "bridgeInterest": 11855,
            "bridgeFees": 2635,
            "totalProjectCost": 263163,
            "cashIn": 131437,
            "gdv": 236680,
            "refinanceLtv": 0.75,
            "refinanceAmount": 177510,
            "cashOut": 45784,
            "capitalStuck": 85653,
            "pullOutPct": 35
          },
          "worst": {
            "purchasePrice": 194000,
            "refurb": 60376,
            "purchaseCosts": 6790,
            "bridgeInterest": 12222,
            "bridgeFees": 2716,
            "totalProjectCost": 276104,
            "cashIn": 140304,
            "gdv": 217746,
            "refinanceLtv": 0.75,
            "refinanceAmount": 163310,
            "cashOut": 27510,
            "capitalStuck": 112794,
            "pullOutPct": 20
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 184300,
            "refurb": 49594,
            "purchaseCosts": 6451,
            "totalProjectCost": 240345,
            "cashIn": 240345,
            "gdv": 255614,
            "refinanceLtv": 0.75,
            "refinanceAmount": 191711,
            "cashOut": 191711,
            "capitalStuck": 48634,
            "pullOutPct": 80
          },
          "base": {
            "purchasePrice": 188180,
            "refurb": 53907,
            "purchaseCosts": 6586,
            "totalProjectCost": 248673,
            "cashIn": 248673,
            "gdv": 236680,
            "refinanceLtv": 0.75,
            "refinanceAmount": 177510,
            "cashOut": 177510,
            "capitalStuck": 71163,
            "pullOutPct": 71
          },
          "worst": {
            "purchasePrice": 194000,
            "refurb": 60376,
            "purchaseCosts": 6790,
            "totalProjectCost": 261166,
            "cashIn": 261166,
            "gdv": 217746,
            "refinanceLtv": 0.75,
            "refinanceAmount": 163310,
            "cashOut": 163310,
            "capitalStuck": 97856,
            "pullOutPct": 63
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 85653
      },
      "income": {
        "airbnb75th": 2490,
        "councilLeaseLhaPct": 84,
        "councilLeaseMonthly": 899,
        "hybridMonthly": 1535,
        "lhaWeekly": 247,
        "notes": "Airbnb 75th percentile for 5-bed in M11. Council lease modelled at 84% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 2,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 117,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 8,
        "ofstedRating": "Outstanding",
        "transportScore": 7,
        "greenSpaceScore": 6,
        "dealQualityScore": 5,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-043",
    "address": "121 Mauldeth Road, Cheetham",
    "postcode": "M8 3YQ",
    "city": "manchester",
    "area": "M8",
    "price": 123000,
    "sqft": 839,
    "beds": 3,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-43",
    "description": "3-bed terraced in Cheetham / Crumpsall with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.51522,
      "lng": -2.24902
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 201720,
    "capitalStuck": 4544,
    "monthlyIncome": 1918,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 72317,
    "createdAt": "2026-09-14",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 839,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 201720,
        "sampleSize": 6,
        "gdvRealistic": 201720,
        "gdvStretch": 217858,
        "gdvConservative": 185582,
        "comps": [
          {
            "address": "137 Plymouth Grove",
            "postcode": "M8 7AZ",
            "price": 203850,
            "beds": 4,
            "sqft": 844,
            "soldDate": "2025-08-28",
            "distanceMiles": 0.06
          },
          {
            "address": "41 Rochdale Road",
            "postcode": "M8 8LY",
            "price": 214740,
            "beds": 4,
            "sqft": 773,
            "soldDate": "2025-08-20",
            "distanceMiles": 0.6
          },
          {
            "address": "90 Mauldeth Road",
            "postcode": "M8 2FJ",
            "price": 205436,
            "beds": 4,
            "sqft": 761,
            "soldDate": "2025-10-07",
            "distanceMiles": 0.11
          },
          {
            "address": "142 Burnage Lane",
            "postcode": "M8 7BF",
            "price": 192702,
            "beds": 4,
            "sqft": 759,
            "soldDate": "2025-06-17",
            "distanceMiles": 0.3
          },
          {
            "address": "62 Stockport Road",
            "postcode": "M8 1KK",
            "price": 195429,
            "beds": 4,
            "sqft": 983,
            "soldDate": "2025-06-22",
            "distanceMiles": 0.42
          },
          {
            "address": "90 Burnage Lane",
            "postcode": "M8 6AM",
            "price": 219320,
            "beds": 4,
            "sqft": 865,
            "soldDate": "2025-03-03",
            "distanceMiles": 0.17
          }
        ]
      },
      "refurb": {
        "kitchen": 5341,
        "bathrooms": 2369,
        "flooring": 2274,
        "paint": 1524,
        "electrics": 1498,
        "boiler": 1747,
        "roof": 1123,
        "damp": 3,
        "bedroomConversion": 1845,
        "saFinish": 2414,
        "contingencyPct": 15,
        "contingencyAmount": 3021,
        "total": 23161
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 116850,
            "refurb": 21308,
            "purchaseCosts": 4090,
            "bridgeInterest": 7362,
            "bridgeFees": 1636,
            "totalProjectCost": 151246,
            "cashIn": 69451,
            "gdv": 217858,
            "refinanceLtv": 0.75,
            "refinanceAmount": 163394,
            "cashOut": 81599,
            "capitalStuck": 0,
            "pullOutPct": 117
          },
          "base": {
            "purchasePrice": 119310,
            "refurb": 23161,
            "purchaseCosts": 4176,
            "bridgeInterest": 7517,
            "bridgeFees": 1670,
            "totalProjectCost": 155834,
            "cashIn": 72317,
            "gdv": 201720,
            "refinanceLtv": 0.75,
            "refinanceAmount": 151290,
            "cashOut": 67773,
            "capitalStuck": 4544,
            "pullOutPct": 94
          },
          "worst": {
            "purchasePrice": 123000,
            "refurb": 25940,
            "purchaseCosts": 4305,
            "bridgeInterest": 7749,
            "bridgeFees": 1722,
            "totalProjectCost": 162716,
            "cashIn": 76616,
            "gdv": 185582,
            "refinanceLtv": 0.75,
            "refinanceAmount": 139187,
            "cashOut": 53087,
            "capitalStuck": 23529,
            "pullOutPct": 69
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 116850,
            "refurb": 21308,
            "purchaseCosts": 4090,
            "totalProjectCost": 142248,
            "cashIn": 142248,
            "gdv": 217858,
            "refinanceLtv": 0.75,
            "refinanceAmount": 163394,
            "cashOut": 142248,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 119310,
            "refurb": 23161,
            "purchaseCosts": 4176,
            "totalProjectCost": 146647,
            "cashIn": 146647,
            "gdv": 201720,
            "refinanceLtv": 0.75,
            "refinanceAmount": 151290,
            "cashOut": 146647,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "worst": {
            "purchasePrice": 123000,
            "refurb": 25940,
            "purchaseCosts": 4305,
            "totalProjectCost": 153245,
            "cashIn": 153245,
            "gdv": 185582,
            "refinanceLtv": 0.75,
            "refinanceAmount": 139187,
            "cashOut": 139187,
            "capitalStuck": 14058,
            "pullOutPct": 91
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 4544
      },
      "income": {
        "airbnb75th": 3311,
        "councilLeaseLhaPct": 83,
        "councilLeaseMonthly": 989,
        "hybridMonthly": 1918,
        "lhaWeekly": 275,
        "notes": "Airbnb 75th percentile for 4-bed in M8. Council lease modelled at 83% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": true,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction",
          "Selective licensing",
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 120,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [
          "probate"
        ],
        "crimeScore": 5,
        "ofstedRating": "N/A",
        "transportScore": 8,
        "greenSpaceScore": 7,
        "dealQualityScore": 9,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  },
  {
    "id": "deal-044",
    "address": "18 Burnage Lane, Fallowfield",
    "postcode": "M14 4JH",
    "city": "manchester",
    "area": "M14",
    "price": 148000,
    "sqft": 1194,
    "beds": 3,
    "baths": 2,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba36295?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-44",
    "description": "3-bed terraced in Fallowfield / Rusholme with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.44958,
      "lng": -2.21853
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 199800,
    "capitalStuck": 39407,
    "monthlyIncome": 1867,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 88765,
    "createdAt": "2026-03-20",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": false,
        "sqft": 1194,
        "ageCategory": "post-1980"
      },
      "conversion": {
        "score": 6,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 199800,
        "sampleSize": 4,
        "gdvRealistic": 199800,
        "gdvStretch": 215784,
        "gdvConservative": 183816,
        "comps": [
          {
            "address": "36 Oxford Road",
            "postcode": "M14 4KQ",
            "price": 206378,
            "beds": 4,
            "sqft": 1251,
            "soldDate": "2025-04-20",
            "distanceMiles": 0.3
          },
          {
            "address": "34 Burnage Lane",
            "postcode": "M14 1ET",
            "price": 187618,
            "beds": 4,
            "sqft": 1206,
            "soldDate": "2025-07-02",
            "distanceMiles": 0.05
          },
          {
            "address": "35 Barlow Road",
            "postcode": "M14 7XP",
            "price": 217106,
            "beds": 4,
            "sqft": 1238,
            "soldDate": "2025-07-18",
            "distanceMiles": 0.21
          },
          {
            "address": "92 Slade Lane",
            "postcode": "M14 7LQ",
            "price": 179101,
            "beds": 4,
            "sqft": 1244,
            "soldDate": "2025-12-28",
            "distanceMiles": 0.8
          }
        ]
      },
      "refurb": {
        "kitchen": 4979,
        "bathrooms": 2103,
        "flooring": 1849,
        "paint": 1338,
        "electrics": 2778,
        "boiler": 1227,
        "roof": 3099,
        "damp": 1089,
        "bedroomConversion": 3582,
        "saFinish": 3711,
        "contingencyPct": 15,
        "contingencyAmount": 3863,
        "total": 29618
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 140600,
            "refurb": 27249,
            "purchaseCosts": 4921,
            "bridgeInterest": 8858,
            "bridgeFees": 1968,
            "totalProjectCost": 183596,
            "cashIn": 85176,
            "gdv": 215784,
            "refinanceLtv": 0.75,
            "refinanceAmount": 161838,
            "cashOut": 63418,
            "capitalStuck": 21758,
            "pullOutPct": 74
          },
          "base": {
            "purchasePrice": 143560,
            "refurb": 29618,
            "purchaseCosts": 5025,
            "bridgeInterest": 9044,
            "bridgeFees": 2010,
            "totalProjectCost": 189257,
            "cashIn": 88765,
            "gdv": 199800,
            "refinanceLtv": 0.75,
            "refinanceAmount": 149850,
            "cashOut": 49358,
            "capitalStuck": 39407,
            "pullOutPct": 56
          },
          "worst": {
            "purchasePrice": 148000,
            "refurb": 33172,
            "purchaseCosts": 5180,
            "bridgeInterest": 9324,
            "bridgeFees": 2072,
            "totalProjectCost": 197748,
            "cashIn": 94148,
            "gdv": 183816,
            "refinanceLtv": 0.75,
            "refinanceAmount": 137862,
            "cashOut": 34262,
            "capitalStuck": 59886,
            "pullOutPct": 36
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 140600,
            "refurb": 27249,
            "purchaseCosts": 4921,
            "totalProjectCost": 172770,
            "cashIn": 172770,
            "gdv": 215784,
            "refinanceLtv": 0.75,
            "refinanceAmount": 161838,
            "cashOut": 161838,
            "capitalStuck": 10932,
            "pullOutPct": 94
          },
          "base": {
            "purchasePrice": 143560,
            "refurb": 29618,
            "purchaseCosts": 5025,
            "totalProjectCost": 178203,
            "cashIn": 178203,
            "gdv": 199800,
            "refinanceLtv": 0.75,
            "refinanceAmount": 149850,
            "cashOut": 149850,
            "capitalStuck": 28353,
            "pullOutPct": 84
          },
          "worst": {
            "purchasePrice": 148000,
            "refurb": 33172,
            "purchaseCosts": 5180,
            "totalProjectCost": 186352,
            "cashIn": 186352,
            "gdv": 183816,
            "refinanceLtv": 0.75,
            "refinanceAmount": 137862,
            "cashOut": 137862,
            "capitalStuck": 48490,
            "pullOutPct": 74
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 39407
      },
      "income": {
        "airbnb75th": 3491,
        "councilLeaseLhaPct": 77,
        "councilLeaseMonthly": 784,
        "hybridMonthly": 1867,
        "lhaWeekly": 235,
        "notes": "Airbnb 75th percentile for 4-bed in M14. Council lease modelled at 77% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": false,
        "additionalHmo": true,
        "conservation": false,
        "floodZone": 1,
        "flags": [
          "Article 4 direction",
          "Additional HMO licensing"
        ]
      },
      "risk": {
        "daysOnMarket": 169,
        "priceReductions": 2,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 8,
        "ofstedRating": "N/A",
        "transportScore": 6,
        "greenSpaceScore": 4,
        "dealQualityScore": 5,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-045",
    "address": "195 Breck Road, Anfield",
    "postcode": "L4 9OD",
    "city": "liverpool",
    "area": "L4",
    "price": 170000,
    "sqft": 712,
    "beds": 3,
    "baths": 2,
    "propertyType": "Terraced",
    "photos": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-45",
    "description": "3-bed terraced in Anfield / Walton with strong potential to reconfigure to 4 bedrooms. Ideal BRRR candidate with freehold tenure.",
    "coords": {
      "lat": 53.4264,
      "lng": -2.97116
    },
    "tenure": "freehold",
    "targetBeds": 4,
    "gdv": 200600,
    "capitalStuck": 83319,
    "monthlyIncome": 1692,
    "quality": "marginal",
    "capitalTag": "jv_required",
    "cashInBase": 118339,
    "createdAt": "2026-01-08",
    "layers": {
      "physical": {
        "tenure": "freehold",
        "floorplanPresent": true,
        "sqft": 712,
        "ageCategory": "pre-1919"
      },
      "conversion": {
        "score": 6,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 3,
        "targetBeds": 4,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 200600,
        "sampleSize": 6,
        "gdvRealistic": 200600,
        "gdvStretch": 216648,
        "gdvConservative": 184552,
        "comps": [
          {
            "address": "85 West Derby Road",
            "postcode": "L4 7JE",
            "price": 189657,
            "beds": 4,
            "sqft": 768,
            "soldDate": "2025-02-23",
            "distanceMiles": 0.77
          },
          {
            "address": "85 Mill Street",
            "postcode": "L4 5VO",
            "price": 208971,
            "beds": 4,
            "sqft": 689,
            "soldDate": "2025-07-10",
            "distanceMiles": 0.15
          },
          {
            "address": "42 Prescot Road",
            "postcode": "L4 6QQ",
            "price": 194916,
            "beds": 4,
            "sqft": 796,
            "soldDate": "2025-12-19",
            "distanceMiles": 0.39
          },
          {
            "address": "130 Edge Lane",
            "postcode": "L4 6OR",
            "price": 178664,
            "beds": 4,
            "sqft": 708,
            "soldDate": "2025-03-07",
            "distanceMiles": 0.2
          },
          {
            "address": "46 Park Road",
            "postcode": "L4 8PT",
            "price": 191897,
            "beds": 4,
            "sqft": 697,
            "soldDate": "2025-10-28",
            "distanceMiles": 0.32
          },
          {
            "address": "50 Smithdown Road",
            "postcode": "L4 3FK",
            "price": 215558,
            "beds": 4,
            "sqft": 740,
            "soldDate": "2025-11-18",
            "distanceMiles": 0.16
          }
        ]
      },
      "refurb": {
        "kitchen": 7456,
        "bathrooms": 4235,
        "flooring": 4267,
        "paint": 2568,
        "electrics": 1701,
        "boiler": 617,
        "roof": 1972,
        "damp": 4022,
        "bedroomConversion": 10124,
        "saFinish": 6862,
        "contingencyPct": 15,
        "contingencyAmount": 6575,
        "total": 50399
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 161500,
            "refurb": 46367,
            "purchaseCosts": 5653,
            "bridgeInterest": 10175,
            "bridgeFees": 2261,
            "totalProjectCost": 225956,
            "cashIn": 112906,
            "gdv": 216648,
            "refinanceLtv": 0.75,
            "refinanceAmount": 162486,
            "cashOut": 49436,
            "capitalStuck": 63470,
            "pullOutPct": 44
          },
          "base": {
            "purchasePrice": 164900,
            "refurb": 50399,
            "purchaseCosts": 5772,
            "bridgeInterest": 10389,
            "bridgeFees": 2309,
            "totalProjectCost": 233769,
            "cashIn": 118339,
            "gdv": 200600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 150450,
            "cashOut": 35020,
            "capitalStuck": 83319,
            "pullOutPct": 30
          },
          "worst": {
            "purchasePrice": 170000,
            "refurb": 56447,
            "purchaseCosts": 5950,
            "bridgeInterest": 10710,
            "bridgeFees": 2380,
            "totalProjectCost": 245487,
            "cashIn": 126487,
            "gdv": 184552,
            "refinanceLtv": 0.75,
            "refinanceAmount": 138414,
            "cashOut": 19414,
            "capitalStuck": 107073,
            "pullOutPct": 15
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 161500,
            "refurb": 46367,
            "purchaseCosts": 5653,
            "totalProjectCost": 213520,
            "cashIn": 213520,
            "gdv": 216648,
            "refinanceLtv": 0.75,
            "refinanceAmount": 162486,
            "cashOut": 162486,
            "capitalStuck": 51034,
            "pullOutPct": 76
          },
          "base": {
            "purchasePrice": 164900,
            "refurb": 50399,
            "purchaseCosts": 5772,
            "totalProjectCost": 221071,
            "cashIn": 221071,
            "gdv": 200600,
            "refinanceLtv": 0.75,
            "refinanceAmount": 150450,
            "cashOut": 150450,
            "capitalStuck": 70621,
            "pullOutPct": 68
          },
          "worst": {
            "purchasePrice": 170000,
            "refurb": 56447,
            "purchaseCosts": 5950,
            "totalProjectCost": 232397,
            "cashIn": 232397,
            "gdv": 184552,
            "refinanceLtv": 0.75,
            "refinanceAmount": 138414,
            "cashOut": 138414,
            "capitalStuck": 93983,
            "pullOutPct": 60
          }
        },
        "quality": "marginal",
        "capitalStuckBase": 83319
      },
      "income": {
        "airbnb75th": 3056,
        "councilLeaseLhaPct": 86,
        "councilLeaseMonthly": 783,
        "hybridMonthly": 1692,
        "lhaWeekly": 210,
        "notes": "Airbnb 75th percentile for 4-bed in L4. Council lease modelled at 86% of LHA."
      },
      "regulatory": {
        "article4": true,
        "selectiveLicensing": true,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 3,
        "flags": [
          "Article 4 direction",
          "Selective licensing",
          "Flood zone 3"
        ]
      },
      "risk": {
        "daysOnMarket": 34,
        "priceReductions": 2,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 7,
        "ofstedRating": "Requires Improvement",
        "transportScore": 5,
        "greenSpaceScore": 4,
        "dealQualityScore": 5,
        "reasoning": "Higher capital stuck or weaker uplift — only proceed with JV capital or renegotiated purchase price."
      }
    }
  },
  {
    "id": "deal-046",
    "address": "171 Aigburth Road, Everton",
    "postcode": "L5 1XF",
    "city": "liverpool",
    "area": "L5",
    "price": 108000,
    "sqft": 790,
    "beds": 4,
    "baths": 1,
    "propertyType": "Semi-detached",
    "photos": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"
    ],
    "listingUrl": "https://www.rightmove.co.uk/properties/mock-46",
    "description": "4-bed terraced in Everton / Kirkdale with strong potential to reconfigure to 5 bedrooms. Ideal BRRR candidate with leasehold tenure.",
    "coords": {
      "lat": 53.42621,
      "lng": -2.97557
    },
    "tenure": "leasehold",
    "targetBeds": 5,
    "gdv": 166320,
    "capitalStuck": 13608,
    "monthlyIncome": 1412,
    "quality": "excellent",
    "capitalTag": "jv_recommended",
    "cashInBase": 65016,
    "createdAt": "2026-08-27",
    "layers": {
      "physical": {
        "tenure": "leasehold",
        "floorplanPresent": true,
        "sqft": 790,
        "ageCategory": "pre-1919",
        "leaseYearsRemaining": 111
      },
      "conversion": {
        "score": 8,
        "positives": [
          "Through-lounge easily split for extra bedroom",
          "Rear extension footprint supports WC conversion",
          "Compact but workable layout"
        ],
        "negatives": [
          "Bathroom on ground floor only"
        ],
        "currentBeds": 4,
        "targetBeds": 5,
        "conversionNotes": "Internal reconfiguration to add a bedroom via lounge split. Building regs for fire doors and escape routes required."
      },
      "soldComps": {
        "median": 166320,
        "sampleSize": 7,
        "gdvRealistic": 166320,
        "gdvStretch": 179626,
        "gdvConservative": 153014,
        "comps": [
          {
            "address": "116 Edge Lane",
            "postcode": "L5 5GD",
            "price": 151096,
            "beds": 5,
            "sqft": 892,
            "soldDate": "2025-07-08",
            "distanceMiles": 0.66
          },
          {
            "address": "42 Smithdown Road",
            "postcode": "L5 3ZQ",
            "price": 152739,
            "beds": 5,
            "sqft": 807,
            "soldDate": "2025-08-12",
            "distanceMiles": 0.58
          },
          {
            "address": "114 Mill Street",
            "postcode": "L5 7MZ",
            "price": 179915,
            "beds": 5,
            "sqft": 738,
            "soldDate": "2025-10-08",
            "distanceMiles": 0.61
          },
          {
            "address": "72 Walton Lane",
            "postcode": "L5 2UL",
            "price": 150397,
            "beds": 5,
            "sqft": 698,
            "soldDate": "2025-06-18",
            "distanceMiles": 0.57
          },
          {
            "address": "96 Belmont Road",
            "postcode": "L5 5WM",
            "price": 144126,
            "beds": 5,
            "sqft": 754,
            "soldDate": "2025-09-02",
            "distanceMiles": 0.67
          },
          {
            "address": "34 Park Road",
            "postcode": "L5 1NG",
            "price": 147181,
            "beds": 5,
            "sqft": 850,
            "soldDate": "2025-02-13",
            "distanceMiles": 0.53
          },
          {
            "address": "55 Aigburth Road",
            "postcode": "L5 4MZ",
            "price": 178590,
            "beds": 5,
            "sqft": 757,
            "soldDate": "2025-01-24",
            "distanceMiles": 0.41
          }
        ]
      },
      "refurb": {
        "kitchen": 3835,
        "bathrooms": 3456,
        "flooring": 1027,
        "paint": 597,
        "electrics": 1043,
        "boiler": 1307,
        "roof": 2474,
        "damp": 1709,
        "bedroomConversion": 2144,
        "saFinish": 1413,
        "contingencyPct": 15,
        "contingencyAmount": 2850,
        "total": 21854
      },
      "financial": {
        "bridgeBrrr": {
          "best": {
            "purchasePrice": 102600,
            "refurb": 20106,
            "purchaseCosts": 3591,
            "bridgeInterest": 6464,
            "bridgeFees": 1436,
            "totalProjectCost": 134197,
            "cashIn": 62377,
            "gdv": 179626,
            "refinanceLtv": 0.75,
            "refinanceAmount": 134720,
            "cashOut": 62900,
            "capitalStuck": 0,
            "pullOutPct": 101
          },
          "base": {
            "purchasePrice": 104760,
            "refurb": 21854,
            "purchaseCosts": 3667,
            "bridgeInterest": 6600,
            "bridgeFees": 1467,
            "totalProjectCost": 138348,
            "cashIn": 65016,
            "gdv": 166320,
            "refinanceLtv": 0.75,
            "refinanceAmount": 124740,
            "cashOut": 51408,
            "capitalStuck": 13608,
            "pullOutPct": 79
          },
          "worst": {
            "purchasePrice": 108000,
            "refurb": 24476,
            "purchaseCosts": 3780,
            "bridgeInterest": 6804,
            "bridgeFees": 1512,
            "totalProjectCost": 144572,
            "cashIn": 68972,
            "gdv": 153014,
            "refinanceLtv": 0.75,
            "refinanceAmount": 114761,
            "cashOut": 39161,
            "capitalStuck": 29811,
            "pullOutPct": 57
          }
        },
        "cashRefi": {
          "best": {
            "purchasePrice": 102600,
            "refurb": 20106,
            "purchaseCosts": 3591,
            "totalProjectCost": 126297,
            "cashIn": 126297,
            "gdv": 179626,
            "refinanceLtv": 0.75,
            "refinanceAmount": 134720,
            "cashOut": 126297,
            "capitalStuck": 0,
            "pullOutPct": 100
          },
          "base": {
            "purchasePrice": 104760,
            "refurb": 21854,
            "purchaseCosts": 3667,
            "totalProjectCost": 130281,
            "cashIn": 130281,
            "gdv": 166320,
            "refinanceLtv": 0.75,
            "refinanceAmount": 124740,
            "cashOut": 124740,
            "capitalStuck": 5541,
            "pullOutPct": 96
          },
          "worst": {
            "purchasePrice": 108000,
            "refurb": 24476,
            "purchaseCosts": 3780,
            "totalProjectCost": 136256,
            "cashIn": 136256,
            "gdv": 153014,
            "refinanceLtv": 0.75,
            "refinanceAmount": 114761,
            "cashOut": 114761,
            "capitalStuck": 21495,
            "pullOutPct": 84
          }
        },
        "quality": "excellent",
        "capitalStuckBase": 13608
      },
      "income": {
        "airbnb75th": 2368,
        "councilLeaseLhaPct": 82,
        "councilLeaseMonthly": 775,
        "hybridMonthly": 1412,
        "lhaWeekly": 218,
        "notes": "Airbnb 75th percentile for 5-bed in L5. Council lease modelled at 82% of LHA."
      },
      "regulatory": {
        "article4": false,
        "selectiveLicensing": false,
        "additionalHmo": false,
        "conservation": false,
        "floodZone": 1,
        "flags": []
      },
      "risk": {
        "daysOnMarket": 175,
        "priceReductions": 1,
        "auction": false,
        "distressedKeywords": [],
        "crimeScore": 5,
        "ofstedRating": "Good",
        "transportScore": 8,
        "greenSpaceScore": 3,
        "dealQualityScore": 8,
        "reasoning": "Strong GDV uplift vs modest capital stuck; conversion looks straightforward and comps support exit."
      }
    }
  }
];

export function getDealById(id: string): Deal | undefined {
  return MOCK_DEALS.find((d) => d.id === id);
}

export function getAllDeals(): Deal[] {
  return MOCK_DEALS;
}
