// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Packages() {

//   const [packages, setPackages] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get("/packages")
//       .then(res => {
//         console.log("DATA:", res.data);
//         setPackages(res.data);
//       })
//       .catch(err => console.log(err));
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 style={{paddingTop:"20px"}}>Available Tours</h2>
//       <h2 >Popular packages</h2>
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(3, 1fr)",
//         gap: "20px"
//       }}>

//         {packages.map(pkg => (
//           <div
//             key={pkg._id}
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: "10px",
//               padding: "15px",
//               cursor: "pointer"
//             }}
//             onClick={() => navigate(`/packages/${pkg._id}`)}
//           >
//             <img
//               src={pkg.image}
//               alt={pkg.title}
//               style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
//             />

//             <h3>{pkg.title}</h3>
//             <p>{pkg.city}, {pkg.state}</p>
//             <p>{pkg.days} Days / {pkg.nights} Nights</p>
//             <h4>₹{pkg.price}</h4>
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// }
// frontend/src/pages/Packages.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchPackages, fetchPackageById } from "../api/packageApi";
// import "./Packages.css";

// // ── category filter list ──────────────────────────────────────────────────────
// const CATEGORIES = ["All", "Heritage", "Nature", "Beach", "Adventure", "Spiritual", "Cultural"];

// // ── main page ─────────────────────────────────────────────────────────────────
// export default function Packages() {
//   const [packages,    setPackages]    = useState([]);
//   const [filtered,    setFiltered]    = useState([]);
//   const [loading,     setLoading]     = useState(true);
//   const [error,       setError]       = useState(null);
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [selectedPkg, setSelectedPkg] = useState(null);   // detail modal

//   // ── fetch all packages ──────────────────────────────────────────────────────
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await fetchPackages();
//         setPackages(data);
//         setFiltered(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // ── filter ──────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (activeFilter === "All") {
//       setFiltered(packages);
//     } else {
//       setFiltered(packages.filter((p) => p.category === activeFilter));
//     }
//   }, [activeFilter, packages]);

//   // ── open detail ─────────────────────────────────────────────────────────────
//   const openDetail = async (pkg) => {
//     try {
//       const full = await fetchPackageById(pkg._id);
//       setSelectedPkg(full);
//     } catch {
//       setSelectedPkg(pkg); // fallback to card data
//     }
//   };

//   const closeDetail = () => setSelectedPkg(null);

//   return (
//     <div className="pkg-page">
//       {/* ── hero ── */}
//       <div className="pkg-hero">
//         <p className="pkg-hero-label">Curated For You</p>
//         <h1 className="pkg-hero-title">Popular Tour Packages</h1>
//         <p className="pkg-hero-sub">
//           Hand-picked journeys across India — from Himalayan peaks to tropical shores
//         </p>
//       </div>

//       {/* ── filters ── */}
//       <div className="pkg-filters">
//         {CATEGORIES.map((cat) => (
//           <button
//             key={cat}
//             className={`pkg-filter-btn${activeFilter === cat ? " active" : ""}`}
//             onClick={() => setActiveFilter(cat)}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* ── states ── */}
//       {loading && <SkeletonGrid />}

//       {!loading && error && (
//         <div className="pkg-error">
//           <p>{error}</p>
//           <button onClick={() => window.location.reload()}>Retry</button>
//         </div>
//       )}

//       {!loading && !error && filtered.length === 0 && (
//         <p className="pkg-empty">No packages found for this category.</p>
//       )}

//       {/* ── grid ── */}
//       {!loading && !error && filtered.length > 0 && (
//         <div className="pkg-grid">
//           {filtered.map((pkg, i) => (
//             <PackageCard
//               key={pkg._id}
//               pkg={pkg}
//               index={i}
//               onClick={() => openDetail(pkg)}
//             />
//           ))}
//         </div>
//       )}

//       {/* ── detail modal ── */}
//       {selectedPkg && (
//         <PackageDetail pkg={selectedPkg} onClose={closeDetail} />
//       )}
//     </div>
//   );
// }

// // ── package card ──────────────────────────────────────────────────────────────
// function PackageCard({ pkg, index, onClick }) {
//   return (
//     <article
//       className="pkg-card"
//       style={{ animationDelay: `${index * 0.07}s` }}
//       onClick={onClick}
//     >
//       <div className="pkg-card__img-wrap">
//         <img src={pkg.image} alt={pkg.title} className="pkg-card__img" loading="lazy" />
//         <div className="pkg-card__overlay" />
//         {pkg.category && (
//           <span className="pkg-card__tag">{pkg.category}</span>
//         )}
//       </div>

