import express from "express";
const router = express.Router();

// ── Airport data ────────────────────────────────────────────────────────────
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

// City → airport code mapping (also handles partial names)
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

// ── Helpers ──────────────────────────────────────────────────────────────────
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

// ── Flight generation ────────────────────────────────────────────────────────
const AIRLINES = [
  { name: "IndiGo",    code: "6E", logo: "✈️", multiplier: 1.0 },
  { name: "Air India", code: "AI", logo: "✈️", multiplier: 1.4 },
  { name: "SpiceJet",  code: "SG", logo: "✈️", multiplier: 0.9 },
  { name: "Vistara",   code: "UK", logo: "✈️", multiplier: 1.3 },
  { name: "GoFirst",   code: "G8", logo: "✈️", multiplier: 0.85 },
  { name: "AirAsia India", code: "I5", logo: "✈️", multiplier: 0.95 },
];

// Base prices by distance tier (approximate)
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
  const departureTimes = ["05:30", "07:15", "09:45", "11:20", "13:05", "15:40", "17:25", "19:10", "21:00"];
  const durationMins = randomBetween(75, 180);

  return AIRLINES.slice(0, randomBetween(3, 5)).map((airline, i) => {
    const depTime = departureTimes[i % departureTimes.length];
    const arrTime = addMinutes(depTime, durationMins + randomBetween(-10, 20));
    const price = Math.round(base * airline.multiplier * (0.9 + Math.random() * 0.3));
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

// ── Train generation ─────────────────────────────────────────────────────────
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
  { class: "Sleeper (SL)",    multiplier: 1.0 },
  { class: "3rd AC (3A)",     multiplier: 2.6 },
  { class: "2nd AC (2A)",     multiplier: 3.8 },
  { class: "1st AC (1A)",     multiplier: 6.0 },
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
  const trainList = TRAIN_ROUTES[key1] || TRAIN_ROUTES[key2];
  const basePrice = BASE_TRAIN_PRICES[key1] || BASE_TRAIN_PRICES[key2] || 400;

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

// ── Routes ───────────────────────────────────────────────────────────────────

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
  if (originCode === destCode) return res.status(400).json({ message: "Origin and destination cannot be the same" });

  const dateStr = date || new Date().toISOString().split("T")[0];

  const flights = generateFlights(originCode, destCode, dateStr);
  const trains  = generateTrains(originCode, destCode);

  res.json({
    origin:      { code: originCode, ...AIRPORTS[originCode] },
    destination: { code: destCode,   ...AIRPORTS[destCode] },
    date:        dateStr,
    flights,
    trains,
  });
});

export default router;