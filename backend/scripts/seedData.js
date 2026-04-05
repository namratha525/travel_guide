import mongoose from "mongoose";
import Region from "../models/Region.js";
import State from "../models/State.js";
import Destination from "../models/Destination.js";
import data from "./data.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {

  // clear old data
  await Region.deleteMany();
  await State.deleteMany();
  await Destination.deleteMany();

  for (const region of data) {

    const newRegion = await Region.create({
      name: region.name,
      image: region.image
    });

    for (const state of region.states) {

      const newState = await State.create({
        name: state.name,
        image: state.image,
        regionId: newRegion._id
      });

      for (const dest of state.destinations) {

        await Destination.create({
          name: dest.name,
          description: dest.description,
          image: dest.image,
          stateId: newState._id
        });

      }
    }
  }

  console.log("Database seeded successfully");
  mongoose.connection.close();
};

seedData();