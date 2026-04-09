// import mongoose from "mongoose";

// const destinationSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },

//   description: {
//     type: String
//   },

//   image: {
//     type: String
//   },

//   stateId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "State",
//     required: true
//   }
// });

// export default mongoose.model("Destination", destinationSchema);
// backend/models/Destination.js
import mongoose from "mongoose";
const destinationSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true },
    description:     { type: String, required: true },
    image:           { type: String, required: true },
    bestTimeToVisit: { type: String, required: true },  // ← added
    stateId:           { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Destination", destinationSchema);
