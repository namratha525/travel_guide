// import express from "express";
// import Package from "../models/Package.js";

// const router = express.Router();

// router.get("/", async (req, res) => {
//   const data = await Package.find();
//   res.json(data);
// });

// router.get("/:id", async (req, res) => {
//   const data = await Package.findById(req.params.id);
//   res.json(data);
// });

// export default router;

// backend/routes/packages.js
import express from "express";
import Package from "../models/Package.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/packages  — all packages (card view fields only)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const packages = await Package.find(
      {},
      "title city state days nights price image category rating reviewCount description"
    ).lean();
    res.json(packages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch packages" });
  }
});

// GET /api/packages/:id  — single package full detail
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).lean();
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch package" });
  }
});

export default router;