import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import Destination from "../models/Destination.js";
import Region from "../models/Region.js";
import State from "../models/State.js";
import Newsletter from "../models/Newsletter.js";

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
export async function getDashboardStats(req, res) {
  try {
    const [
      totalUsers,
      totalBookings,
      totalPackages,
      totalDestinations,
      totalRegions,
      totalStates,
      totalNewsletterSubscribers,
      recentBookings,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Booking.countDocuments(),
      Package.countDocuments(),
      Destination.countDocuments(),
      Region.countDocuments(),
      State.countDocuments(),
      Newsletter.countDocuments(),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name email avatar")
        .lean(),
      User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email avatar createdAt")
        .lean(),
    ]);

    // Total revenue from paid bookings
    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Bookings by payment status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
    ]);

    // Monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      stats: {
        totalUsers,
        totalBookings,
        totalPackages,
        totalDestinations,
        totalRegions,
        totalStates,
        totalNewsletterSubscribers,
        totalRevenue,
      },
      bookingsByStatus,
      monthlyRevenue,
      recentBookings,
      recentUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────
export async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(filter);

    res.json({ users, total, pages: Math.ceil(total / limit), page: +page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const bookings = await Booking.find({ userId: req.params.id })
      .populate("packageId")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ user, bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateUserByAdmin(req, res) {
  try {
    const allowed = ["name", "email", "role", "phone", "city", "state", "country"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ─── BOOKING MANAGEMENT ───────────────────────────────────────────────────────
export async function getAllBookings(req, res) {
  try {
    const { page = 1, limit = 10, search = "", paymentStatus = "" } = req.query;
    const filter = {};
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      filter.userId = { $in: users.map((u) => u._id) };
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name email avatar phone")
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Booking.countDocuments(filter);

    res.json({ bookings, total, pages: Math.ceil(total / limit), page: +page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email phone avatar")
      .lean();
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateBookingStatus(req, res) {
  try {
    const { paymentStatus } = req.body;
    const validStatuses = ["pending", "paid", "failed", "refunded"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate("userId", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking status updated", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteBooking(req, res) {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ─── PACKAGE MANAGEMENT ───────────────────────────────────────────────────────
export async function getAllPackagesAdmin(req, res) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
      ];
    }
    const packages = await Package.find(filter)
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort({ createdAt: -1 })
      .lean();
    const total = await Package.countDocuments(filter);
    res.json({ packages, total, pages: Math.ceil(total / limit), page: +page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createPackage(req, res) {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ message: "Package created", package: pkg });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updatePackage(req, res) {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ message: "Package updated", package: pkg });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deletePackage(req, res) {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ─── DESTINATION MANAGEMENT ───────────────────────────────────────────────────
export async function getAllDestinationsAdmin(req, res) {
  try {
    const { page = 1, limit = 10, search = "", stateId = "" } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (stateId) filter.stateId = stateId;

    const destinations = await Destination.find(filter)
      .populate("stateId", "name")
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort({ createdAt: -1 })
      .lean();
    const total = await Destination.countDocuments(filter);
    res.json({ destinations, total, pages: Math.ceil(total / limit), page: +page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createDestination(req, res) {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ message: "Destination created", destination });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateDestination(req, res) {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Destination updated", destination });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteDestination(req, res) {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Destination deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ─── REGION MANAGEMENT ────────────────────────────────────────────────────────
export async function getAllRegionsAdmin(req, res) {
  try {
    const regions = await Region.find().sort({ createdAt: -1 }).lean();
    res.json(regions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createRegion(req, res) {
  try {
    const region = await Region.create(req.body);
    res.status(201).json({ message: "Region created", region });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateRegion(req, res) {
  try {
    const region = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!region) return res.status(404).json({ message: "Region not found" });
    res.json({ message: "Region updated", region });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteRegion(req, res) {
  try {
    // Check if states exist under this region
    const statesCount = await State.countDocuments({ regionId: req.params.id });
    if (statesCount > 0) {
      return res.status(400).json({ message: `Cannot delete. ${statesCount} state(s) are linked to this region.` });
    }
    const region = await Region.findByIdAndDelete(req.params.id);
    if (!region) return res.status(404).json({ message: "Region not found" });
    res.json({ message: "Region deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ─── STATE MANAGEMENT ─────────────────────────────────────────────────────────
export async function getAllStatesAdmin(req, res) {
  try {
    const { regionId = "" } = req.query;
    const filter = {};
    if (regionId) filter.regionId = regionId;
    const states = await State.find(filter).populate("regionId", "name").sort({ createdAt: -1 }).lean();
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createState(req, res) {
  try {
    const state = await State.create(req.body);
    res.status(201).json({ message: "State created", state });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateState(req, res) {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!state) return res.status(404).json({ message: "State not found" });
    res.json({ message: "State updated", state });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteState(req, res) {
  try {
    const destCount = await Destination.countDocuments({ stateId: req.params.id });
    if (destCount > 0) {
      return res.status(400).json({ message: `Cannot delete. ${destCount} destination(s) are linked to this state.` });
    }
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) return res.status(404).json({ message: "State not found" });
    res.json({ message: "State deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ─── NEWSLETTER MANAGEMENT ────────────────────────────────────────────────────
export async function getAllSubscribers(req, res) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const filter = {};
    if (search) filter.email = { $regex: search, $options: "i" };
    const subscribers = await Newsletter.find(filter)
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort({ createdAt: -1 })
      .lean();
    const total = await Newsletter.countDocuments(filter);
    res.json({ subscribers, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteSubscriber(req, res) {
  try {
    const sub = await Newsletter.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscriber not found" });
    res.json({ message: "Subscriber removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
