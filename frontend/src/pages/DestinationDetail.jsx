// frontend/src/pages/DestinationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DestinationDetail.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function DestinationDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [dest, setDest]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/destinations/detail/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Destination not found");
        return r.json();
      })
      .then((data) => { setDest(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="dd-loading">
      <div className="dd-spinner" />
      <p>Loading destination...</p>
    </div>
  );

  if (error || !dest) return (
    <div className="dd-error">
      <p>{error || "Destination not found."}</p>
      <button onClick={() => navigate("/destination")}>← Back</button>
    </div>
  );

  return (
    <div className="dd-page">
      {/* Hero */}
      <div className="dd-hero">
        <div className={`dd-hero__img-wrap ${imgLoaded ? "loaded" : ""}`}>
          <img
            src={dest.image}
            alt={dest.name}
            className="dd-hero__img"
            onLoad={() => setImgLoaded(true)}
          />
          <div className="dd-hero__gradient" />
        </div>

        <button className="dd-back-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <div className="dd-hero__content">
          <div className="dd-hero__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {dest.state || "India"}
          </div>
          <h1 className="dd-hero__title">{dest.name}</h1>
          {dest.bestTimeToVisit && (
            <div className="dd-hero__time">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
              Best time: <strong>{dest.bestTimeToVisit}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="dd-body">
        <div className="dd-body__left">
          <section className="dd-section">
            <h2 className="dd-section__title">About this Destination</h2>
            <p className="dd-section__text">{dest.description}</p>
          </section>

          {dest.highlights?.length > 0 && (
            <section className="dd-section">
              <h2 className="dd-section__title">Highlights</h2>
              <ul className="dd-highlights">
                {dest.highlights.map((h, i) => (
                  <li key={i} className="dd-highlights__item">
                    <span className="dd-highlights__dot" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="dd-section dd-facts">
            <h2 className="dd-section__title">Quick Facts</h2>
            <div className="dd-facts__grid">
              {dest.bestTimeToVisit && (
                <div className="dd-fact">
                  <span className="dd-fact__icon">🗓️</span>
                  <div>
                    <p className="dd-fact__label">Best Time</p>
                    <p className="dd-fact__value">{dest.bestTimeToVisit}</p>
                  </div>
                </div>
              )}
              {dest.state && (
                <div className="dd-fact">
                  <span className="dd-fact__icon">📍</span>
                  <div>
                    <p className="dd-fact__label">State</p>
                    <p className="dd-fact__value">{dest.state}</p>
                  </div>
                </div>
              )}
              {dest.region && (
                <div className="dd-fact">
                  <span className="dd-fact__icon">🗺️</span>
                  <div>
                    <p className="dd-fact__label">Region</p>
                    <p className="dd-fact__value">{dest.region}</p>
                  </div>
                </div>
              )}
              <div className="dd-fact">
                <span className="dd-fact__icon">🌡️</span>
                <div>
                  <p className="dd-fact__label">Climate</p>
                  <p className="dd-fact__value">Tropical / Varied</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar CTA */}
        <div className="dd-body__right">
          <div className="dd-cta-card">
            <div className="dd-cta-card__top">
              <p className="dd-cta-card__label">Ready to visit?</p>
              <h3 className="dd-cta-card__name">{dest.name}</h3>
              <p className="dd-cta-card__sub">
                Plan your perfect trip with flights, trains, buses, ferry, hotel & guide
              </p>
            </div>

            <div className="dd-cta-card__perks">
              <div className="dd-perk">✈️ <span>Flights & Trains</span></div>
              <div className="dd-perk">🚌 <span>Buses & Ferry</span></div>
              <div className="dd-perk">🏨 <span>Hotel selection</span></div>
              <div className="dd-perk">🧭 <span>Travel guide</span></div>
              <div className="dd-perk">💳 <span>Razorpay secured</span></div>
            </div>

            <button
              className="dd-book-btn"
              onClick={() =>
                navigate(`/destination-booking/${dest._id}`, { state: { destination: dest } })
              }
            >
              Book This Destination
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>

            <p className="dd-cta-card__secure">🔒 Safe & secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
