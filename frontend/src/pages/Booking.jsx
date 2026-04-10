import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchPackageById } from "../api/packageApi";
import "./Booking.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

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

export default function Booking() {
  const { id }    = useParams();
  const { state } = useLocation();
  const navigate  = useNavigate();

  const [pkg,               setPkg]               = useState(state?.package || null);
  const [loading,           setLoading]           = useState(!state?.package);
  const [paying,            setPaying]            = useState(false);
  const [selectedHotel,     setSelectedHotel]     = useState(null);
  const [guideRequired,     setGuideRequired]     = useState(false);
  const [guideLanguage,     setGuideLanguage]     = useState("");
  const [travelers,         setTravelers]         = useState(1);
  const [travelDate,        setTravelDate]        = useState("");
  const [submitted,         setSubmitted]         = useState(false);
  const [paymentId,         setPaymentId]         = useState(null);

  // Transport selected from TransportSearch page
  const [selectedTransport, setSelectedTransport] = useState(
    state?.selectedTransport || null
  );

  // Fetch package if not passed via navigate state
  useEffect(() => {
    if (!pkg && id) {
      fetchPackageById(id)
        .then(setPkg)
        .catch(() => setPkg(null))
        .finally(() => setLoading(false));
    }
  }, [id, pkg]);

  // Load Razorpay script dynamically
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const script = document.createElement("script");
    script.id  = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (loading) {
    return (
      <div className="bk-loading">
        <div className="bk-loading__spinner" />
        <p>Loading package details...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="bk-no-pkg">
        <p>Package not found.</p>
        <button onClick={() => navigate("/packages")}>Browse Packages</button>
      </div>
    );
  }

  // ── price calculation ────────────────────────────────────────────────────
  const hotelCost     = selectedHotel     ? selectedHotel.pricePerNight * pkg.nights * travelers : 0;
  const transportCost = selectedTransport ? selectedTransport.price * travelers                   : 0;
  const guideCost     = guideRequired     ? 1500 * pkg.days                                       : 0;
  const grandTotal    = pkg.price * travelers + hotelCost + transportCost + guideCost;

  // ── Navigate to transport search ─────────────────────────────────────────
  function handleSearchTransport() {
    const destCity = pkg.city || pkg.state || "";
    navigate(
      `/transport-search?destination=${encodeURIComponent(destCity)}&packageId=${id}&packageTitle=${encodeURIComponent(pkg.title)}`
    );
  }

  // ── Razorpay payment flow ─────────────────────────────────────────────────
  const handlePayment = async () => {
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
        description: pkg.title,
        order_id:    order.id,
        prefill: {
          name:  user.name  || "",
          email: user.email || "",
        },
        theme: { color: "#00bcd4" },

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
      rzp.on("payment.failed", (response) => {
        alert(`Payment failed: ${response.error.description}`);
        setPaying(false);
      });
      rzp.open();

    } catch (err) {
      alert(`Could not initiate payment: ${err.message}`);
      setPaying(false);
    }
  };

  // ── success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bk-success">
        <div className="bk-success__icon">✓</div>
        <h2>Booking Confirmed!</h2>
        <p>Your trip to <strong>{pkg.title}</strong> has been booked successfully.</p>
        {paymentId && (
          <p className="bk-success__pid">Payment ID: <code>{paymentId}</code></p>
        )}
        <p className="bk-success__amount">Total Paid: ₹{grandTotal.toLocaleString("en-IN")}</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  // ── main booking form ─────────────────────────────────────────────────────
  return (
    <div className="bk-page">
      {/* header */}
      <div className="bk-header">
        <button className="bk-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <p className="bk-header-label">Booking</p>
        <h1 className="bk-header-title">{pkg.title}</h1>
        <p className="bk-header-sub">
          {pkg.city}, {pkg.state} · {pkg.days}D / {pkg.nights}N
        </p>
      </div>

      <div className="bk-layout">
        {/* LEFT */}
        <div className="bk-left">

          {/* trip details */}
          <section className="bk-section">
            <h2 className="bk-section-title">Trip Details</h2>
            <div className="bk-row">
              <div className="bk-field">
                <label className="bk-label">Travel Date</label>
                <input
                  type="date"
                  className="bk-input"
                  value={travelDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>
              <div className="bk-field">
                <label className="bk-label">Travelers</label>
                <div className="bk-stepper">
                  <button onClick={() => setTravelers(Math.max(1, travelers - 1))}>−</button>
                  <span>{travelers}</span>
                  <button onClick={() => setTravelers(Math.min(20, travelers + 1))}>+</button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Transport section ── */}
          <section className="bk-section">
            <h2 className="bk-section-title">Transport</h2>

            {selectedTransport ? (
              /* Show selected transport */
              <div className="bk-transport-selected">
                <div className="bk-transport-selected__info">
                  <span className="bk-transport-selected__icon">
                    {selectedTransport.type === "flight" ? "✈️" : "🚆"}
                  </span>
                  <div>
                    <p className="bk-transport-selected__name">
                      {selectedTransport.provider}
                      {selectedTransport.number && ` · ${selectedTransport.number}`}
                    </p>
                    <p className="bk-transport-selected__detail">
                      {selectedTransport.dep} → {selectedTransport.arr}
                      {selectedTransport.class && ` · ${selectedTransport.class}`}
                      {selectedTransport.dur && ` · ${selectedTransport.dur}`}
                    </p>
                  </div>
                </div>
                <div className="bk-transport-selected__right">
                  <p className="bk-transport-selected__price">
                    ₹{selectedTransport.price?.toLocaleString("en-IN")}
                    <span>/person</span>
                  </p>
                  <button
                    className="bk-transport-change-btn"
                    onClick={handleSearchTransport}
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              /* Search prompt */
              <div className="bk-transport-prompt">
                <div className="bk-transport-prompt__text">
                  <p className="bk-transport-prompt__title">Find the best flights & trains</p>
                  <p className="bk-transport-prompt__sub">
                    Enter your boarding city to see real-time options to {pkg.city || pkg.state}
                  </p>
                </div>
                <button className="bk-transport-search-btn" onClick={handleSearchTransport}>
                  🔍 Search Flights & Trains
                </button>
              </div>
            )}
          </section>

          {/* hotels */}
          {pkg.hotels?.length > 0 && (
            <section className="bk-section">
              <h2 className="bk-section-title">Choose Hotel</h2>
              <div className="bk-options">
                {pkg.hotels.map((h, i) => (
                  <div
                    key={i}
                    className={`bk-option${selectedHotel?.name === h.name ? " selected" : ""}`}
                    onClick={() => setSelectedHotel(h)}
                  >
                    <div className="bk-option__icon">🏨</div>
                    <div className="bk-option__info">
                      <p className="bk-option__name">{h.name}</p>
                      <p className="bk-option__sub">{h.type}</p>
                    </div>
                    <div className="bk-option__price">
                      <span>₹{h.pricePerNight?.toLocaleString("en-IN")}</span>
                      <span className="bk-option__per">/night</span>
                    </div>
                    {selectedHotel?.name === h.name && <span className="bk-option__check">✓</span>}
                  </div>
                ))}
                <div
                  className={`bk-option${!selectedHotel ? " selected" : ""}`}
                  onClick={() => setSelectedHotel(null)}
                >
                  <div className="bk-option__icon">🏠</div>
                  <div className="bk-option__info">
                    <p className="bk-option__name">Own Arrangement</p>
                    <p className="bk-option__sub">I'll book my own hotel</p>
                  </div>
                  <div className="bk-option__price"><span>Free</span></div>
                  {!selectedHotel && <span className="bk-option__check">✓</span>}
                </div>
              </div>
            </section>
          )}

          {/* travel guide */}
          {pkg.guideAvailable && (
            <section className="bk-section">
              <h2 className="bk-section-title">Travel Guide</h2>
              <div className="bk-guide-toggle">
                <div className="bk-guide-info">
                  <span className="bk-guide-icon">🧭</span>
                  <div>
                    <p className="bk-option__name">Professional Guide</p>
                    <p className="bk-option__sub">
                      ₹1,500/day · Languages: {pkg.guideLanguages?.join(", ")}
                    </p>
                  </div>
                </div>
                <label className="bk-toggle">
                  <input
                    type="checkbox"
                    checked={guideRequired}
                    onChange={(e) => setGuideRequired(e.target.checked)}
                  />
                  <span className="bk-toggle__slider" />
                </label>
              </div>

              {guideRequired && pkg.guideLanguages?.length > 0 && (
                <div className="bk-field" style={{ marginTop: "14px" }}>
                  <label className="bk-label">Preferred Language</label>
                  <select
                    className="bk-input"
                    value={guideLanguage}
                    onChange={(e) => setGuideLanguage(e.target.value)}
                  >
                    <option value="">Select language</option>
                    {pkg.guideLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              )}
            </section>
          )}
        </div>

        {/* RIGHT: summary */}
        <div className="bk-right">
          <div className="bk-summary">
            <img src={pkg.image} alt={pkg.title} className="bk-summary__img" />
            <div className="bk-summary__body">
              <h3 className="bk-summary__title">{pkg.title}</h3>
              <p className="bk-summary__sub">{pkg.city}, {pkg.state}</p>
              <p className="bk-summary__sub">
                {pkg.days}D / {pkg.nights}N · {travelers} traveler{travelers > 1 ? "s" : ""}
              </p>

              <div className="bk-summary__breakdown">
                <div className="bk-summary__row">
                  <span>Base price ({travelers}x)</span>
                  <span>₹{(pkg.price * travelers).toLocaleString("en-IN")}</span>
                </div>
                {hotelCost > 0 && (
                  <div className="bk-summary__row">
                    <span>Hotel ({pkg.nights} nights)</span>
                    <span>₹{hotelCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {transportCost > 0 && (
                  <div className="bk-summary__row">
                    <span>Transport ({travelers}x)</span>
                    <span>₹{transportCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {guideCost > 0 && (
                  <div className="bk-summary__row">
                    <span>Guide ({pkg.days} days)</span>
                    <span>₹{guideCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="bk-summary__total">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                className="bk-confirm-btn"
                onClick={handlePayment}
                disabled={paying}
              >
                {paying ? "Processing..." : `Pay ₹${grandTotal.toLocaleString("en-IN")}`}
              </button>

              <p className="bk-secure-note">
                🔒 Secured by Razorpay · UPI, Cards, NetBanking accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
