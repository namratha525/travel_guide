// backend/scripts/seedPackages.js
// Run from project root:  node backend/scripts/seedPackages.js

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Package from "../models/Package.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Load .env from backend/ — works no matter where you run the script from
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ✅ MONGODB_URI — matches your server.js
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/incredible-india";

const packages = [
  {
    title:       "Royal Rajasthan Tour",
    city:        "Jaipur",
    state:       "Rajasthan",
    days:        7,
    nights:      6,
    price:       18999,
    category:    "Heritage",
    rating:      4.8,
    reviewCount: 320,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed6a6a6?w=800&q=80",
      "https://images.unsplash.com/photo-1598977763459-1e899fcfdf8b?w=800&q=80",
      "https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=800&q=80",
      "https://images.unsplash.com/photo-1603695374938-9f6bc7d28f0d?w=800&q=80",
    ],
    description:
      "Explore the majestic forts and palaces of the Pink City. Walk through Amber Fort, marvel at Hawa Mahal, cruise across Lake Pichola in Udaipur, and experience the golden sands of Jaisalmer.",
    highlights: [
      "Amber Fort & Palace guided tour",
      "Sunset at Jaisalmer Sand Dunes",
      "Lake Pichola boat ride in Udaipur",
      "Hawa Mahal and City Palace",
      "Traditional Rajasthani cultural evening",
      "Pushkar Holy Lake visit",
    ],
    itinerary: [
      "Day 1: Arrive Jaipur — hotel check-in, evening at Chokhi Dhani",
      "Day 2: Amber Fort, Jaigarh Fort, Nahargarh Fort",
      "Day 3: City Palace, Jantar Mantar, Hawa Mahal",
      "Day 4: Drive to Jaisalmer — check-in, evening bazaar",
      "Day 5: Jaisalmer Fort, Patwon Ki Haveli, Sam Sand Dunes camel safari",
      "Day 6: Drive to Udaipur — City Palace, Jagdish Temple",
      "Day 7: Lake Pichola boat ride, Fateh Sagar Lake, departure",
    ],
    included: [
      "6 nights accommodation in 4-star hotels",
      "Daily breakfast and dinner",
      "AC cab for all transfers",
      "English-speaking guide",
      "Camel safari at Sam Dunes",
      "Boat ride at Lake Pichola",
    ],
    hotels: [
      { name: "Samode Palace", type: "4 Star", pricePerNight: 3500 },
      { name: "Desert Haveli", type: "3 Star", pricePerNight: 2200 },
    ],
    transport: [
      { type: "Flight", provider: "IndiGo", price: 4500 },
      { type: "Train", provider: "IRCTC", price: 1200 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "German"],
  },
  {
    title:       "Kerala Backwaters & Hills",
    city:        "Kochi",
    state:       "Kerala",
    days:        6,
    nights:      5,
    price:       15499,
    category:    "Nature",
    rating:      4.9,
    reviewCount: 415,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1609147855836-d25aded9e8e9?w=800&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
      "https://images.unsplash.com/photo-1580889240948-c80e5f455ae7?w=800&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    ],
    description:
      "Drift through the tranquil backwaters of Alleppey on a luxury houseboat, explore the misty tea gardens of Munnar, and unwind on the pristine beaches of Kovalam.",
    highlights: [
      "Overnight houseboat stay in Alleppey",
      "Munnar tea plantation walk",
      "Periyar Wildlife Sanctuary jeep safari",
      "Kathakali dance performance in Kochi",
      "Kovalam beach sunset",
      "Spice garden tour in Thekkady",
    ],
    itinerary: [
      "Day 1: Arrive Kochi — Fort Kochi walk, Chinese fishing nets",
      "Day 2: Drive to Munnar — tea gardens, Mattupetty Dam",
      "Day 3: Munnar to Thekkady — Periyar wildlife boat ride",
      "Day 4: Thekkady to Alleppey — houseboat check-in",
      "Day 5: Backwater cruise, check-out, drive to Kovalam",
      "Day 6: Kovalam beach, departure from Trivandrum",
    ],
    included: [
      "5 nights accommodation (houseboat + hotels)",
      "All meals on houseboat",
      "Breakfast at hotels",
      "AC vehicle for all transfers",
      "Periyar boat ride",
      "Kathakali show tickets",
    ],
    hotels: [
      { name: "Spice Garden Resort", type: "4 Star", pricePerNight: 2800 },
      { name: "Alleppey Houseboat Deluxe", type: "Houseboat", pricePerNight: 5500 },
    ],
    transport: [
      { type: "Flight", provider: "Air India", price: 3800 },
      { type: "Train", provider: "IRCTC", price: 1100 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "Malayalam"],
  },
  {
    title:       "Golden Triangle Classic",
    city:        "Delhi",
    state:       "Delhi / Agra / Jaipur",
    days:        6,
    nights:      5,
    price:       14999,
    category:    "Heritage",
    rating:      4.7,
    reviewCount: 680,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed6a6a6?w=800&q=80",
    ],
    description:
      "India's most iconic circuit — the Taj Mahal at sunrise, the Mughal grandeur of Delhi's Red Fort, and the pink-walled palaces of Jaipur — all in one unforgettable journey.",
    highlights: [
      "Taj Mahal sunrise visit",
      "Agra Fort & Fatehpur Sikri",
      "Red Fort & Qutub Minar Delhi",
      "Amber Fort in Jaipur",
      "Rickshaw ride through Old Delhi",
      "Mughal cuisine dinner experience",
    ],
    itinerary: [
      "Day 1: Arrive Delhi — Red Fort, Jama Masjid, Chandni Chowk",
      "Day 2: Qutub Minar, Humayun's Tomb, India Gate",
      "Day 3: Drive to Agra — Taj Mahal at sunset, Agra Fort",
      "Day 4: Taj Mahal sunrise, Fatehpur Sikri, drive to Jaipur",
      "Day 5: Amber Fort, City Palace, Hawa Mahal",
      "Day 6: Jantar Mantar, local markets, departure",
    ],
    included: [
      "5 nights in centrally-located hotels",
      "Daily breakfast",
      "AC cab Delhi–Agra–Jaipur",
      "Monument entry fees",
      "Professional guide at each city",
    ],
    hotels: [
      { name: "Mughal Sheraton Agra", type: "5 Star", pricePerNight: 6000 },
      { name: "Jaipur Marriott", type: "5 Star", pricePerNight: 5500 },
    ],
    transport: [
      { type: "Flight", provider: "SpiceJet", price: 3200 },
      { type: "Train", provider: "Shatabdi Express", price: 900 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "French", "Spanish"],
  },
  {
    title:       "Goa Beach Fiesta",
    city:        "Panaji",
    state:       "Goa",
    days:        5,
    nights:      4,
    price:       11999,
    category:    "Beach",
    rating:      4.6,
    reviewCount: 512,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=800&q=80",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    ],
    description:
      "Sun, sea, and sangria! Explore Goa's vibrant beaches, Portuguese heritage churches, spice plantations, and legendary night markets along the Mandovi River.",
    highlights: [
      "North Goa beach hopping — Baga, Anjuna, Calangute",
      "Old Goa UNESCO churches tour",
      "Dudhsagar Waterfall day trip",
      "Spice plantation with lunch",
      "Sunset cruise on Mandovi River",
      "Anjuna Flea Market visit",
    ],
    itinerary: [
      "Day 1: Arrive Goa — hotel check-in, Calangute beach evening",
      "Day 2: North Goa — Baga, Anjuna, Fort Aguada, sunset cruise",
      "Day 3: Old Goa churches, Panjim, Fontainhas Latin quarter",
      "Day 4: Dudhsagar Falls & spice plantation trip",
      "Day 5: South Goa beaches — Palolem, Colva, departure",
    ],
    included: [
      "4 nights beachside resort stay",
      "Daily breakfast",
      "Airport transfers",
      "Sunset cruise with dinner",
      "Dudhsagar trip by jeep",
    ],
    hotels: [
      { name: "Taj Holiday Village", type: "5 Star", pricePerNight: 7000 },
      { name: "Baga Beach Resort", type: "3 Star", pricePerNight: 2500 },
    ],
    transport: [
      { type: "Flight", provider: "IndiGo", price: 3500 },
      { type: "Train", provider: "Konkan Railway", price: 800 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "Konkani"],
  },
  {
    title:       "Himalayan Manali Adventure",
    city:        "Manali",
    state:       "Himachal Pradesh",
    days:        7,
    nights:      6,
    price:       16999,
    category:    "Adventure",
    rating:      4.8,
    reviewCount: 290,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571993084503-8ed3ea1bdf9b?w=800&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
      "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=800&q=80",
    ],
    description:
      "Trek through snow-capped peaks, zoom across Rohtang Pass, camp under the Milky Way in Spiti Valley, and paraglide over the Kullu Valley in this ultimate Himalayan escapade.",
    highlights: [
      "Rohtang Pass snow excursion",
      "Solang Valley skiing/snowboarding",
      "Hadimba Temple & old Manali walk",
      "Paragliding in Kullu",
      "River rafting on Beas River",
      "Camping in Sissu near Lahaul",
    ],
    itinerary: [
      "Day 1: Arrive Manali — acclimatize, Mall Road stroll",
      "Day 2: Hadimba Temple, Vashisht hot springs, old Manali",
      "Day 3: Solang Valley — skiing, zorbing, paragliding",
      "Day 4: Rohtang Pass day trip (permit required)",
      "Day 5: Kullu — river rafting, Kasol detour",
      "Day 6: Naggar Castle, Great Himalayan National Park trek",
      "Day 7: Leisure morning, departure",
    ],
    included: [
      "6 nights in mountain lodges/camps",
      "All meals (MAP plan)",
      "Rohtang Pass permit",
      "Adventure activity passes",
      "Cab from Chandigarh airport",
    ],
    hotels: [
      { name: "Snow Valley Resorts", type: "4 Star", pricePerNight: 3200 },
      { name: "Himalayan Abode", type: "3 Star", pricePerNight: 1800 },
    ],
    transport: [
      { type: "Flight", provider: "Air India to Bhuntar", price: 5200 },
      { type: "Bus", provider: "HRTC Volvo", price: 1400 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi"],
  },
  {
    title:       "Varanasi Spiritual Journey",
    city:        "Varanasi",
    state:       "Uttar Pradesh",
    days:        4,
    nights:      3,
    price:       8999,
    category:    "Spiritual",
    rating:      4.9,
    reviewCount: 380,
    image: "https://images.unsplash.com/photo-1561361058-c24e01f5f252?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
      "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    ],
    description:
      "Experience the eternal city on the Ganges — witness the soul-stirring Ganga Aarti, take a dawn boat ride past ancient ghats, explore silk weaving lanes, and visit Sarnath.",
    highlights: [
      "Evening Ganga Aarti at Dashashwamedh Ghat",
      "Sunrise boat ride past 84 ghats",
      "Sarnath Buddhist pilgrimage site",
      "Banaras Hindu University campus tour",
      "Silk weaving workshop visit",
      "Kashi Vishwanath Temple darshan",
    ],
    itinerary: [
      "Day 1: Arrive Varanasi — evening Ganga Aarti ceremony",
      "Day 2: Sunrise boat ride, ghats walk, BHU campus",
      "Day 3: Sarnath excursion, silk weaving lanes, local cuisine",
      "Day 4: Kashi Vishwanath Temple, departure",
    ],
    included: [
      "3 nights heritage hotel stay",
      "Daily breakfast",
      "Sunrise boat ride",
      "Aarti ceremony guide",
      "Sarnath transfers",
    ],
    hotels: [
      { name: "Brijrama Palace", type: "Heritage 5 Star", pricePerNight: 8000 },
      { name: "Hotel Ganges View", type: "Boutique", pricePerNight: 2500 },
    ],
    transport: [
      { type: "Flight", provider: "SpiceJet", price: 2800 },
      { type: "Train", provider: "IRCTC", price: 700 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "Japanese"],
  },
  {
    title:       "Andaman Island Escape",
    city:        "Port Blair",
    state:       "Andaman & Nicobar",
    days:        6,
    nights:      5,
    price:       22999,
    category:    "Beach",
    rating:      4.9,
    reviewCount: 270,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
      "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    ],
    description:
      "Crystal-clear waters, technicolor coral reefs, and powder-white beaches await in the Andaman Islands. Snorkel at Havelock, witness the light-and-sound show at Cellular Jail, and kayak through mangroves.",
    highlights: [
      "Radhanagar Beach (Asia's best beach)",
      "Elephant Beach snorkeling",
      "Cellular Jail sound-and-light show",
      "Scuba diving at Neil Island",
      "Sea-walk at North Bay Island",
      "Kayaking through Baratang mangroves",
    ],
    itinerary: [
      "Day 1: Arrive Port Blair — Cellular Jail, Corbyn's Cove",
      "Day 2: Ross Island, North Bay Island sea-walk, light show",
      "Day 3: Ferry to Havelock — Radhanagar Beach sunset",
      "Day 4: Elephant Beach snorkeling, kayaking",
      "Day 5: Ferry to Neil Island — scuba diving, leisure",
      "Day 6: Return Port Blair, departure",
    ],
    included: [
      "5 nights accommodation",
      "Daily breakfast",
      "Ferry tickets (Port Blair–Havelock–Neil)",
      "Snorkeling & sea-walk passes",
      "All island transfers",
    ],
    hotels: [
      { name: "Taj Exotica Andaman", type: "5 Star", pricePerNight: 9500 },
      { name: "Symphony Palms Beach Resort", type: "4 Star", pricePerNight: 4200 },
    ],
    transport: [
      { type: "Flight", provider: "Air India", price: 7500 },
      { type: "Ferry", provider: "Makruzz", price: 1200 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi"],
  },
  {
    title:       "Darjeeling & Sikkim Escape",
    city:        "Darjeeling",
    state:       "West Bengal / Sikkim",
    days:        7,
    nights:      6,
    price:       17499,
    category:    "Nature",
    rating:      4.7,
    reviewCount: 195,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571993084503-8ed3ea1bdf9b?w=800&q=80",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
      "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    description:
      "Ride the iconic Toy Train through Darjeeling's misty tea gardens, witness Kangchenjunga at dawn from Tiger Hill, visit ancient Buddhist monasteries in Gangtok, and explore the glacial Tsomgo Lake.",
    highlights: [
      "Darjeeling Toy Train (UNESCO Heritage)",
      "Tiger Hill sunrise over Kangchenjunga",
      "Tea estate tour & tasting",
      "Rumtek Monastery Gangtok",
      "Tsomgo Lake at 12,313 ft",
      "Nathula Pass (Indo-China border)",
    ],
    itinerary: [
      "Day 1: Arrive NJP/Bagdogra — transfer to Darjeeling",
      "Day 2: Tiger Hill sunrise, Batasia Loop Toy Train, Zoo",
      "Day 3: Tea estate tour, Peace Pagoda, Japanese Temple",
      "Day 4: Drive to Gangtok — MG Marg, Rumtek Monastery",
      "Day 5: Tsomgo Lake & Baba Mandir",
      "Day 6: Nathula Pass (permit), local market",
      "Day 7: Return NJP, departure",
    ],
    included: [
      "6 nights in tea-garden & hill hotels",
      "Daily breakfast & dinner",
      "Toy Train joy ride tickets",
      "Nathula/Tsomgo permit",
      "All transfers by cab",
    ],
    hotels: [
      { name: "Elgin Hotel Darjeeling", type: "Heritage 4 Star", pricePerNight: 4500 },
      { name: "Mayfair Gangtok", type: "4 Star", pricePerNight: 3800 },
    ],
    transport: [
      { type: "Flight", provider: "SpiceJet to Bagdogra", price: 4200 },
      { type: "Train", provider: "Darjeeling Himalayan Railway", price: 400 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "Nepali"],
  },
  {
    title:       "Hampi & Gokarna Duo",
    city:        "Hampi",
    state:       "Karnataka",
    days:        5,
    nights:      4,
    price:       10999,
    category:    "Heritage",
    rating:      4.6,
    reviewCount: 160,
    image: "https://images.unsplash.com/photo-1615645151316-e2e19d1ef92f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    description:
      "Wander through the boulder-strewn ruins of the Vijayanagara Empire at Hampi, then unwind at the unspoiled crescent beaches of Gokarna.",
    highlights: [
      "Virupaksha Temple & Hampi Bazaar",
      "Vittala Temple stone chariot",
      "Sunset from Hemakuta Hill",
      "Om Beach and Half Moon Beach Gokarna",
      "Shiva Temple Mahabaleshwar",
      "Coracle ride on Tungabhadra River",
    ],
    itinerary: [
      "Day 1: Arrive Hampi — Virupaksha Temple, Hampi Bazaar",
      "Day 2: Vittala Temple, Lotus Mahal, Elephant Stables",
      "Day 3: Hemakuta Hill sunrise, coracle ride, drive to Gokarna",
      "Day 4: Om Beach, Half Moon Beach, Paradise Beach trek",
      "Day 5: Mahabaleshwar Temple, departure from Goa/Hubli",
    ],
    included: [
      "4 nights accommodation",
      "Daily breakfast",
      "Coracle ride",
      "All transfers",
      "Archaeological guide at Hampi",
    ],
    hotels: [
      { name: "Evolve Back Hampi", type: "5 Star Resort", pricePerNight: 12000 },
      { name: "SwaSwara Gokarna", type: "Boutique", pricePerNight: 5500 },
    ],
    transport: [
      { type: "Flight", provider: "IndiGo to Hubli", price: 3800 },
      { type: "Train", provider: "IRCTC", price: 900 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "Kannada"],
  },
  {
    title:       "Kashmir Paradise Valley",
    city:        "Srinagar",
    state:       "Jammu & Kashmir",
    days:        6,
    nights:      5,
    price:       19999,
    category:    "Nature",
    rating:      4.9,
    reviewCount: 340,
    image: "https://images.unsplash.com/photo-1580204560672-c2e22d0a8a4b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
      "https://images.unsplash.com/photo-1598977763459-1e899fcfdf8b?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    description:
      "Stay on a traditional Shikara houseboat on Dal Lake, wander through Mughal gardens in full bloom, trek to the meadows of Gulmarg, and marvel at the breathtaking Pahalgam valley.",
    highlights: [
      "Shikara ride & houseboat stay on Dal Lake",
      "Mughal Gardens — Shalimar Bagh, Nishat",
      "Gulmarg Gondola ride",
      "Pahalgam Betaab Valley trek",
      "Old Srinagar bazaar and Jama Masjid",
      "Pony ride in Gulmarg meadows",
    ],
    itinerary: [
      "Day 1: Arrive Srinagar — Shikara ride, houseboat check-in",
      "Day 2: Mughal Gardens, Shankaracharya Temple",
      "Day 3: Drive to Gulmarg — Gondola, meadow pony ride",
      "Day 4: Drive to Pahalgam — Betaab Valley, Chandanwari",
      "Day 5: Aru Valley trek, Baisaran meadow",
      "Day 6: Local bazaar shopping, departure",
    ],
    included: [
      "2 nights houseboat + 3 nights hotel",
      "All meals on houseboat",
      "Daily breakfast at hotel",
      "Gulmarg Gondola phase 1 ticket",
      "All transfers by cab",
    ],
    hotels: [
      { name: "The Lalit Grand Palace", type: "5 Star", pricePerNight: 8500 },
      { name: "Houseboat New Broadway", type: "Heritage Houseboat", pricePerNight: 4000 },
    ],
    transport: [
      { type: "Flight", provider: "Air India", price: 5500 },
      { type: "Shared Cab", provider: "Local", price: 600 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "Kashmiri"],
  },
  {
    title:       "Rann of Kutch Festival Tour",
    city:        "Bhuj",
    state:       "Gujarat",
    days:        4,
    nights:      3,
    price:       12499,
    category:    "Cultural",
    rating:      4.7,
    reviewCount: 145,
    image: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed6a6a6?w=800&q=80",
      "https://images.unsplash.com/photo-1598977763459-1e899fcfdf8b?w=800&q=80",
      "https://images.unsplash.com/photo-1603695374938-9f6bc7d28f0d?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    description:
      "Experience India's most magical landscape — the vast white salt desert of the Rann of Kutch shimmering under a full moon. Explore folk art villages, camel safaris, and the grand Rann Utsav festival.",
    highlights: [
      "Full moon night at White Rann",
      "Rann Utsav cultural performances",
      "Handicraft village tour (Hodka, Bhirandiyara)",
      "Dholavira archaeological site",
      "Camel safari on salt flats",
      "Bhuj Aina Mahal palace",
    ],
    itinerary: [
      "Day 1: Arrive Bhuj — Aina Mahal, local market",
      "Day 2: Craft villages, Dholavira UNESCO site",
      "Day 3: White Rann at sunset & full moon, cultural show",
      "Day 4: Camel safari, departure",
    ],
    included: [
      "3 nights tent resort / hotel",
      "All meals",
      "Rann Utsav entry",
      "Camel safari",
      "Village tour",
    ],
    hotels: [
      { name: "Rann Riders Resort", type: "Tent Resort", pricePerNight: 5000 },
      { name: "Hotel City Inn Bhuj", type: "3 Star", pricePerNight: 1800 },
    ],
    transport: [
      { type: "Flight", provider: "SpiceJet to Bhuj", price: 4000 },
      { type: "Train", provider: "IRCTC", price: 1000 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "Gujarati"],
  },
  {
    title:       "Mysore & Coorg Coffee Trail",
    city:        "Mysore",
    state:       "Karnataka",
    days:        5,
    nights:      4,
    price:       13499,
    category:    "Nature",
    rating:      4.6,
    reviewCount: 210,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
      "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80",
      "https://images.unsplash.com/photo-1615645151316-e2e19d1ef92f?w=800&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    ],
    description:
      "Marvel at the illuminated Mysore Palace, trek through Coorg's fragrant coffee and spice estates, chase the mighty Abbey Falls, and enjoy wildlife spotting at Nagarhole Tiger Reserve.",
    highlights: [
      "Mysore Palace illumination (Sunday)",
      "Chamundi Hill temple",
      "Coorg coffee plantation walk",
      "Abbey Falls trek",
      "Nagarhole National Park safari",
      "Dubare Elephant Camp",
    ],
    itinerary: [
      "Day 1: Arrive Mysore — Mysore Palace, Devaraja Market",
      "Day 2: Chamundi Hill, Brindavan Gardens, Srirangapatna",
      "Day 3: Drive to Coorg — coffee estate, Abbey Falls",
      "Day 4: Dubare Elephant Camp, Nagarhole safari",
      "Day 5: Raja Seat sunset, local shopping, departure",
    ],
    included: [
      "4 nights plantation & city hotels",
      "Daily breakfast",
      "Nagarhole jeep safari",
      "Elephant interaction at Dubare",
      "AC cab for all transfers",
    ],
    hotels: [
      { name: "Lalitha Mahal Palace Hotel", type: "Heritage 5 Star", pricePerNight: 7500 },
      { name: "Honey Valley Estate Coorg", type: "Plantation Stay", pricePerNight: 3200 },
    ],
    transport: [
      { type: "Flight", provider: "Air India to Bangalore", price: 3200 },
      { type: "Train", provider: "IRCTC", price: 850 },
    ],
    guideAvailable: true,
    guideLanguages: ["English", "Hindi", "Kannada"],
  },
];

async function seed() {
  if (!uri) {
    console.error("❌ MONGODB_URI not found. Check backend/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB\n");

  await Package.deleteMany({});
  console.log("🗑️  Cleared existing packages\n");

  await Package.insertMany(packages);
  console.log(`🎉 Inserted ${packages.length} packages successfully!`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});