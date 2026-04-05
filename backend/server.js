import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import regionRoutes from "./routes/regions.js";
import stateRoutes from "./routes/states.js";
import destinationRoutes from "./routes/destinations.js";
import packageRoutes from "./routes/packages.js";
import bookingRoutes from "./routes/bookings.js";
import newsletterRoutes from "./routes/newsletter.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";
const app = express();
const PORT = process.env.PORT || 5000;
console.log("RAZOR KEY:", process.env.RAZORPAY_KEY_ID);
console.log("Allowed origins:", [process.env.FRONTEND_URL, process.env.ADMIN_URL]);
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

console.log("Allowed origins:", allowedOrigins);
app.use(
  cors({
    origin:"http://localhost:5173",
    credentials: true,
  })
);
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (
//         origin === "http://localhost:5173" ||
//         origin === "http://localhost:5174"
//       ) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//   })
// );
// app.options("*", cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/states", stateRoutes);
app.use("/api", destinationRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/incredible-india")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
