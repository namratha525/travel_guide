import express from "express";
import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";
import { getProfile, updateProfile, listUsers, updateUserByAdmin } from "../controllers/userController.js";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

const router = express.Router();
router.get("/profile", auth, getProfile);
router.patch("/profile", auth, updateProfile);
router.get("/", auth, admin, listUsers);
router.patch("/:id", auth, admin, updateUserByAdmin);
router.put("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.userId);

  const allowedFields = [
    "phone",
    "age",
    "gender",
    "address",
    "city",
    "state",
    "country",
    "emergencyContact",
    "passportNumber",
    "preferredLanguage"
  ];

// ✅ Guard against null user
if (!user) {
    return res.status(404).json({ message: "User not found" });
}

allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
        user[field] = req.body[field];
    }
});

  await user.save();

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      avatar: user.avatar,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      emergencyContact: user.emergencyContact,
      passportNumber: user.passportNumber
    }
  });
});

router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  const user = await User.findById(req.user.userId);

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  user.avatar = url;

  await user.save();

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      avatar: user.avatar
    }
  });
});


export default router;
