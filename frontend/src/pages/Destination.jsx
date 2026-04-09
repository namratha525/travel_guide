// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./Destination.css";

// function Destinations() {

//   const [states, setStates] = useState([]);
//   const [places, setPlaces] = useState([]);

//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedPlace, setSelectedPlace] = useState(null);

//   const [showSuggestions, setShowSuggestions] = useState(false);

//   // LOAD STATES

//   useEffect(() => {

//     axios
//       .get("http://localhost:5000/api/states")
//       .then((res) => setStates(res.data.states))
//       .catch((err) => console.log(err));

//   }, []);

//   // SEARCH API

//   const handleSearchChange = async (e) => {

//     const value = e.target.value;

//     setSearch(value);
//     setShowSuggestions(true);

//     if (value.length > 1) {

//       try {

//         const res = await axios.get(
//           `http://localhost:5000/api/search?q=${value}`
//         );

//         const results = [
//           ...res.data.states,
//           ...res.data.destinations,
//         ];

//         setSuggestions(results);

//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };

//   // CLICK SUGGESTION

//   const handleSuggestionClick = async (item) => {

//     setShowSuggestions(false);
//     setSearch(item.name);

//     if (item.type === "state") {

//       setSelectedState(item);

//       const res = await axios.get(
//         `http://localhost:5000/api/destinations/${item._id}`
//       );

//       setPlaces(res.data);

//     } else {

//       setSelectedPlace(item);

//     }
//   };

//   // CLICK STATE CARD

//   const handleStateClick = async (state) => {

//     setSelectedState(state);
//     setSelectedPlace(null);

//     const res = await axios.get(
//       `http://localhost:5000/api/destinations/${state._id}`
//     );

//     setPlaces(res.data);
//   };

//   return (

//     <div className="destinations-page">

//       <h1 className="title">Explore India</h1>

//       {/* SEARCH BAR */}

//       <div className="search-container">

//         <input
//           type="text"
//           placeholder="Search state or tourist place..."
//           value={search}
//           onChange={handleSearchChange}
//         />

//         {showSuggestions && search && (

//           <div className="suggestions">

//             {suggestions.map((item) => (

//               <div
//                 key={item._id}
//                 className="suggestion-item"
//                 onClick={() => handleSuggestionClick(item)}
//               >

//                 {item.name}

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//       {/* STATES GRID */}
//         <h2>States</h2>

//       {!selectedState && (
//         <div className="states-grid">
          

//           {states.map((state) => (

//             <div
//               key={state._id}
//               className="state-card"
//               onClick={() => handleStateClick(state)}
//             >

//               <img src={state.image} alt={state.name} />

//               <h3>{state.name}</h3>

//             </div>

//           ))}

//         </div>

//       )}

//       {/* PLACES GRID */}

//       {selectedState && (

//         <div className="places-section">

//           <h2>{selectedState.name} Destinations</h2>

//           <button
//             className="back-btn"
//             onClick={() => {
//               setSelectedState(null);
//               setPlaces([]);
//               setSelectedPlace(null);
//             }}
//           >
//             ← Back to States
//           </button>

//           <div className="places-grid">

//             {places.map((place) => (

//               <div
//                 key={place._id}
//                 className="place-card"
//                 onClick={() => setSelectedPlace(place)}
//               >

//                 <h3>{place.name}</h3>

//                 <p>{place.description}</p>

//               </div>

//             ))}

//           </div>

//         </div>

//       )}

//       {/* PREVIEW PANEL */}

//       {selectedPlace && (

//         <div className="preview-panel">

//           <div className="preview-content">

//             <h2>{selectedPlace.name}</h2>

//             <p>{selectedPlace.description}</p>

//             <button className="view-btn">
//               View Details
//             </button>

//             <button
//               className="close-btn"
//               onClick={() => setSelectedPlace(null)}
//             >
//               Close
//             </button>

//           </div>

//         </div>

//       )}

//     </div>

//   );
// }

// export default Destinations;
// frontend/src/pages/Destination.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  fetchRegions,
  fetchStatesByRegion,
  fetchDestinationsByState,
} from "../api/destinationApi";
import "./Destination.css";

