// frontend/src/pages/Destination.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchRegions,
  fetchStatesByRegion,
  fetchDestinationsByState,
} from "../api/destinationApi";
import "./Destination.css";

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

// ── Generic level ─────────────────────────────────────────────────────────────
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

// ── Region / State card (clickable) ──────────────────────────────────────────
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

// ── Destination card — NOW CLICKABLE → goes to DestinationDetail ──────────────
function DestinationCard({ dest }) {
  const navigate = useNavigate();

  return (
    <article
      className="dst-card dst-card--dest dst-card--clickable"
      onClick={() => navigate(`/destination-detail/${dest._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/destination-detail/${dest._id}`)}
    >
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
        {/* View details hint */}
        <span className="dst-card__cta dst-card__cta--dest">
          View Details <ArrowIcon />
        </span>
      </div>
    </article>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
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

// ── Skeleton loader ───────────────────────────────────────────────────────────
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

// ── Icons ─────────────────────────────────────────────────────────────────────
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
