// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import api from "../api/axios";
// import DestinationCard from "../components/DestinationCard";
// import RegionCard from "../components/RegionCard";

// export default function Home() {
//   const { t } = useTranslation();
//   const [regions, setRegions] = useState([]);
//   const [destinations, setDestinations] = useState([]);
//   const [search, setSearch] = useState("");
//   const [newsletterEmail, setNewsletterEmail] = useState("");
//   const [newsletterMsg, setNewsletterMsg] = useState("");

//   useEffect(() => {
//     api.get("/regions").then((res) => setRegions(res.data.regions || []));
//     api.get("/destinations").then((res) => setDestinations(res.data.destinations || []));
//   }, []);

//   const handleNewsletter = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/newsletter", { email: newsletterEmail });
//       setNewsletterMsg("Subscribed!");
//       setNewsletterEmail("");
//     } catch (err) {
//       setNewsletterMsg(err.response?.data?.message || "Error");
//     }
//   };

//   const filteredDestinations = search
//     ? destinations.filter(
//         (d) =>
//           (d.name || "").toLowerCase().includes(search.toLowerCase()) ||
//           (d.stateId?.name || "").toLowerCase().includes(search.toLowerCase())
//       )
//     : destinations.slice(0, 6);
//   const popularDestinations = filteredDestinations.slice(0, 6);

//   return (
    
//    <div>

//   {/* Hero Section */}
//   <section className="hero">
//     <div className="hero-slider">
//       <div
//         className="hero-slide active"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920')"
//         }}
//       >
//         <div className="hero-content">
//           <h1>{t("home.heroTitle")}</h1>
//           <p>
//             {t("home.heroSubtitle")}
//           </p>
//           <a href="#" className="hero-btn">
//             {t("common.next")}
//           </a>
//         </div>
//       </div>
//     </div>
//   </section>

//   {/* Popular Destinations Example Fix */}
//   <div
//     className="destination-card large"
//     onClick={() => (window.location.href = "/state/rajasthan")}
//   >
//     <img
//       src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800"
//       alt="Rajasthan"
//     />
//     <div className="destination-overlay">
//       <span className="destination-tag">
//         {t("home.popularDestinations")}
//       </span>
//       <h3>Rajasthan</h3>
//       <p>Land of Kings</p>
//       <div className="destination-rating">
//         <i className="fas fa-star"></i> 4.8
//       </div>
//     </div>
//   </div>

// </div>

//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

import Hero from "../components/Hero";
import FeaturedDestinations from "../components/FeaturedDestinations";
import Packages from "../components/Packages";
import Categories from "../components/Categories";
import MapPreview from "../components/MapPreview";
import WhyChooseUs from "../components/WhyChooseUs";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);

  const backendURL = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const destRes = await axios.get(`${backendURL}/api/destinations`);
        const packRes = await axios.get(`${backendURL}/api/packages`);

        setDestinations(destRes.data);
        setPackages(packRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <Hero />
      <FeaturedDestinations destinations={destinations} />
      <Packages packages={packages} />
      <Categories />
      <MapPreview />
      <WhyChooseUs />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;