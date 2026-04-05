import { useState, useEffect } from "react";
import axios from "axios";
import "./Destination.css";

function Destinations() {

  const [states, setStates] = useState([]);
  const [places, setPlaces] = useState([]);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [showSuggestions, setShowSuggestions] = useState(false);

  // LOAD STATES

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/states")
      .then((res) => setStates(res.data.states))
      .catch((err) => console.log(err));

  }, []);

  // SEARCH API

  const handleSearchChange = async (e) => {

    const value = e.target.value;

    setSearch(value);
    setShowSuggestions(true);

    if (value.length > 1) {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/search?q=${value}`
        );

        const results = [
          ...res.data.states,
          ...res.data.destinations,
        ];

        setSuggestions(results);

      } catch (err) {
        console.log(err);
      }
    }
  };

  // CLICK SUGGESTION

  const handleSuggestionClick = async (item) => {

    setShowSuggestions(false);
    setSearch(item.name);

    if (item.type === "state") {

      setSelectedState(item);

      const res = await axios.get(
        `http://localhost:5000/api/destinations/${item._id}`
      );

      setPlaces(res.data);

    } else {

      setSelectedPlace(item);

    }
  };

  // CLICK STATE CARD

  const handleStateClick = async (state) => {

    setSelectedState(state);
    setSelectedPlace(null);

    const res = await axios.get(
      `http://localhost:5000/api/destinations/${state._id}`
    );

    setPlaces(res.data);
  };

  return (

    <div className="destinations-page">

      <h1 className="title">Explore India</h1>

      {/* SEARCH BAR */}

      <div className="search-container">

        <input
          type="text"
          placeholder="Search state or tourist place..."
          value={search}
          onChange={handleSearchChange}
        />

        {showSuggestions && search && (

          <div className="suggestions">

            {suggestions.map((item) => (

              <div
                key={item._id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(item)}
              >

                {item.name}

              </div>

            ))}

          </div>

        )}

      </div>

      {/* STATES GRID */}
        <h2>States</h2>

      {!selectedState && (
        <div className="states-grid">
          

          {states.map((state) => (

            <div
              key={state._id}
              className="state-card"
              onClick={() => handleStateClick(state)}
            >

              <img src={state.image} alt={state.name} />

              <h3>{state.name}</h3>

            </div>

          ))}

        </div>

      )}

      {/* PLACES GRID */}

      {selectedState && (

        <div className="places-section">

          <h2>{selectedState.name} Destinations</h2>

          <button
            className="back-btn"
            onClick={() => {
              setSelectedState(null);
              setPlaces([]);
              setSelectedPlace(null);
            }}
          >
            ← Back to States
          </button>

          <div className="places-grid">

            {places.map((place) => (

              <div
                key={place._id}
                className="place-card"
                onClick={() => setSelectedPlace(place)}
              >

                <h3>{place.name}</h3>

                <p>{place.description}</p>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* PREVIEW PANEL */}

      {selectedPlace && (

        <div className="preview-panel">

          <div className="preview-content">

            <h2>{selectedPlace.name}</h2>

            <p>{selectedPlace.description}</p>

            <button className="view-btn">
              View Details
            </button>

            <button
              className="close-btn"
              onClick={() => setSelectedPlace(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default Destinations;