//       <div className="pkg-card__body">
//         <div className="pkg-card__meta">
//           <span className="pkg-card__location">
//             <PinIcon /> {pkg.city}, {pkg.state}
//           </span>
//           <span className="pkg-card__rating">
//             ★ {pkg.rating} <span className="pkg-card__reviews">({pkg.reviewCount})</span>
//           </span>
//         </div>

//         <h2 className="pkg-card__title">{pkg.title}</h2>
//         <p className="pkg-card__desc">{pkg.description}</p>

//         <div className="pkg-card__footer">
//           <div className="pkg-card__duration">
//             <ClockIcon /> {pkg.days}D / {pkg.nights}N
//           </div>
//           <div className="pkg-card__price">
//             <span className="pkg-card__from">from</span>
//             <span className="pkg-card__amount">₹{pkg.price.toLocaleString("en-IN")}</span>
//           </div>
//         </div>

//         <button className="pkg-card__btn">View Details</button>
//       </div>
//     </article>
//   );
// }

// // ── package detail modal ──────────────────────────────────────────────────────
// function PackageDetail({ pkg, onClose }) {
//   const navigate = useNavigate();
//   const [activeImg, setActiveImg] = useState(0);
//   const images = pkg.images?.length ? pkg.images : [pkg.image];

//   // prevent background scroll
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   const handleBook = () => {
//     onClose();
//     navigate("/booking", { state: { package: pkg } });
//   };

//   return (
//     <div className="pkg-modal-backdrop" onClick={onClose}>
//       <div className="pkg-modal" onClick={(e) => e.stopPropagation()}>
//         {/* close */}
//         <button className="pkg-modal__close" onClick={onClose}>✕</button>

//         {/* image gallery */}
//         <div className="pkg-modal__gallery">
//           <img
//             src={images[activeImg]}
//             alt={pkg.title}
//             className="pkg-modal__main-img"
//           />
//           {images.length > 1 && (
//             <div className="pkg-modal__thumbs">
//               {images.map((img, i) => (
//                 <img
//                   key={i}
//                   src={img}
//                   alt=""
//                   className={`pkg-modal__thumb${activeImg === i ? " active" : ""}`}
//                   onClick={() => setActiveImg(i)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* content */}
//         <div className="pkg-modal__content">
//           <div className="pkg-modal__header">
//             <div>
//               {pkg.category && <span className="pkg-modal__tag">{pkg.category}</span>}
//               <h2 className="pkg-modal__title">{pkg.title}</h2>
//               <p className="pkg-modal__location">
//                 <PinIcon /> {pkg.city}, {pkg.state}
//               </p>
//             </div>
//             <div className="pkg-modal__price-block">
//               <span className="pkg-modal__price">₹{pkg.price.toLocaleString("en-IN")}</span>
//               <span className="pkg-modal__per">per person</span>
//               <span className="pkg-modal__duration">{pkg.days}D / {pkg.nights}N</span>
//             </div>
//           </div>

//           <p className="pkg-modal__desc">{pkg.description}</p>

//           {/* highlights */}
//           {pkg.highlights?.length > 0 && (
//             <section className="pkg-modal__section">
//               <h3 className="pkg-modal__section-title">Highlights</h3>
//               <ul className="pkg-modal__highlights">
//                 {pkg.highlights.map((h, i) => (
//                   <li key={i}><span className="pkg-modal__check">✓</span>{h}</li>
//                 ))}
//               </ul>
//             </section>
//           )}

//           {/* itinerary */}
//           {pkg.itinerary?.length > 0 && (
//             <section className="pkg-modal__section">
//               <h3 className="pkg-modal__section-title">Itinerary</h3>
//               <ol className="pkg-modal__itinerary">
//                 {pkg.itinerary.map((day, i) => (
//                   <li key={i}>
//                     <span className="pkg-modal__day-dot" />
//                     {day}
//                   </li>
//                 ))}
//               </ol>
//             </section>
//           )}

//           {/* included */}
//           {pkg.included?.length > 0 && (
//             <section className="pkg-modal__section">
//               <h3 className="pkg-modal__section-title">What's Included</h3>
//               <ul className="pkg-modal__included">
//                 {pkg.included.map((item, i) => (
//                   <li key={i}><span>✔</span>{item}</li>
//                 ))}
//               </ul>
//             </section>
//           )}

//           {/* hotels */}
//           {pkg.hotels?.length > 0 && (
//             <section className="pkg-modal__section">
//               <h3 className="pkg-modal__section-title">Hotels</h3>
//               <div className="pkg-modal__cards-row">
//                 {pkg.hotels.map((h, i) => (
//                   <div key={i} className="pkg-modal__info-card">
//                     <span className="pkg-modal__info-icon">🏨</span>
//                     <div>
//                       <p className="pkg-modal__info-name">{h.name}</p>
//                       <p className="pkg-modal__info-sub">{h.type} · ₹{h.pricePerNight?.toLocaleString("en-IN")}/night</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* transport */}
//           {pkg.transport?.length > 0 && (
//             <section className="pkg-modal__section">
//               <h3 className="pkg-modal__section-title">Transport Options</h3>
//               <div className="pkg-modal__cards-row">
//                 {pkg.transport.map((t, i) => (
//                   <div key={i} className="pkg-modal__info-card">
//                     <span className="pkg-modal__info-icon">
//                       {t.type === "Flight" ? "✈️" : t.type === "Train" ? "🚆" : t.type === "Ferry" ? "⛴️" : "🚌"}
//                     </span>
//                     <div>
//                       <p className="pkg-modal__info-name">{t.type} — {t.provider}</p>
//                       <p className="pkg-modal__info-sub">₹{t.price?.toLocaleString("en-IN")} per person</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* guide */}
//           {pkg.guideAvailable && (
//             <section className="pkg-modal__section">
//               <h3 className="pkg-modal__section-title">Travel Guide</h3>
//               <div className="pkg-modal__guide-badge">
//                 <span>🧭</span>
//                 <div>
//                   <p className="pkg-modal__info-name">Professional Guide Available</p>
//                   {pkg.guideLanguages?.length > 0 && (
//                     <p className="pkg-modal__info-sub">
//                       Languages: {pkg.guideLanguages.join(", ")}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </section>
//           )}

//           <button className="pkg-modal__book-btn" onClick={handleBook}>
//             Book This Package
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── skeleton ──────────────────────────────────────────────────────────────────
// function SkeletonGrid() {
//   return (
//     <div className="pkg-grid">
//       {Array.from({ length: 6 }).map((_, i) => (
//         <div key={i} className="pkg-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />
//       ))}
//     </div>
//   );
// }

// // ── icons ─────────────────────────────────────────────────────────────────────
// function PinIcon() {
//   return (
//     <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
//     </svg>
//   );
// }

// function ClockIcon() {
//   return (
//     <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
//       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="12" cy="12" r="10"/>
//       <polyline points="12 6 12 12 16 14"/>
//     </svg>
//   );
// }
// frontend/src/pages/Packages.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPackages, fetchPackageById } from "../api/packageApi";
import "./Packages.css";

const CATEGORIES = ["All", "Heritage", "Nature", "Beach", "Adventure", "Spiritual", "Cultural"];

export default function Packages() {
  const [packages,     setPackages]     = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPkg,  setSelectedPkg]  = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPackages();
        setPackages(data);
        setFiltered(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setFiltered(
      activeFilter === "All"
        ? packages
        : packages.filter((p) => p.category === activeFilter)
    );
  }, [activeFilter, packages]);

  const openDetail = async (pkg) => {
    try {
      const full = await fetchPackageById(pkg._id);
      setSelectedPkg(full);
    } catch {
      setSelectedPkg(pkg);
    }
  };

  return (
    <div className="pkg-page">
      <div className="pkg-hero">
        <p className="pkg-hero-label">Curated For You</p>
        <h1 className="pkg-hero-title">Popular Tour Packages</h1>
        <p className="pkg-hero-sub">
          Hand-picked journeys across India — from Himalayan peaks to tropical shores
        </p>
      </div>

      <div className="pkg-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`pkg-filter-btn${activeFilter === cat ? " active" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <SkeletonGrid />}

      {!loading && error && (
        <div className="pkg-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="pkg-empty">No packages found for this category.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="pkg-grid">
          {filtered.map((pkg, i) => (
            <PackageCard key={pkg._id} pkg={pkg} index={i} onClick={() => openDetail(pkg)} />
          ))}
        </div>
      )}

      {selectedPkg && (
        <PackageDetail pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      )}
    </div>
  );
}

