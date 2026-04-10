// backend/scripts/seedData.js
// Run from the travel_guide ROOT:
//   node backend/scripts/seedData.js

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Region from "../models/Region.js";
import State from "../models/State.js";
import Destination from "../models/Destination.js";
import data from "./data.js";

// Resolve .env from backend/ regardless of where you run the script from
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI not found. Check backend/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  await Destination.deleteMany({});
  await State.deleteMany({});
  await Region.deleteMany({});
  console.log("🗑️  Cleared existing data\n");

  for (const regionData of data) {
    const region = await Region.create({
      name:  regionData.name,
      image: regionData.image,
    });
    console.log(`📍 Region: ${region.name}`);

    for (const stateData of regionData.states) {
      const state = await State.create({
        name:     stateData.name,
        image:    stateData.image,
        regionId: region._id,          // ← matches DB field name
      });
      console.log(`   🏛️  State: ${state.name}`);

      for (const destData of stateData.destinations) {
        await Destination.create({
          name:            destData.name,
          description:     destData.description,
          image:           destData.image,
          bestTimeToVisit: destData.bestTimeToVisit,
          stateId:         state._id,  // ← consistent naming
        });
        console.log(`      🌄 Destination: ${destData.name}`);
      }
    }
  }

  console.log("\n🎉 Seeding complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});