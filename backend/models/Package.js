// // backend/models/Package.js
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name:         { type: String },
  type:         { type: String },   // "3 Star", "4 Star", etc.
  pricePerNight:{ type: Number },
});

const transportSchema = new mongoose.Schema({
  type:     { type: String },       // "Train", "Flight", "Bus"
  provider: { type: String },
  price:    { type: Number },
});

const packageSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true },
    city:         { type: String, required: true },
    state:        { type: String, required: true },
    days:         { type: Number, required: true },
    nights:       { type: Number, required: true },
    price:        { type: Number, required: true },
    description:  { type: String, required: true },

    // Extended detail fields
    highlights:   [{ type: String }],          // bullet points shown in detail
    images:       [{ type: String }],          // gallery images (3–5 URLs)
    image:        { type: String, required: true }, // cover image
    category:     { type: String },            // "Adventure", "Heritage", "Beach", etc.
    rating:       { type: Number, default: 4.5 },
    reviewCount:  { type: Number, default: 0 },
    included:     [{ type: String }],          // what's included
    itinerary:    [{ type: String }],          // day-by-day plan

    hotels:       [hotelSchema],
    transport:    [transportSchema],

    guideAvailable: { type: Boolean, default: true },
    guideLanguages: [{ type: String }],        // ["English", "Hindi", "Tamil"]
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);