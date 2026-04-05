import React from "react";
import "./Categories.css";

const Categories = () => {
  const items = ["Adventure", "Beaches", "Heritage", "Nature"];

  return (
    <div className="categories">
      <h2>Explore by Category</h2>

      <div className="cat-list">
        {items.map((c, i) => (
          <div key={i} className="cat-item">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;