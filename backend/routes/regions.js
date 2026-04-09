// import express from "express";
// import { auth, optionalAuth } from "../middleware/auth.js";
// import { admin } from "../middleware/admin.js";
// import { language } from "../middleware/language.js";
// import * as ctrl from "../controllers/regionController.js";

// const router = express.Router();
// router.use(language);

// router.get("/", optionalAuth, ctrl.list);
// router.get("/:id", optionalAuth, ctrl.getOne);
// router.post("/", auth, admin, ctrl.create);
// router.put("/:id", auth, admin, ctrl.update);
// router.delete("/:id", auth, admin, ctrl.remove);

// export default router;
// backend/routes/regions.js
// backend/routes/regions.js
import express from "express";
import Region from "../models/Region.js";
import State from "../models/State.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/regions
router.get("/", optionalAuth, async (req, res) => {
  try {
    const regions = await Region.find({}, "name image").lean();
    res.json(regions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch regions" });
  }
});

// GET /api/regions/:regionId/states
router.get("/:regionId/states", optionalAuth, async (req, res) => {
  try {
    const states = await State.find(
      { regionId: req.params.regionId },   // ← regionId
      "name image"
    ).lean();
    res.json(states);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch states" });
  }
});

export default router;