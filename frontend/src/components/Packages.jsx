import React from "react";
import "./Packages.css";

const Packages = ({ packages }) => {
  return (
    <div className="packages">
      <h2>Popular Packages</h2>

      <div className="package-grid">
        {packages.slice(0, 3).map((pkg) => (
          <div className="card" key={pkg._id}>
            <img src={pkg.image} alt="" />
            <h3>{pkg.title}</h3>
            <p>{pkg.duration}</p>
            <p className="price">₹{pkg.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;