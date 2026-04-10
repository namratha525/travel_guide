// backend/routes/flights.js
import express from "express";
const router = express.Router();

// ── Airport data ──────────────────────────────────────────────────────────────
const AIRPORTS = {
  DEL: { name: "Indira Gandhi International", city: "Delhi",     code: "DEL" },
  BOM: { name: "Chhatrapati Shivaji Maharaj", city: "Mumbai",    code: "BOM" },
  MAA: { name: "Chennai International",        city: "Chennai",   code: "MAA" },
  BLR: { name: "Kempegowda International",     city: "Bangalore", code: "BLR" },
  CCU: { name: "Netaji Subhas Chandra Bose",   city: "Kolkata",   code: "CCU" },
  HYD: { name: "Rajiv Gandhi International",   city: "Hyderabad", code: "HYD" },
  COK: { name: "Cochin International",         city: "Kochi",     code: "COK" },
  JAI: { name: "Jaipur International",         city: "Jaipur",    code: "JAI" },
  SXR: { name: "Sheikh ul Alam International", city: "Srinagar",  code: "SXR" },
  IXB: { name: "Bagdogra Airport",             city: "Bagdogra",  code: "IXB" },
  PAT: { name: "Jay Prakash Narayan",          city: "Patna",     code: "PAT" },
  VNS: { name: "Lal Bahadur Shastri",          city: "Varanasi",  code: "VNS" },
  AMD: { name: "Sardar Vallabhbhai Patel",     city: "Ahmedabad", code: "AMD" },
  BHO: { name: "Raja Bhoj Airport",            city: "Bhopal",    code: "BHO" },
  GOI: { name: "Goa International",            city: "Goa",       code: "GOI" },
  IXC: { name: "Chandigarh Airport",           city: "Chandigarh",code: "IXC" },
  PNQ: { name: "Pune Airport",                 city: "Pune",      code: "PNQ" },
  IXZ: { name: "Veer Savarkar International",  city: "Port Blair", code: "IXZ" },
};

