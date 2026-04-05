import express from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { upload } from "../middleware/upload.js";
import {
  // Dashboard
  getDashboardStats,

  // Users
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUser,

  // Bookings
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,

  // Packages
  getAllPackagesAdmin,
  createPackage,
  updatePackage,
  deletePackage,

  // Destinations
  getAllDestinationsAdmin,
  createDestination,
  updateDestination,
  deleteDestination,

  // Regions
  getAllRegionsAdmin,
  createRegion,
  updateRegion,
  deleteRegion,

  // States
  getAllStatesAdmin,
  createState,
  updateState,
  deleteState,

  // Newsletter
  getAllSubscribers,
  deleteSubscriber,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes are protected — must be logged in AND have role=admin
router.use(auth, admin);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
// GET /api/admin/stats
router.get("/stats", getDashboardStats);

// ─── USER MANAGEMENT ─────────────────────────────────────────────────────────
// GET    /api/admin/users                → list all users (search, role, page)
// GET    /api/admin/users/:id            → get single user + their bookings
// PATCH  /api/admin/users/:id            → update user details / role
// DELETE /api/admin/users/:id            → delete user
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUser);

// ─── BOOKING MANAGEMENT ──────────────────────────────────────────────────────
// GET    /api/admin/bookings             → list all bookings (search, status, page)
// GET    /api/admin/bookings/:id         → get single booking details
// PATCH  /api/admin/bookings/:id/status  → update payment status
// DELETE /api/admin/bookings/:id         → delete booking
router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getBookingById);
router.patch("/bookings/:id/status", updateBookingStatus);
router.delete("/bookings/:id", deleteBooking);

// ─── PACKAGE MANAGEMENT ──────────────────────────────────────────────────────
// GET    /api/admin/packages             → list all packages (search, page)
// POST   /api/admin/packages             → create new package (with image upload)
// PUT    /api/admin/packages/:id         → update package (with image upload)
// DELETE /api/admin/packages/:id         → delete package
router.get("/packages", getAllPackagesAdmin);
router.post("/packages", upload.single("image"), createPackage);
router.put("/packages/:id", upload.single("image"), updatePackage);
router.delete("/packages/:id", deletePackage);

// ─── DESTINATION MANAGEMENT ──────────────────────────────────────────────────
// GET    /api/admin/destinations         → list all destinations (search, stateId, page)
// POST   /api/admin/destinations         → create new destination (with image upload)
// PUT    /api/admin/destinations/:id     → update destination (with image upload)
// DELETE /api/admin/destinations/:id     → delete destination
router.get("/destinations", getAllDestinationsAdmin);
router.post("/destinations", upload.single("image"), createDestination);
router.put("/destinations/:id", upload.single("image"), updateDestination);
router.delete("/destinations/:id", deleteDestination);

// ─── REGION MANAGEMENT ───────────────────────────────────────────────────────
// GET    /api/admin/regions              → list all regions
// POST   /api/admin/regions              → create new region (with image upload)
// PUT    /api/admin/regions/:id          → update region (with image upload)
// DELETE /api/admin/regions/:id          → delete region (blocked if states exist)
router.get("/regions", getAllRegionsAdmin);
router.post("/regions", upload.single("image"), createRegion);
router.put("/regions/:id", upload.single("image"), updateRegion);
router.delete("/regions/:id", deleteRegion);

// ─── STATE MANAGEMENT ────────────────────────────────────────────────────────
// GET    /api/admin/states               → list all states (filter by regionId)
// POST   /api/admin/states               → create new state (with image upload)
// PUT    /api/admin/states/:id           → update state (with image upload)
// DELETE /api/admin/states/:id           → delete state (blocked if destinations exist)
router.get("/states", getAllStatesAdmin);
router.post("/states", upload.single("image"), createState);
router.put("/states/:id", upload.single("image"), updateState);
router.delete("/states/:id", deleteState);

// ─── NEWSLETTER MANAGEMENT ───────────────────────────────────────────────────
// GET    /api/admin/newsletter           → list all subscribers (search, page)
// DELETE /api/admin/newsletter/:id       → remove a subscriber
router.get("/newsletter", getAllSubscribers);
router.delete("/newsletter/:id", deleteSubscriber);

export default router;
