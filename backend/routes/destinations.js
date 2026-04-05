import express from "express";

import {
  getStates,
  getDestinationsByState,
  searchPlaces,
  getDestination
} from "../controllers/destinationController.js";

const router = express.Router();

router.get("/states", getStates);

router.get("/destinations/:stateId", getDestinationsByState);

router.get("/search", searchPlaces);

router.get("/destination/:id", getDestination);

export default router;