const CITY_TO_CODE = {
  delhi: "DEL", "new delhi": "DEL",
  mumbai: "BOM", bombay: "BOM",
  chennai: "MAA", madras: "MAA",
  bangalore: "BLR", bengaluru: "BLR",
  kolkata: "CCU", calcutta: "CCU",
  hyderabad: "HYD",
  kochi: "COK", cochin: "COK", kerala: "COK",
  jaipur: "JAI", rajasthan: "JAI",
  srinagar: "SXR", kashmir: "SXR",
  darjeeling: "IXB", bagdogra: "IXB", sikkim: "IXB",
  patna: "PAT", bihar: "PAT",
  varanasi: "VNS", banaras: "VNS",
  ahmedabad: "AMD", gujarat: "AMD",
  bhopal: "BHO",
  goa: "GOI", panaji: "GOI",
  chandigarh: "IXC", manali: "IXC", shimla: "IXC",
  pune: "PNQ",
  "port blair": "IXZ", andaman: "IXZ",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function resolveCode(cityInput) {
  if (!cityInput) return null;
  const lower = cityInput.toLowerCase().trim();
  if (AIRPORTS[lower.toUpperCase()]) return lower.toUpperCase();
  return CITY_TO_CODE[lower] || null;
}

function addMinutes(timeStr, mins) {
  const [h, m] = timeStr.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── Flights ───────────────────────────────────────────────────────────────────
const AIRLINES = [
  { name: "IndiGo",        code: "6E", multiplier: 1.0  },
  { name: "Air India",     code: "AI", multiplier: 1.4  },
  { name: "SpiceJet",      code: "SG", multiplier: 0.9  },
  { name: "Vistara",       code: "UK", multiplier: 1.3  },
  { name: "GoFirst",       code: "G8", multiplier: 0.85 },
  { name: "AirAsia India", code: "I5", multiplier: 0.95 },
];

function basePriceForRoute(origin, dest) {
  const distanceMap = {
    "DEL-BOM": 5500, "DEL-MAA": 6200, "DEL-BLR": 5800, "DEL-CCU": 4800,
    "DEL-HYD": 5200, "DEL-COK": 6800, "DEL-JAI": 2200, "DEL-SXR": 3500,
    "DEL-IXB": 5000, "DEL-VNS": 2800, "DEL-GOI": 5500, "DEL-IXC": 2000,
    "DEL-IXZ": 9500, "DEL-AMD": 4200,
    "BOM-MAA": 3800, "BOM-BLR": 3200, "BOM-CCU": 5500, "BOM-HYD": 3000,
    "BOM-COK": 4200, "BOM-GOI": 2500, "BOM-AMD": 2200,
    "MAA-BLR": 2200, "MAA-COK": 2800, "MAA-HYD": 2500,
    "BLR-HYD": 2200, "BLR-COK": 2800, "BLR-GOI": 3200,
    "CCU-IXB": 2200, "CCU-PAT": 2000, "CCU-VNS": 2500,
    "HYD-COK": 3200, "HYD-MAA": 2500,
  };
  const key1 = `${origin}-${dest}`;
  const key2 = `${dest}-${origin}`;
  return distanceMap[key1] || distanceMap[key2] || 4500;
}

function generateFlights(originCode, destCode, dateStr) {
  const base = basePriceForRoute(originCode, destCode);
  const departureTimes = ["05:30","07:15","09:45","11:20","13:05","15:40","17:25","19:10","21:00"];
  const durationMins = randomBetween(75, 180);

  return AIRLINES.slice(0, randomBetween(3, 5)).map((airline, i) => {
    const depTime = departureTimes[i % departureTimes.length];
    const arrTime = addMinutes(depTime, durationMins + randomBetween(-10, 20));
    const price   = Math.round(base * airline.multiplier * (0.9 + Math.random() * 0.3));
    const flightNum = `${airline.code}${randomBetween(100, 999)}`;

    return {
      id: `FL-${flightNum}-${dateStr}`,
      type: "flight",
      airline: airline.name,
      flightNumber: flightNum,
      origin: originCode,
      destination: destCode,
      originCity: AIRPORTS[originCode]?.city || originCode,
      destinationCity: AIRPORTS[destCode]?.city || destCode,
      departure: depTime,
      arrival: arrTime,
      duration: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
      price,
      class: "Economy",
      seatsLeft: randomBetween(4, 42),
      stops: 0,
      baggage: "15 kg",
      date: dateStr,
    };
  }).sort((a, b) => a.price - b.price);
}

// ── Trains ────────────────────────────────────────────────────────────────────
const TRAIN_ROUTES = {
  "DEL-JAI": [
    { name: "Shatabdi Express", number: "12015", dep: "06:00", arr: "10:25", dur: "4h 25m" },
    { name: "Ajmer Shatabdi",   number: "12061", dep: "15:05", arr: "19:30", dur: "4h 25m" },
    { name: "Double Decker",    number: "12985", dep: "19:35", arr: "23:50", dur: "4h 15m" },
  ],
  "DEL-BOM": [
    { name: "Rajdhani Express", number: "12951", dep: "16:55", arr: "08:15", dur: "15h 20m" },
    { name: "August Kranti",    number: "12953", dep: "17:40", arr: "10:55", dur: "17h 15m" },
  ],
  "DEL-MAA": [
    { name: "Tamil Nadu Exp",   number: "12621", dep: "22:30", arr: "07:10", dur: "32h 40m" },
    { name: "GT Express",       number: "12615", dep: "06:30", arr: "19:30", dur: "37h 00m" },
  ],
  "DEL-BLR": [
    { name: "Rajdhani Express", number: "12429", dep: "20:00", arr: "05:45", dur: "33h 45m" },
    { name: "Karnataka Exp",    number: "12627", dep: "22:35", arr: "10:00", dur: "35h 25m" },
  ],
  "DEL-CCU": [
    { name: "Rajdhani Express", number: "12301", dep: "16:55", arr: "10:00", dur: "17h 05m" },
    { name: "Poorva Express",   number: "12303", dep: "08:00", arr: "05:45", dur: "21h 45m" },
  ],
  "DEL-HYD": [
    { name: "Telangana Exp",    number: "12723", dep: "06:15", arr: "05:45", dur: "23h 30m" },
  ],
  "DEL-VNS": [
    { name: "Shiv Ganga Exp",   number: "12559", dep: "19:30", arr: "06:55", dur: "11h 25m" },
    { name: "Kashi Vishwanath", number: "15127", dep: "23:30", arr: "14:45", dur: "15h 15m" },
  ],
  "DEL-IXC": [
    { name: "Shatabdi Express", number: "12011", dep: "07:40", arr: "11:15", dur: "3h 35m" },
    { name: "Himalayan Queen",  number: "14095", dep: "06:00", arr: "10:35", dur: "4h 35m" },
  ],
  "BOM-GOI": [
    { name: "Mandovi Express",  number: "10103", dep: "07:10", arr: "16:30", dur: "9h 20m" },
    { name: "Konkan Kanya",     number: "10111", dep: "23:00", arr: "08:10", dur: "9h 10m" },
  ],
  "BOM-MAA": [
    { name: "Chennai Exp",      number: "11041", dep: "14:15", arr: "06:15", dur: "16h 00m" },
  ],
  "BOM-BLR": [
    { name: "Udyan Express",    number: "11301", dep: "08:05", arr: "01:00", dur: "16h 55m" },
    { name: "Rajdhani Express", number: "12431", dep: "16:00", arr: "08:15", dur: "16h 15m" },
  ],
  "CCU-IXB": [
    { name: "Darjeeling Mail",  number: "13149", dep: "22:05", arr: "08:00", dur: "9h 55m" },
    { name: "Teesta Torsa Exp", number: "13141", dep: "13:40", arr: "23:50", dur: "10h 10m" },
  ],
  "MAA-BLR": [
    { name: "Shatabdi Express", number: "12007", dep: "06:00", arr: "10:35", dur: "4h 35m" },
    { name: "Brindavan Exp",    number: "12639", dep: "07:50", arr: "12:50", dur: "5h 00m" },
  ],
};

const TRAIN_CLASSES = [
  { class: "Sleeper (SL)", multiplier: 1.0 },
  { class: "3rd AC (3A)", multiplier: 2.6  },
  { class: "2nd AC (2A)", multiplier: 3.8  },
  { class: "1st AC (1A)", multiplier: 6.0  },
];

const BASE_TRAIN_PRICES = {
  "DEL-JAI": 280, "DEL-BOM": 580, "DEL-MAA": 720, "DEL-BLR": 680,
  "DEL-CCU": 520, "DEL-HYD": 650, "DEL-VNS": 380, "DEL-IXC": 180,
  "BOM-GOI": 320, "BOM-MAA": 500, "BOM-BLR": 480,
  "CCU-IXB": 280, "MAA-BLR": 220,
};

function generateTrains(originCode, destCode) {
  const key1 = `${originCode}-${destCode}`;
  const key2 = `${destCode}-${originCode}`;
  const trainList  = TRAIN_ROUTES[key1] || TRAIN_ROUTES[key2];
  const basePrice  = BASE_TRAIN_PRICES[key1] || BASE_TRAIN_PRICES[key2] || 400;
  if (!trainList) return [];

  return trainList.flatMap((train) =>
    TRAIN_CLASSES.map((cls) => ({
      id: `TR-${train.number}-${cls.class.replace(/\s/g, "")}`,
      type: "train",
      trainName: train.name,
      trainNumber: train.number,
      origin: originCode,
      destination: destCode,
      originCity: AIRPORTS[originCode]?.city || originCode,
      destinationCity: AIRPORTS[destCode]?.city || destCode,
      departure: train.dep,
      arrival: train.arr,
      duration: train.dur,
      class: cls.class,
      price: Math.round(basePrice * cls.multiplier),
      seatsLeft: randomBetween(2, 120),
      operator: "Indian Railways (IRCTC)",
    }))
  );
}

// ── Buses ─────────────────────────────────────────────────────────────────────
const BUS_ROUTES = {
  "DEL-JAI": [
    { operator: "RSRTC Volvo",     dep: "06:00", arr: "11:00", dur: "5h 00m", type: "AC Volvo Sleeper"   },
    { operator: "Orange Travels",  dep: "08:30", arr: "14:00", dur: "5h 30m", type: "AC Seater"          },
    { operator: "RSRTC Express",   dep: "22:00", arr: "03:30", dur: "5h 30m", type: "Non-AC Sleeper"     },
  ],
  "DEL-IXC": [
    { operator: "HRTC Volvo",      dep: "07:00", arr: "14:00", dur: "7h 00m", type: "AC Volvo Semi-Sleeper" },
    { operator: "PEPSU Express",   dep: "20:00", arr: "03:30", dur: "7h 30m", type: "Non-AC Sleeper"     },
  ],
  "DEL-VNS": [
    { operator: "UP SRTC Volvo",   dep: "18:00", arr: "06:00", dur: "12h 00m", type: "AC Volvo Sleeper"  },
    { operator: "Shrinath Travels",dep: "19:30", arr: "08:00", dur: "12h 30m", type: "AC Sleeper"        },
  ],
  "BOM-GOI": [
    { operator: "KTC Kadamba",     dep: "07:00", arr: "15:30", dur: "8h 30m", type: "AC Volvo Seater"    },
    { operator: "Paulo Travels",   dep: "22:00", arr: "06:30", dur: "8h 30m", type: "AC Sleeper"         },
    { operator: "Goa KTCL",        dep: "09:00", arr: "18:00", dur: "9h 00m", type: "Non-AC Seater"      },
  ],
  "BOM-PNQ": [
    { operator: "MSRTC Shivneri",  dep: "06:00", arr: "09:30", dur: "3h 30m", type: "AC Luxury"          },
    { operator: "MSRTC Asiad",     dep: "08:00", arr: "11:30", dur: "3h 30m", type: "Semi-Luxury"        },
    { operator: "IntrCity SmartBus",dep: "07:30", arr: "11:00", dur: "3h 30m", type: "AC Seater"         },
  ],
  "MAA-BLR": [
    { operator: "KSRTC Airavat",   dep: "06:00", arr: "12:00", dur: "6h 00m", type: "AC Volvo Sleeper"   },
    { operator: "VRL Travels",     dep: "08:00", arr: "14:30", dur: "6h 30m", type: "AC Seater"          },
    { operator: "SRM Travels",     dep: "22:00", arr: "04:30", dur: "6h 30m", type: "AC Sleeper"         },
  ],
  "BLR-HYD": [
    { operator: "APSRTC Garuda",   dep: "07:00", arr: "16:00", dur: "9h 00m", type: "AC Volvo Seater"    },
    { operator: "Orange Travels",  dep: "21:00", arr: "06:30", dur: "9h 30m", type: "AC Sleeper"         },
  ],
  "CCU-IXB": [
    { operator: "NBSTC Rocket",    dep: "06:00", arr: "13:00", dur: "7h 00m", type: "AC Seater"          },
    { operator: "North Bengal ST", dep: "22:00", arr: "05:30", dur: "7h 30m", type: "Non-AC Sleeper"     },
  ],
};

const BUS_CLASS_PRICES = {
  "AC Volvo Sleeper":     { base: 800,  multiplier: 1.0 },
  "AC Volvo Seater":      { base: 650,  multiplier: 1.0 },
  "AC Seater":            { base: 550,  multiplier: 1.0 },
  "AC Sleeper":           { base: 700,  multiplier: 1.0 },
  "Non-AC Sleeper":       { base: 350,  multiplier: 1.0 },
  "Non-AC Seater":        { base: 280,  multiplier: 1.0 },
  "Semi-Luxury":          { base: 500,  multiplier: 1.0 },
  "AC Luxury":            { base: 750,  multiplier: 1.0 },
  "AC Volvo Semi-Sleeper":{ base: 720,  multiplier: 1.0 },
};

function generateBuses(originCode, destCode) {
  const key1 = `${originCode}-${destCode}`;
  const key2 = `${destCode}-${originCode}`;
  const busList = BUS_ROUTES[key1] || BUS_ROUTES[key2];
  if (!busList) return [];

  return busList.map((bus, i) => {
    const priceInfo = BUS_CLASS_PRICES[bus.type] || { base: 500, multiplier: 1 };
    const price = Math.round(priceInfo.base * (0.9 + Math.random() * 0.2));

    return {
      id: `BUS-${originCode}-${destCode}-${i}`,
      type: "bus",
      busOperator: bus.operator,
      busType: bus.type,
      origin: originCode,
      destination: destCode,
      originCity: AIRPORTS[originCode]?.city || originCode,
      destinationCity: AIRPORTS[destCode]?.city || destCode,
      departure: bus.dep,
      arrival: bus.arr,
      duration: bus.dur,
      class: bus.type,
      price,
      seatsLeft: randomBetween(2, 40),
      amenities: bus.type.includes("AC") ? ["AC", "WiFi", "Charging Point"] : ["Fan", "Water Bottle"],
    };
  });
}

// ── Ferry ─────────────────────────────────────────────────────────────────────
const FERRY_ROUTES = {
  // Port Blair / Andaman
  "CCU-IXZ": [
    { operator: "Shipping Corp of India", vessel: "MV Andaman Sindhu", dep: "08:00", arr: "08:00+3", dur: "3 days", route: "Kolkata → Port Blair" },
    { operator: "SCI Ferry",              vessel: "MV Nicobar",        dep: "12:00", arr: "12:00+3", dur: "3 days", route: "Kolkata → Port Blair" },
  ],
  "MAA-IXZ": [
    { operator: "Shipping Corp of India", vessel: "MV Akbar",          dep: "09:00", arr: "09:00+2", dur: "60 hrs", route: "Chennai → Port Blair" },
    { operator: "SCI Ferry",              vessel: "MV Harshavardhana",  dep: "14:00", arr: "14:00+2", dur: "60 hrs", route: "Chennai → Port Blair" },
  ],
  // Kerala backwaters
  "COK-COK": [
    { operator: "KTDC Ferry",             vessel: "Alleppey Cruiser",   dep: "07:30", arr: "13:30",   dur: "6h 00m", route: "Kochi → Alleppey" },
    { operator: "DTPC Backwater",         vessel: "Punalur Boat",       dep: "10:00", arr: "16:30",   dur: "6h 30m", route: "Kochi → Alleppey" },
  ],
  // Goa ferries
  "GOI-GOI": [
    { operator: "Goa River Ferry",        vessel: "Panaji Ferry",       dep: "07:00", arr: "07:20",   dur: "20m",    route: "Panaji → Betim" },
    { operator: "Goa Catamarans",         vessel: "Sea Queen",          dep: "09:00", arr: "09:45",   dur: "45m",    route: "Panaji → Chorao" },
  ],
  // Mumbai to Goa
  "BOM-GOI": [
    { operator: "Angriya Cruise",         vessel: "MV Angriya",         dep: "16:00", arr: "07:00+1", dur: "15 hrs", route: "Mumbai → Goa" },
  ],
  // Andaman Island hopping
  "IXZ-IXZ": [
    { operator: "Govt Ferry Service",     vessel: "MV Swaraj Dweep",    dep: "06:00", arr: "08:30",   dur: "2h 30m", route: "Port Blair → Havelock" },
    { operator: "Makruzz Speedboat",      vessel: "Makruzz Express",    dep: "08:00", arr: "09:30",   dur: "1h 30m", route: "Port Blair → Havelock" },
    { operator: "Green Ocean",            vessel: "Green Ocean I",      dep: "07:00", arr: "09:00",   dur: "2h 00m", route: "Port Blair → Neil Island" },
  ],
};

const FERRY_CLASSES = [
  { class: "Economy Deck",   multiplier: 1.0 },
  { class: "Bunk Class",     multiplier: 1.6 },
  { class: "Cabin (2-berth)",multiplier: 3.2 },
];

const BASE_FERRY_PRICES = {
  "CCU-IXZ": 2800, "MAA-IXZ": 2400,
  "COK-COK": 350,  "GOI-GOI": 50,
  "BOM-GOI": 3200, "IXZ-IXZ": 500,
};

function generateFerries(originCode, destCode) {
  const key1 = `${originCode}-${destCode}`;
  const key2 = `${destCode}-${originCode}`;
  // Also check same-code routes (island hopping)
  const sameCode = `${originCode}-${originCode}`;

  const ferryList  = FERRY_ROUTES[key1] || FERRY_ROUTES[key2] || FERRY_ROUTES[sameCode];
  const basePrice  = BASE_FERRY_PRICES[key1] || BASE_FERRY_PRICES[key2] || BASE_FERRY_PRICES[sameCode] || 800;

  if (!ferryList) return [];

  // For short routes (< 2hr), only one class
  const isShortRoute = ferryList[0]?.dur && (ferryList[0].dur.includes("20m") || ferryList[0].dur.includes("45m") || ferryList[0].dur.includes("1h"));
  const classes = isShortRoute ? [{ class: "Standard", multiplier: 1.0 }] : FERRY_CLASSES;

  return ferryList.flatMap((ferry, fi) =>
    classes.map((cls, ci) => ({
      id: `FRY-${originCode}-${fi}-${ci}`,
      type: "ferry",
      ferryOperator: ferry.operator,
      vesselName: ferry.vessel,
      route: ferry.route,
      origin: originCode,
      destination: destCode,
      originCity: AIRPORTS[originCode]?.city || originCode,
      destinationCity: AIRPORTS[destCode]?.city || destCode,
      departure: ferry.dep,
      arrival: ferry.arr,
      duration: ferry.dur,
      class: cls.class,
      price: Math.round(basePrice * cls.multiplier * (0.9 + Math.random() * 0.2)),
      seatsLeft: randomBetween(5, 80),
      amenities: ["Life Jacket", "Cafeteria", "Restroom"],
    }))
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/flights/airports?q=del
router.get("/airports", (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const results = Object.values(AIRPORTS).filter(
    (a) =>
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
  );
  res.json(results);
});

// GET /api/flights/search?origin=Delhi&destination=Jaipur&date=2025-12-01
router.get("/search", (req, res) => {
  const { origin, destination, date } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ message: "origin and destination are required" });
  }

  const originCode = resolveCode(origin);
  const destCode   = resolveCode(destination);

  if (!originCode) return res.status(404).json({ message: `Airport not found for: ${origin}` });
  if (!destCode)   return res.status(404).json({ message: `Airport not found for: ${destination}` });

  const dateStr = date || new Date().toISOString().split("T")[0];

  const flights = generateFlights(originCode, destCode, dateStr);
  const trains  = generateTrains(originCode, destCode);
  const buses   = generateBuses(originCode, destCode);
  const ferries = generateFerries(originCode, destCode);

  res.json({
    origin:      { code: originCode, ...AIRPORTS[originCode] },
    destination: { code: destCode,   ...AIRPORTS[destCode]   },
    date:        dateStr,
    flights,
    trains,
    buses,
    ferries,
  });
});

export default router;