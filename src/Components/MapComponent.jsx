"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Map click handler to select END
function EndSelector({ startPos, setEndPos, setDistance }) {
  useMapEvent("click", (e) => {
    if (startPos) {
      const end = [e.latlng.lat, e.latlng.lng];
      setEndPos(end);

      const distance = getDistance(startPos, end);
      setDistance(distance.toFixed(2));
    }
  });
  return null;
}

// Change map view
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

// Distance function (Haversine)
function getDistance(p1, p2) {
  const R = 6371; // km
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLon = ((p2[1] - p1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((p1[0] * Math.PI) / 180) *
      Math.cos((p2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapComponent() {
  const [isClient, setIsClient] = useState(false);

  const [startName, setStartName] = useState("");
  const [endName, setEndName] = useState("");

  const [startPos, setStartPos] = useState(null);
  const [endPos, setEndPos] = useState(null);
  const [distance, setDistance] = useState(null);

  // Initialize leaflet icons
  useEffect(() => {
    setIsClient(true);
    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
      });
    });
  }, []);

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setEndPos(coords);
          if (startPos) {
            setDistance(getDistance(startPos, coords).toFixed(2));
          }
        },
        (err) => {
          console.warn("Geolocation denied or not available", err);
        }
      );
    }
  }, [startPos]); // Re-run if startPos changes

  if (!isClient) return null;

  // Search location by name
  const searchLocation = async (place, setFunc) => {
    if (!place) return null;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const data = await res.json();
    if (data.length > 0) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      setFunc(coords);
      return coords;
    } else {
      alert("Location not found");
      return null;
    }
  };

  const handleStartSearch = async () => {
    const coords = await searchLocation(startName, setStartPos);
    if (coords && endPos) {
      setDistance(getDistance(coords, endPos).toFixed(2));
    }
  };

  const handleEndSearch = async () => {
    const coords = await searchLocation(endName, setEndPos);
    if (coords && startPos) {
      setDistance(getDistance(startPos, coords).toFixed(2));
    }
  };

  return (
    <div>
      {/* Inputs */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder='Start (e.g. "Taj Mahal")'
          value={startName}
          onChange={(e) => setStartName(e.target.value)}
        />
        <button onClick={handleStartSearch} style={{ marginLeft: "5px" }}>
          Set Start
        </button>

        <input
          type="text"
          placeholder='End (e.g. "Delhi")'
          value={endName}
          onChange={(e) => setEndName(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        <button onClick={handleEndSearch} style={{ marginLeft: "5px" }}>
          Set End
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={startPos || endPos || [25.4358, 81.8463]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {startPos && <ChangeView center={startPos} />}

        {/* Map click sets END */}
        {startPos && (
          <EndSelector
            startPos={startPos}
            setEndPos={setEndPos}
            setDistance={setDistance}
          />
        )}

        {/* Markers */}
        {startPos && <Marker position={startPos} />}
        {endPos && <Marker position={endPos} />}
        {startPos && endPos && <Polyline positions={[startPos, endPos]} />}
      </MapContainer>

      {/* Distance */}
      {distance && <h3>Distance: {distance} km</h3>}
    </div>
  );
}