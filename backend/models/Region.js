import mongoose from "mongoose";

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  image: {
    type: String
  }
});

export default mongoose.model("Region", regionSchema);
