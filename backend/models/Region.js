// import mongoose from "mongoose";

// const regionSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },

//   image: {
//     type: String
//   }
// });

// export default mongoose.model("Region", regionSchema);

// backend/models/Region.js
import mongoose from "mongoose";

const regionSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Region", regionSchema);