// ── card ──────────────────────────────────────────────────────────────────────
function PackageCard({ pkg, index, onClick }) {
  return (
    <article
      className="pkg-card"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={onClick}
    >
      <div className="pkg-card__img-wrap">
        <img src={pkg.image} alt={pkg.title} className="pkg-card__img" loading="lazy" />
        <div className="pkg-card__overlay" />
        {pkg.category && <span className="pkg-card__tag">{pkg.category}</span>}
      </div>
      <div className="pkg-card__body">
        <div className="pkg-card__meta">
          <span className="pkg-card__location">
            <PinIcon /> {pkg.city}, {pkg.state}
          </span>
          <span className="pkg-card__rating">
            ★ {pkg.rating}
            <span className="pkg-card__reviews"> ({pkg.reviewCount})</span>
          </span>
        </div>
        <h2 className="pkg-card__title">{pkg.title}</h2>
        <p className="pkg-card__desc">{pkg.description}</p>
        <div className="pkg-card__footer">
          <div className="pkg-card__duration">
            <ClockIcon /> {pkg.days}D / {pkg.nights}N
          </div>
          <div className="pkg-card__price">
            <span className="pkg-card__from">from</span>
            <span className="pkg-card__amount">₹{pkg.price.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <button className="pkg-card__btn">View Details</button>
      </div>
    </article>
  );
}

// ── detail modal ──────────────────────────────────────────────────────────────
function PackageDetail({ pkg, onClose }) {
  const navigate   = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const images = pkg.images?.length ? pkg.images : [pkg.image];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ✅ Navigate to /booking/:id — matches App.jsx route "booking/:id"
  const handleBook = () => {
    onClose();
    navigate(`/booking/${pkg._id}`, { state: { package: pkg } });
  };

  return (
    <div className="pkg-modal-backdrop" onClick={onClose}>
      <div className="pkg-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pkg-modal__close" onClick={onClose}>✕</button>

        {/* gallery */}
        <div className="pkg-modal__gallery">
          <img src={images[activeImg]} alt={pkg.title} className="pkg-modal__main-img" />
          {images.length > 1 && (
            <div className="pkg-modal__thumbs">
              {images.map((img, i) => (
                <img
                  key={i} src={img} alt=""
                  className={`pkg-modal__thumb${activeImg === i ? " active" : ""}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* content */}
        <div className="pkg-modal__content">
          <div className="pkg-modal__header">
            <div>
              {pkg.category && <span className="pkg-modal__tag">{pkg.category}</span>}
              <h2 className="pkg-modal__title">{pkg.title}</h2>
              <p className="pkg-modal__location"><PinIcon /> {pkg.city}, {pkg.state}</p>
            </div>
            <div className="pkg-modal__price-block">
              <span className="pkg-modal__price">₹{pkg.price.toLocaleString("en-IN")}</span>
              <span className="pkg-modal__per">per person</span>
              <span className="pkg-modal__duration">{pkg.days}D / {pkg.nights}N</span>
            </div>
          </div>

          <p className="pkg-modal__desc">{pkg.description}</p>

          {pkg.highlights?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">Highlights</h3>
              <ul className="pkg-modal__highlights">
                {pkg.highlights.map((h, i) => (
                  <li key={i}><span className="pkg-modal__check">✓</span>{h}</li>
                ))}
              </ul>
            </section>
          )}

          {pkg.itinerary?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">Itinerary</h3>
              <ol className="pkg-modal__itinerary">
                {pkg.itinerary.map((day, i) => (
                  <li key={i}><span className="pkg-modal__day-dot" />{day}</li>
                ))}
              </ol>
            </section>
          )}

          {pkg.included?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">What's Included</h3>
              <ul className="pkg-modal__included">
                {pkg.included.map((item, i) => (
                  <li key={i}><span>✔</span>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {pkg.hotels?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">Hotels</h3>
              <div className="pkg-modal__cards-row">
                {pkg.hotels.map((h, i) => (
                  <div key={i} className="pkg-modal__info-card">
                    <span className="pkg-modal__info-icon">🏨</span>
                    <div>
                      <p className="pkg-modal__info-name">{h.name}</p>
                      <p className="pkg-modal__info-sub">
                        {h.type} · ₹{h.pricePerNight?.toLocaleString("en-IN")}/night
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {pkg.transport?.length > 0 && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">Transport Options</h3>
              <div className="pkg-modal__cards-row">
                {pkg.transport.map((t, i) => (
                  <div key={i} className="pkg-modal__info-card">
                    <span className="pkg-modal__info-icon">
                      {t.type === "Flight" ? "✈️" : t.type === "Train" ? "🚆" : t.type === "Ferry" ? "⛴️" : "🚌"}
                    </span>
                    <div>
                      <p className="pkg-modal__info-name">{t.type} — {t.provider}</p>
                      <p className="pkg-modal__info-sub">₹{t.price?.toLocaleString("en-IN")} per person</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {pkg.guideAvailable && (
            <section className="pkg-modal__section">
              <h3 className="pkg-modal__section-title">Travel Guide</h3>
              <div className="pkg-modal__guide-badge">
                <span>🧭</span>
                <div>
                  <p className="pkg-modal__info-name">Professional Guide Available</p>
                  {pkg.guideLanguages?.length > 0 && (
                    <p className="pkg-modal__info-sub">
                      Languages: {pkg.guideLanguages.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          <button className="pkg-modal__book-btn" onClick={handleBook}>
            Book This Package
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="pkg-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="pkg-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
