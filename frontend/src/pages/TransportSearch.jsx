// frontend/src/pages/TransportSearch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./TransportSearch.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TABS = [
  { key: "flight", label: "Flights",  icon: "✈️" },
  { key: "train",  label: "Trains",   icon: "🚆" },
  { key: "bus",    label: "Buses",    icon: "🚌" },
  { key: "ferry",  label: "Ferry",    icon: "⛴️" },
];

export default function TransportSearch() {
  const navigate      = useNavigate();
  const [params]      = useSearchParams();

  // From packages flow: packageId, packageTitle
  const packageId     = params.get("packageId");
  const packageTitle  = params.get("packageTitle");

  // From destination booking flow: destBookingId, destName
  const destBookingId = params.get("destBookingId");
  const destName      = params.get("destName");

  const destination   = params.get("destination") || destName || "";

  const [origin,       setOrigin]       = useState("");
  const [suggestions,  setSuggestions]  = useState([]);
  const [showSugg,     setShowSugg]     = useState(false);
  const [date,         setDate]         = useState(new Date().toISOString().split("T")[0]);
  const [results,      setResults]      = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [activeTab,    setActiveTab]    = useState("flight");
  const inputRef = useRef(null);

  // ── Autocomplete ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (origin.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/flights/airports?q=${encodeURIComponent(origin)}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSugg(true);
      } catch { setSuggestions([]); }
    }, 250);
    return () => clearTimeout(timer);
  }, [origin]);

  // ── Search ──────────────────────────────────────────────────────────────────
  async function handleSearch() {
    if (!origin.trim()) { alert("Please enter your boarding city."); return; }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(
        `${API_BASE}/flights/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}`
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Search failed");
      }
      const data = await res.json();
      setResults(data);
      // Auto-switch to first tab that has results
      if (data.flights?.length)       setActiveTab("flight");
      else if (data.trains?.length)   setActiveTab("train");
      else if (data.buses?.length)    setActiveTab("bus");
      else if (data.ferries?.length)  setActiveTab("ferry");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Select transport & go back ──────────────────────────────────────────────
  function handleSelect(item) {
    // Normalize the selected transport object
    const transport = {
      type:     item.type,
      price:    item.price,
      dep:      item.departure,
      arr:      item.arrival,
      dur:      item.duration,
      class:    item.class,
      provider: item.airline || item.trainName || item.busOperator || item.ferryOperator || "",
      number:   item.flightNumber || item.trainNumber || "",
    };

    if (destBookingId) {
      // Return to DestinationBooking
      navigate(`/destination-booking/${destBookingId}`, {
        state: { selectedTransport: transport },
      });
    } else if (packageId) {
      // Return to Package Booking
      navigate(`/booking/${packageId}`, {
        state: { selectedTransport: transport },
      });
    } else {
      navigate(-1);
    }
  }

  // ── Tab data ────────────────────────────────────────────────────────────────
  function getTabItems() {
    if (!results) return [];
    switch (activeTab) {
      case "flight": return results.flights  || [];
      case "train":  return results.trains   || [];
      case "bus":    return results.buses    || [];
      case "ferry":  return results.ferries  || [];
      default:       return [];
    }
  }

  function getTabCount(key) {
    if (!results) return 0;
    switch (key) {
      case "flight": return results.flights?.length  || 0;
      case "train":  return results.trains?.length   || 0;
      case "bus":    return results.buses?.length    || 0;
      case "ferry":  return results.ferries?.length  || 0;
      default:       return 0;
    }
  }

  const items = getTabItems();

  return (
    <div className="ts-page">
      {/* Header */}
      <div className="ts-header">
        <button className="ts-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="ts-header__text">
          <p className="ts-header__label">Transport Search</p>
          <h1 className="ts-header__title">
            How are you reaching <span>{destination}</span>?
          </h1>
          {(packageTitle || destName) && (
            <p className="ts-header__sub">
              For: {packageTitle || destName}
            </p>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className="ts-search-bar">
        <div className="ts-search-row">
          <div className="ts-field ts-field--origin" ref={inputRef}>
            <label className="ts-label">From</label>
            <input
              className="ts-form__input"
              placeholder="Enter boarding city (e.g. Delhi, Mumbai)"
              value={origin}
              onChange={(e) => { setOrigin(e.target.value); setShowSugg(true); }}
              onBlur={() => setTimeout(() => setShowSugg(false), 180)}
            />
            {showSugg && suggestions.length > 0 && (
              <div className="ts-suggestions">
                {suggestions.map((s) => (
                  <div
                    key={s.code}
                    className="ts-suggestions__item"
                    onMouseDown={() => { setOrigin(s.city); setShowSugg(false); }}
                  >
                    <span className="ts-suggestions__code">{s.code}</span>
                    <span className="ts-suggestions__city">{s.city}</span>
                    <span className="ts-suggestions__name">{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ts-field ts-field--dest">
            <label className="ts-label">To</label>
            <input
              className="ts-form__input ts-form__input--readonly"
              value={destination}
              readOnly
            />
          </div>

          <div className="ts-field ts-field--date">
            <label className="ts-label">Date</label>
            <input
              type="date"
              className="ts-form__input"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button className="ts-form__btn" onClick={handleSearch} disabled={loading}>
            {loading ? <span className="ts-btn-spinner" /> : "Search"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="ts-error">
          <p>⚠️ {error}</p>
          <p className="ts-error__hint">Try major cities like Delhi, Mumbai, Chennai, Kolkata, Bangalore</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="ts-results">
          {/* Tabs */}
          <div className="ts-tabs">
            {TABS.map((tab) => {
              const count = getTabCount(tab.key);
              return (
                <button
                  key={tab.key}
                  className={`ts-tab${activeTab === tab.key ? " active" : ""}${count === 0 ? " disabled" : ""}`}
                  onClick={() => count > 0 && setActiveTab(tab.key)}
                >
                  <span className="ts-tab__icon">{tab.icon}</span>
                  <span className="ts-tab__label">{tab.label}</span>
                  {count > 0 && <span className="ts-tab__count">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Route info */}
          <div className="ts-route-info">
            <span className="ts-route-info__from">{results.origin?.city || origin}</span>
            <span className="ts-route-info__arrow">→</span>
            <span className="ts-route-info__to">{results.destination?.city || destination}</span>
            <span className="ts-route-info__date">{new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
          </div>

          {/* Cards */}
          {items.length === 0 ? (
            <div className="ts-empty">
              <p>No {activeTab} options available for this route.</p>
              <p className="ts-empty__hint">Try a different tab or search route.</p>
            </div>
          ) : (
            <div className="ts-cards">
              {items.map((item) => (
                <TransportCard key={item.id} item={item} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!results && !loading && !error && (
        <div className="ts-idle">
          <div className="ts-idle__icons">✈️ 🚆 🚌 ⛴️</div>
          <p>Enter your boarding city and search to see all transport options</p>
        </div>
      )}
    </div>
  );
}

// ── Transport card ─────────────────────────────────────────────────────────────
function TransportCard({ item, onSelect }) {
  const icons = { flight: "✈️", train: "🚆", bus: "🚌", ferry: "⛴️" };

  const providerName =
    item.airline || item.trainName || item.busOperator || item.ferryOperator || "Transport";
  const providerSub  =
    item.flightNumber || item.trainNumber || item.busType || item.vesselName || "";

  return (
    <div className="ts-card">
      <div className="ts-card__left">
        <span className="ts-card__icon">{icons[item.type]}</span>
        <div className="ts-card__provider">
          <p className="ts-card__name">{providerName}</p>
          {providerSub && <p className="ts-card__sub">{providerSub}</p>}
        </div>
      </div>

      <div className="ts-card__timing">
        <span className="ts-card__time">{item.departure}</span>
        <div className="ts-card__line">
          <span className="ts-card__dur">{item.duration}</span>
          <div className="ts-card__dash" />
        </div>
        <span className="ts-card__time">{item.arrival}</span>
      </div>

      <div className="ts-card__class">
        <p className="ts-card__class-name">{item.class}</p>
        {item.seatsLeft <= 10 && (
          <p className="ts-card__seats">{item.seatsLeft} left</p>
        )}
      </div>

      <div className="ts-card__right">
        <p className="ts-card__price">₹{item.price?.toLocaleString("en-IN")}</p>
        <p className="ts-card__per">per person</p>
        <button className="ts-card__btn" onClick={() => onSelect(item)}>
          Select
        </button>
      </div>
    </div>
  );
}
