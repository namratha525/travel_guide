import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./explore.css";
import { regions, places } from "../data/exploreData";

export default function Explore() {
  const [activeRegion, setActiveRegion] = useState("All");
  const navigate = useNavigate();

  const filteredPlaces =
    activeRegion === "All"
      ? places
      : places.filter((p) => p.region === activeRegion);

  return (
    <div className="explore-page">

      {/* HERO */}
      <div className="explore-hero">
        <h1>Explore India</h1>
        <p>Discover the diverse regions and states of incredible India</p>
      </div>

      {/* DECISION BOXES */}
      <div className="decision-section">
        <div className="decision-card">
          <h2>Already decided where to go?</h2>
          <p>Choose your destination.</p>
          <button onClick={() => navigate("/destination/1")}>
            Browse Destinations
          </button>
        </div>

        <div className="decision-card">
          <h2>Not sure yet?</h2>
          <p>We have popular packages for you.</p>
          
          <button style={{marginTop:"55px"}} onClick={() => navigate("/packages")}>
            View Packages
          </button>
        </div>
      </div>

      {/* REGION FILTER
      <div className="region-tabs">
        {regions.map((r) => (
          <button
            key={r}
            className={activeRegion === r ? "active" : ""}
            onClick={() => setActiveRegion(r)}
          >
            {r}
          </button>
        ))}
      </div> */}

      {/* PLACES */}
      {/* <div className="places-grid">
        {filteredPlaces.map((place) => (
          <div key={place.id} className="place-card">
            <img src={place.image} alt={place.name} />
            <h3>{place.name}</h3>
            <span>{place.region}</span>
          </div>
        ))} */}
      {/* </div> */}

      {/* POPULAR PACKAGES */}
      {/* <div className="packages-section">
        <h2>Popular Packages</h2>
        <button onClick={() => navigate("/packages")}>
          Explore All Packages
        </button>
      </div> */}

    </div>
  );
}