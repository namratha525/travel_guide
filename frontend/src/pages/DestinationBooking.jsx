// frontend/src/pages/DestinationBooking.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./DestinationBooking.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() { return localStorage.getItem("token"); }

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── Mock hotels ──────────────────────────────────────────────────────────────
const MOCK_HOTELS = [
  { name: "The Grand Palace Hotel",  type: "5-Star Luxury",    pricePerNight: 8500  },
  { name: "Comfort Inn Suites",       type: "4-Star Comfort",   pricePerNight: 4200  },
  { name: "Heritage Haveli",          type: "Heritage Boutique", pricePerNight: 5800 },
  { name: "Budget Stay Inn",          type: "3-Star Budget",    pricePerNight: 1800  },
];

const GUIDE_LANGUAGES = ["English", "Hindi", "Tamil", "Bengali", "Telugu", "Marathi"];
const GUIDE_RATE = 1500; // per day

// ── Transport icons ──────────────────────────────────────────────────────────
const TRANSPORT_ICONS = {
  flight: "✈️",
  train:  "🚆",
  bus:    "🚌",
  ferry:  "⛴️",
};

export default function DestinationBooking() {
  const { id }    = useParams();
  const { state } = useLocation();
  const navigate  = useNavigate();

  const [dest, setDest]           = useState(state?.destination || null);
  const [loading, setLoading]     = useState(!state?.destination);
  const [paying, setPaying]       = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  // Booking form state
  const [travelDate, setTravelDate]       = useState("");
  const [travelers, setTravelers]         = useState(1);
  const [nights, setNights]               = useState(2);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [guideRequired, setGuideRequired] = useState(false);
  const [guideLanguage, setGuideLanguage] = useState("");

  // Transport state (set from TransportSearch page)
  const [selectedTransport, setSelectedTransport] = useState(
    state?.selectedTransport || null
  );

  // Fetch destination if not passed
  useEffect(() => {
    if (!dest && id) {
      fetch(`${API_BASE}/destinations/detail/${id}`)
        .then((r) => r.json())
        .then((data) => { setDest(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [id, dest]);

  // Razorpay script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const s = document.createElement("script");
    s.id = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  if (loading) return (
    <div className="db-loading">
      <div className="db-spinner" />
      <p>Loading booking details...</p>
    </div>
  );

  if (!dest) return (
    <div className="db-error">
      <p>Destination not found.</p>
      <button onClick={() => navigate("/destination")}>← Back</button>
    </div>
  );

  // ── Price calculation ────────────────────────────────────────────────────
  const BASE_PRICE     = 2500; // base destination visit price per person
  const hotelCost      = selectedHotel ? selectedHotel.pricePerNight * nights * travelers : 0;
  const transportCost  = selectedTransport ? selectedTransport.price * travelers : 0;
  const guideCost      = guideRequired ? GUIDE_RATE * nights : 0;
  const grandTotal     = BASE_PRICE * travelers + hotelCost + transportCost + guideCost;

  // ── Navigate to transport search ─────────────────────────────────────────
  function handleSearchTransport() {
    navigate(
      `/transport-search?destination=${encodeURIComponent(dest.name)}&destBookingId=${id}&destName=${encodeURIComponent(dest.name)}`
    );
  }

  // ── Razorpay payment ─────────────────────────────────────────────────────
  async function handlePayment() {
    if (!travelDate) { alert("Please select a travel date."); return; }

    try {
      setPaying(true);

      const order = await apiFetch("/payment/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: grandTotal }),
      });

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      order.amount,
        currency:    order.currency || "INR",
        name:        "Incredible India",
        description: `Trip to ${dest.name}`,
        order_id:    order.id,
        prefill:     { name: user.name || "", email: user.email || "" },
        theme:       { color: "#00bcd4" },

        handler: async (response) => {
          try {
            await apiFetch("/payment/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            });
            setPaymentId(response.razorpay_payment_id);
            setSubmitted(true);
          } catch {
            alert("Payment verification failed. Please contact support.");
          } finally {
            setPaying(false);
          }
        },

        modal: { ondismiss: () => setPaying(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) => {
        alert(`Payment failed: ${r.error.description}`);
        setPaying(false);
      });
      rzp.open();

    } catch (err) {
      alert(`Could not initiate payment: ${err.message}`);
      setPaying(false);
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="db-success">
        <div className="db-success__icon">✓</div>
        <h2>Booking Confirmed!</h2>
        <p>Your trip to <strong>{dest.name}</strong> has been booked successfully.</p>
        {paymentId && (
          <p className="db-success__pid">Payment ID: <code>{paymentId}</code></p>
        )}
        <p className="db-success__amount">Total Paid: ₹{grandTotal.toLocaleString("en-IN")}</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  // ── Main booking form ─────────────────────────────────────────────────────
  return (
    <div className="db-page">
      {/* Header */}
      <div className="db-header">
        <button className="db-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <p className="db-header-label">Destination Booking</p>
        <h1 className="db-header-title">{dest.name}</h1>
        <p className="db-header-sub">{dest.state} · {dest.region}</p>
      </div>

      <div className="db-layout">
        {/* LEFT */}
        <div className="db-left">

          {/* Trip Details */}
          <section className="db-section">
            <h2 className="db-section-title">Trip Details</h2>
            <div className="db-row">
              <div className="db-field">
                <label className="db-label">Travel Date</label>
                <input
                  type="date"
                  className="db-input"
                  value={travelDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>
              <div className="db-field">
                <label className="db-label">Travelers</label>
                <div className="db-stepper">
                  <button onClick={() => setTravelers(Math.max(1, travelers - 1))}>−</button>
                  <span>{travelers}</span>
                  <button onClick={() => setTravelers(Math.min(20, travelers + 1))}>+</button>
                </div>
              </div>
              <div className="db-field">
                <label className="db-label">Nights</label>
                <div className="db-stepper">
                  <button onClick={() => setNights(Math.max(1, nights - 1))}>−</button>
                  <span>{nights}</span>
                  <button onClick={() => setNights(Math.min(30, nights + 1))}>+</button>
                </div>
              </div>
            </div>
          </section>

          {/* Transport */}
          <section className="db-section">
            <h2 className="db-section-title">Transport</h2>

            {selectedTransport ? (
              <div className="db-transport-selected">
                <div className="db-transport-selected__info">
                  <span className="db-transport-selected__icon">
                    {TRANSPORT_ICONS[selectedTransport.type] || "🚗"}
                  </span>
                  <div>
                    <p className="db-transport-selected__name">
                      {selectedTransport.provider || selectedTransport.airline || selectedTransport.trainName || selectedTransport.busOperator || selectedTransport.ferryOperator}
                      {selectedTransport.number && ` · ${selectedTransport.number}`}
                      {selectedTransport.flightNumber && ` · ${selectedTransport.flightNumber}`}
                    </p>
                    <p className="db-transport-selected__detail">
                      {selectedTransport.dep || selectedTransport.departure} → {selectedTransport.arr || selectedTransport.arrival}
                      {selectedTransport.class && ` · ${selectedTransport.class}`}
                      {selectedTransport.dur || selectedTransport.duration ? ` · ${selectedTransport.dur || selectedTransport.duration}` : ""}
                    </p>
                  </div>
                </div>
                <div className="db-transport-selected__right">
                  <p className="db-transport-selected__price">
                    ₹{selectedTransport.price?.toLocaleString("en-IN")}
                    <span>/person</span>
                  </p>
                  <button className="db-transport-change-btn" onClick={handleSearchTransport}>
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="db-transport-prompt">
                <div className="db-transport-tabs-preview">
                  <span>✈️ Flights</span>
                  <span>🚆 Trains</span>
                  <span>🚌 Buses</span>
                  <span>⛴️ Ferry</span>
                </div>
                <div className="db-transport-prompt__text">
                  <p className="db-transport-prompt__title">Find the best way to reach {dest.name}</p>
                  <p className="db-transport-prompt__sub">
                    Enter your boarding city to see flights, trains, buses & ferries
                  </p>
                </div>
                <button className="db-transport-search-btn" onClick={handleSearchTransport}>
                  🔍 Search Transport Options
                </button>
              </div>
            )}
          </section>

          {/* Hotels */}
          <section className="db-section">
            <h2 className="db-section-title">Choose Hotel</h2>
            <div className="db-options">
              {MOCK_HOTELS.map((h, i) => (
                <div
                  key={i}
                  className={`db-option${selectedHotel?.name === h.name ? " selected" : ""}`}
                  onClick={() => setSelectedHotel(h)}
                >
                  <div className="db-option__icon">🏨</div>
                  <div className="db-option__info">
                    <p className="db-option__name">{h.name}</p>
                    <p className="db-option__sub">{h.type}</p>
                  </div>
                  <div className="db-option__price">
                    <span>₹{h.pricePerNight.toLocaleString("en-IN")}</span>
                    <span className="db-option__per">/night</span>
                  </div>
                  {selectedHotel?.name === h.name && <span className="db-option__check">✓</span>}
                </div>
              ))}
              <div
                className={`db-option${!selectedHotel ? " selected" : ""}`}
                onClick={() => setSelectedHotel(null)}
              >
                <div className="db-option__icon">🏠</div>
                <div className="db-option__info">
                  <p className="db-option__name">Own Arrangement</p>
                  <p className="db-option__sub">I'll book my own hotel</p>
                </div>
                <div className="db-option__price"><span>Free</span></div>
                {!selectedHotel && <span className="db-option__check">✓</span>}
              </div>
            </div>
          </section>

          {/* Travel Guide */}
          <section className="db-section">
            <h2 className="db-section-title">Travel Guide</h2>
            <div className="db-guide-toggle">
              <div className="db-guide-info">
                <span className="db-guide-icon">🧭</span>
                <div>
                  <p className="db-option__name">Professional Guide</p>
                  <p className="db-option__sub">₹1,500/day · Multilingual</p>
                </div>
              </div>
              <label className="db-toggle">
                <input
                  type="checkbox"
                  checked={guideRequired}
                  onChange={(e) => setGuideRequired(e.target.checked)}
                />
                <span className="db-toggle__slider" />
              </label>
            </div>

            {guideRequired && (
              <div className="db-field" style={{ marginTop: "14px" }}>
                <label className="db-label">Preferred Language</label>
                <select
                  className="db-input"
                  value={guideLanguage}
                  onChange={(e) => setGuideLanguage(e.target.value)}
                >
                  <option value="">Select language</option>
                  {GUIDE_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: Summary */}
        <div className="db-right">
          <div className="db-summary">
            <img src={dest.image} alt={dest.name} className="db-summary__img" />
            <div className="db-summary__body">
              <h3 className="db-summary__title">{dest.name}</h3>
              <p className="db-summary__sub">{dest.state}</p>
              <p className="db-summary__sub">{nights} night{nights > 1 ? "s" : ""} · {travelers} traveler{travelers > 1 ? "s" : ""}</p>

              <div className="db-summary__breakdown">
                <div className="db-summary__row">
                  <span>Base price ({travelers}x)</span>
                  <span>₹{(BASE_PRICE * travelers).toLocaleString("en-IN")}</span>
                </div>
                {hotelCost > 0 && (
                  <div className="db-summary__row">
                    <span>Hotel ({nights} nights)</span>
                    <span>₹{hotelCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {transportCost > 0 && (
                  <div className="db-summary__row">
                    <span>Transport ({travelers}x)</span>
                    <span>₹{transportCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {guideCost > 0 && (
                  <div className="db-summary__row">
                    <span>Guide ({nights} days)</span>
                    <span>₹{guideCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="db-summary__total">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                className="db-confirm-btn"
                onClick={handlePayment}
                disabled={paying}
              >
                {paying ? "Processing..." : `Pay ₹${grandTotal.toLocaleString("en-IN")}`}
              </button>

              <p className="db-secure-note">
                🔒 Secured by Razorpay · UPI, Cards, NetBanking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
