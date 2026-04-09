
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Home.css";

// import Hero from "../components/Hero";
// import FeaturedDestinations from "../components/FeaturedDestinations";
// import Packages from "../components/Packages";
// import Categories from "../components/Categories";
// import MapPreview from "../components/MapPreview";
// import WhyChooseUs from "../components/WhyChooseUs";
// import CTA from "../components/CTA";
// import Footer from "../components/Footer";

// const Home = () => {
//   const [destinations, setDestinations] = useState([]);
//   const [packages, setPackages] = useState([]);

//   const backendURL = "http://localhost:5000";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const destRes = await axios.get(`${backendURL}/api/destinations`);
//         const packRes = await axios.get(`${backendURL}/api/packages`);

//         setDestinations(destRes.data);
//         setPackages(packRes.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="home">
//       <Hero />
//       <FeaturedDestinations destinations={destinations} />
//       <Packages packages={packages} />
//       <Categories />
//       <MapPreview />
//       <WhyChooseUs />
//       <CTA />
//       <Footer />
//     </div>
//   );
// };

// export default Home;
// frontend/src/pages/Home.jsx
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
  const [packages, setPackages] = useState([]);

  // VITE_API_URL = "http://localhost:5000/api"
  const backendURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    axios
      .get(`${backendURL}/packages`)
      .then((res) => setPackages(res.data))
      .catch((err) => console.log("Packages fetch error:", err));
  }, []);

  return (
    <div className="home">
      <Hero />
      {/* destinations={[]} since there's no get-all destinations endpoint.
          Your Destination page handles destinations via region→state drill-down */}
      <FeaturedDestinations destinations={[]} />
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
