import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-overlay">
        <h1>Incredible India</h1>
        <p>Discover the land of diversity, culture and heritage</p>

        <input
          type="text"
          placeholder="Search destinations..."
          className="search-box"
        />
      </div>
    </div>
  );
};

export default Hero;