// ── main page ─────────────────────────────────────────────────────────────────
export default function Destination() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedState,  setSelectedState]  = useState(null);

  const goHome   = () => { setSelectedRegion(null); setSelectedState(null); };
  const goRegion = () => setSelectedState(null);

  // Level 3 — destinations of a state
  if (selectedState) {
    return (
      <DestinationsLevel
        title={<>Explore <span>{selectedState.name}</span></>}
        subtitle="Famous destinations waiting for you"
        breadcrumbs={[
          { label: "Regions",           onClick: goHome   },
          { label: selectedRegion.name, onClick: goRegion },
          { label: selectedState.name,  onClick: null     },
        ]}
        fetcher={() => fetchDestinationsByState(selectedState._id)}
        renderCard={(dest) => <DestinationCard key={dest._id} dest={dest} />}
      />
    );
  }

  // Level 2 — states of a region
  if (selectedRegion) {
    return (
      <DestinationsLevel
        title={<>States of <span>{selectedRegion.name}</span></>}
        subtitle="Choose a state to explore"
        breadcrumbs={[
          { label: "Regions",           onClick: goHome },
          { label: selectedRegion.name, onClick: null   },
        ]}
        fetcher={() => fetchStatesByRegion(selectedRegion._id)}
        renderCard={(state) => (
          <RegionCard
            key={state._id}
            name={state.name}
            image={state.image}
            onClick={() => setSelectedState(state)}
          />
        )}
      />
    );
  }

  // Level 1 — all regions
  return (
    <DestinationsLevel
      hero
      fetcher={fetchRegions}
      renderCard={(region) => (
        <RegionCard
          key={region._id}
          name={region.name}
          image={region.image}
          onClick={() => setSelectedRegion(region)}
          large
        />
      )}
    />
  );
}

// ── generic level — handles fetch / loading / error / empty ───────────────────
function DestinationsLevel({ hero, title, subtitle, breadcrumbs, fetcher, renderCard }) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => { load(); }, [load]);

  return (
    <section className="dst-section">
      {breadcrumbs && <Breadcrumb crumbs={breadcrumbs} />}

      {hero ? (
        <div className="dst-hero">
          <p className="dst-hero-label">Discover India</p>
          <h1 className="dst-hero-title">Where do you want<br />to wander?</h1>
          <p className="dst-hero-sub">
            Pick a region and we'll guide you to the finest destinations
            across the subcontinent.
          </p>
        </div>
      ) : (
        <>
          <h1 className="dst-heading">{title}</h1>
          <p className="dst-subheading">{subtitle}</p>
        </>
      )}

      {loading && <LoadingGrid />}

      {!loading && error && (
        <div className="dst-error">
          <p className="dst-error__msg">{error}</p>
          <button className="dst-retry-btn" onClick={load}>Try Again</button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="dst-empty">No results found.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className={`dst-grid${hero ? " dst-grid--regions" : ""}`}>
          {items.map(renderCard)}
        </div>
      )}
    </section>
  );
}

// ── region / state card (clickable) ──────────────────────────────────────────
function RegionCard({ name, image, onClick, large }) {
  return (
    <article
      className={`dst-card dst-card--region${large ? " dst-card--large" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="dst-card__img-wrap">
        <img src={image} alt={name} className="dst-card__img" loading="lazy" />
        <div className="dst-card__overlay" />
      </div>
      <div className="dst-card__body">
        <h2 className="dst-card__name">{name}</h2>
        <span className="dst-card__cta">Explore <ArrowIcon /></span>
      </div>
    </article>
  );
}

// ── destination card (info only, no click) ────────────────────────────────────
function DestinationCard({ dest }) {
  return (
    <article className="dst-card dst-card--dest">
      <div className="dst-card__img-wrap">
        <img src={dest.image} alt={dest.name} className="dst-card__img" loading="lazy" />
        <div className="dst-card__overlay" />
      </div>
      <div className="dst-card__body dst-card__body--dest">
        <h2 className="dst-card__name">{dest.name}</h2>
        <p className="dst-card__desc">{dest.description}</p>
        {dest.bestTimeToVisit && (
          <div className="dst-card__badge">
            <CalendarIcon />
            <span>Best time: <strong>{dest.bestTimeToVisit}</strong></span>
          </div>
        )}
      </div>
    </article>
  );
}

// ── breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({ crumbs }) {
  return (
    <nav className="dst-breadcrumb" aria-label="breadcrumb">
      {crumbs.map((c, i) => (
        <React.Fragment key={c.label}>
          {i > 0 && <span className="dst-breadcrumb__sep">›</span>}
          {c.onClick ? (
            <button className="dst-breadcrumb__link" onClick={c.onClick}>
              {c.label}
            </button>
          ) : (
            <span className="dst-breadcrumb__current">{c.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ── skeleton loader ───────────────────────────────────────────────────────────
function LoadingGrid() {
  return (
    <div className="dst-grid dst-grid--skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="dst-skeleton"
          style={{ animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}

// ── icons ─────────────────────────────────────────────────────────────────────
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </svg>
  );
}
