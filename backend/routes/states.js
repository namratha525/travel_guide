// import express from "express";
// import { auth, optionalAuth } from "../middleware/auth.js";
// import { admin } from "../middleware/admin.js";
// import { language } from "../middleware/language.js";
// import * as ctrl from "../controllers/stateController.js";

// const router = express.Router();
// router.use(language);

// router.get("/", optionalAuth, ctrl.list);
// router.get("/:id", optionalAuth, ctrl.getOne);
// router.post("/", auth, admin, ctrl.create);
// router.put("/:id", auth, admin, ctrl.update);
// router.delete("/:id", auth, admin, ctrl.remove);

// export default router;
// backend/routes/states.js
// backend/routes/states.js
// backend/routes/states.js
import express from "express";
import Destination from "../models/Destination.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/states/:stateId/destinations
router.get("/:stateId/destinations", optionalAuth, async (req, res) => {
  try {
    const destinations = await Destination.find(
      { stateId: req.params.stateId },     // ← stateId
      "name description image bestTimeToVisit"
    ).lean();
    res.json(destinations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch destinations" });
  }
});

export default router;