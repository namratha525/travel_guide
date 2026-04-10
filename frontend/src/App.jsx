import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Destination from "./pages/Destination";
import MapPage from "./pages/MapPage";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import "leaflet/dist/leaflet.css";
import Map from "./pages/Map";
import TransportSearch from "./pages/TransportSearch";
import DestinationDetail from "./pages/DestinationDetail";
import DestinationBooking from "./pages/DestinationBooking";

// inside <Routes>:




function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="destination/:id" element={<Destination />} />
            <Route path="map" element={<MapPage />} />
            <Route path="booking/:id" element={<Booking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/transport-search" element={<TransportSearch />} />
            <Route path="/destination-detail/:id" element={<DestinationDetail />} />
            <Route path="/destination-booking/:id" element={<DestinationBooking />} />

            <Route
              path="dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            

            

            <Route path="auth/google/callback" element={<GoogleAuthCallback />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}
