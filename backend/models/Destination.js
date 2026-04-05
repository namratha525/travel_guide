import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  image: {
    type: String
  },

  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true
  }
});

export default mongoose.model("Destination", destinationSchema);