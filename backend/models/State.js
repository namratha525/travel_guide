import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true
  }
});

export default mongoose.model("State", stateSchema);