import express from "express";
import Destination from "../models/Destination.js";

import {
  getStates,
  getDestinationsByState,
  searchPlaces,
  getDestination
} from "../controllers/destinationController.js";

const router = express.Router();
// ADD THIS ROUTE to your existing backend/routes/destinations.js
// This adds GET /api/destinations/detail/:id

// ─────────────────────────────────────────────────────────────────────────────
// Place this BEFORE your existing routes to avoid conflicts with other :id routes
// ─────────────────────────────────────────────────────────────────────────────

 router.get("/detail/:id", async (req, res) => {
  try {
    // First try with populate
    let destination = await Destination.findById(req.params.id).lean();

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    // If state is an ObjectId, populate it manually
    if (destination.state && typeof destination.state === "object" && destination.state._id) {
      // already populated somehow
    } else if (destination.state) {
      // Try to get state name from State model
      try {
        const State = (await import("../models/State.js")).default;
        const stateDoc = await State.findById(destination.state).lean();
        if (stateDoc) {
          destination.state  = stateDoc.name;
          destination.region = stateDoc.region || "";
        }
      } catch (_) {}
    }

    res.json(destination);
  } catch (err) {
    console.error("Detail route error:", err); // ← will show exact error in terminal
    res.status(500).json({ message: err.message });
  }
});
// router.get("/detail/:id", async (req, res) => {
//   try {
//     const destination = await Destination.findById(req.params.id)
//       .populate("state", "name region")
//       .lean();

//     if (!destination) {
//       return res.status(404).json({ message: "Destination not found" });
//     }

    // Flatten state/region info for easy frontend consumption
//     const result = {
//       ...destination,
//       state:  destination.state?.name  || destination.state  || "",
//       region: destination.state?.region || "",
//     };

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: If your Destination model doesn't have a `state` ref, use this simpler version:
// ─────────────────────────────────────────────────────────────────────────────
/*
router.get("/detail/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id).lean();
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
*/

router.get("/states", getStates);

router.get("/destinations/:stateId", getDestinationsByState);

router.get("/search", searchPlaces);

router.get("/destination/:id", getDestination);

export default router;
