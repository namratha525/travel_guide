import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchTransport, searchAirports } from "../api/transportApi";
import "./TransportSearch.css";

export default function TransportSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const destination  = searchParams.get("destination") || "";
  const packageId    = searchParams.get("packageId")   || "";
  const packageTitle = searchParams.get("packageTitle")|| "";

  const [origin,      setOrigin]      = useState("");
  const [date,        setDate]        = useState("");
  const [results,     setResults]     = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [activeTab,   setActiveTab]   = useState("flight");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug,     setShowSug]     = useState(false);
  const sugRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handler(e) {
      if (sugRef.current && !sugRef.current.contains(e.target)) setShowSug(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch airport suggestions
  useEffect(() => {
    if (origin.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const data = await searchAirports(origin);
        setSuggestions(data);
        setShowSug(true);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [origin]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!origin.trim()) { setError("Please enter your boarding city."); return; }
    setError("");
    setLoading(true);
    setResults(null);
    try {
      const data = await searchTransport(origin, destination, date);
      setResults(data);
      setActiveTab(data.flights.length > 0 ? "flight" : "train");
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(item) {
    navigate(`/booking/${packageId}`, {
      state: {
        selectedTransport: {
          type:     item.type,
          provider: item.type === "flight" ? item.airline : item.trainName,
          number:   item.type === "flight" ? item.flightNumber : item.trainNumber,
          class:    item.class || "Economy",
          dep:      item.departure,
          arr:      item.arrival,
          dur:      item.duration,
          price:    item.price,
        },
      },
    });
  }

  const today = new Date().toISOString().split("T")[0];
  const flights = results?.flights || [];
  const trains  = results?.trains  || [];

  return (
    <div className="ts-page">
      {/* ── Hero ── */}
      <div className="ts-hero">
        <div className="ts-hero__inner">
          <p className="ts-hero__eyebrow">
            {packageTitle ? `✈️ Transport for: ${packageTitle}` : "Search Transport"}
          </p>
          <h1 className="ts-hero__title">
            Where are you<br />flying from?
          </h1>
          <p className="ts-hero__dest">
            Destination: <strong>{destination || "—"}</strong>
          </p>
        </div>
      </div>

      {/* ── Search form ── */}
      <div className="ts-form-wrap">
        <form className="ts-form" onSubmit={handleSearch}>
          {/* Origin */}
          <div className="ts-form__group" ref={sugRef}>
            <label className="ts-form__label">Boarding City / Airport</label>
            <div className="ts-form__input-wrap">
              <span className="ts-form__icon">🛫</span>
              <input
                className="ts-form__input"
                type="text"
                placeholder="e.g. Delhi, Mumbai, Kolkata..."
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onFocus={() => suggestions.length && setShowSug(true)}
                autoComplete="off"
              />
            </div>
            {showSug && suggestions.length > 0 && (
              <ul className="ts-suggestions">
                {suggestions.map((s) => (
                  <li
                    key={s.code}
                    className="ts-suggestions__item"
                    onMouseDown={() => { setOrigin(s.city); setShowSug(false); }}
                  >
                    <span className="ts-suggestions__code">{s.code}</span>
                    <span className="ts-suggestions__name">{s.city} — {s.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Destination (read-only) */}
          <div className="ts-form__group">
            <label className="ts-form__label">Destination</label>
            <div className="ts-form__input-wrap">
              <span className="ts-form__icon">🛬</span>
              <input
                className="ts-form__input ts-form__input--readonly"
                type="text"
                value={destination}
                readOnly
              />
            </div>
          </div>

          {/* Date */}
          <div className="ts-form__group">
            <label className="ts-form__label">Travel Date</label>
            <div className="ts-form__input-wrap">
              <span className="ts-form__icon">📅</span>
              <input
                className="ts-form__input"
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <button className="ts-form__btn" type="submit" disabled={loading}>
            {loading ? <span className="ts-spinner" /> : "Search Flights & Trains"}
          </button>
        </form>

        {error && <p className="ts-error">{error}</p>}
      </div>

      {/* ── Results ── */}
      {results && (
        <div className="ts-results">
          <div className="ts-results__header">
            <span className="ts-results__route">
              {results.origin.city} → {results.destination.city}
            </span>
            <span className="ts-results__date">{results.date}</span>
          </div>

          {/* Tabs */}
          <div className="ts-tabs">
            <button
              className={`ts-tab${activeTab === "flight" ? " active" : ""}`}
              onClick={() => setActiveTab("flight")}
            >
              ✈️ Flights <span className="ts-tab__count">{flights.length}</span>
            </button>
            <button
              className={`ts-tab${activeTab === "train" ? " active" : ""}`}
              onClick={() => setActiveTab("train")}
            >
              🚆 Trains <span className="ts-tab__count">{trains.length}</span>
            </button>
          </div>

          {/* Flight cards */}
          {activeTab === "flight" && (
            <div className="ts-cards">
              {flights.length === 0 ? (
                <p className="ts-empty">No flights found for this route.</p>
              ) : (
                flights.map((f) => (
                  <div className="ts-card" key={f.id}>
                    <div className="ts-card__left">
                      <p className="ts-card__airline">{f.airline}</p>
                      <p className="ts-card__num">{f.flightNumber}</p>
                    </div>
                    <div className="ts-card__times">
                      <div className="ts-card__time-block">
                        <span className="ts-card__time">{f.departure}</span>
                        <span className="ts-card__city">{f.originCity}</span>
                      </div>
                      <div className="ts-card__mid">
                        <span className="ts-card__dur">{f.duration}</span>
                        <div className="ts-card__line">
                          <span className="ts-card__dot" />
                          <span className="ts-card__track" />
                          <span className="ts-card__dot" />
                        </div>
                        <span className="ts-card__stops">
                          {f.stops === 0 ? "Non-stop" : `${f.stops} stop`}
                        </span>
                      </div>
                      <div className="ts-card__time-block ts-card__time-block--right">
                        <span className="ts-card__time">{f.arrival}</span>
                        <span className="ts-card__city">{f.destinationCity}</span>
                      </div>
                    </div>
                    <div className="ts-card__right">
                      <p className="ts-card__price">₹{f.price.toLocaleString("en-IN")}</p>
                      <p className="ts-card__seats">{f.seatsLeft} seats left</p>
                      <p className="ts-card__bag">{f.baggage}</p>
                      <button className="ts-card__btn" onClick={() => handleSelect(f)}>
                        Select
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Train cards */}
          {activeTab === "train" && (
            <div className="ts-cards">
              {trains.length === 0 ? (
                <p className="ts-empty">No trains found for this route. Try flights instead.</p>
              ) : (
                trains.map((t) => (
                  <div className="ts-card" key={t.id}>
                    <div className="ts-card__left">
                      <p className="ts-card__airline">{t.trainName}</p>
                      <p className="ts-card__num">#{t.trainNumber}</p>
                    </div>
                    <div className="ts-card__times">
                      <div className="ts-card__time-block">
                        <span className="ts-card__time">{t.departure}</span>
                        <span className="ts-card__city">{t.originCity}</span>
                      </div>
                      <div className="ts-card__mid">
                        <span className="ts-card__dur">{t.duration}</span>
                        <div className="ts-card__line">
                          <span className="ts-card__dot" />
                          <span className="ts-card__track" />
                          <span className="ts-card__dot" />
                        </div>
                        <span className="ts-card__stops">Indian Railways</span>
                      </div>
                      <div className="ts-card__time-block ts-card__time-block--right">
                        <span className="ts-card__time">{t.arrival}</span>
                        <span className="ts-card__city">{t.destinationCity}</span>
                      </div>
                    </div>
                    <div className="ts-card__right">
                      <p className="ts-card__class">{t.class}</p>
                      <p className="ts-card__price">₹{t.price.toLocaleString("en-IN")}</p>
                      <p className="ts-card__seats">{t.seatsLeft} seats</p>
                      <button className="ts-card__btn" onClick={() => handleSelect(t)}>
                        Select
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
