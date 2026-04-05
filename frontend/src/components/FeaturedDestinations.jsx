import React from "react";
import "./FeaturedDestinations.css";

const FeaturedDestinations = ({ destinations }) => {
  return (
    <div className="destinations">
      <h2>Featured Destinations</h2>

      <div className="dest-grid">
        {destinations.slice(0, 4).map((item) => (
          <div className="card" key={item._id}>
            <img src={item.image} alt="" />
            <h3>{item.name}</h3>
            <p>{item.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedDestinations;