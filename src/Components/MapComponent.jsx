"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useUser } from "@/context/UserContext";
import L from "leaflet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 📏 Distance function
function getDistance(p1, p2) {
  const R = 6371;
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLon = ((p2[1] - p1[1]) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((p1[0] * Math.PI) / 180) *
      Math.cos((p2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 📍 Click selector
function LocationSelector({ setEndPos }) {
  useMapEvents({
    click(e) {
      setEndPos([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// 📌 Auto fit
function FitBounds({ startPos, endPos }) {
  const map = useMap();

  useEffect(() => {
    if (startPos && endPos) {
      map.fitBounds([startPos, endPos], { padding: [50, 50] });
    }
  }, [startPos, endPos]);

  return null;
}

// 🎯 Icons
const startIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const endIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// ✅ MAIN PAGE
export default function Page({ startPos }) {
  return <MapComponent startPos={startPos} />;
}

// 🗺️ MAP COMPONENT
function MapComponent({ startPos }) {
  const { endPos, setEndPos, distance, setDistance } = useUser();

  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ Convert string → number
  const parsedStartPos =
    startPos && startPos.length === 2
      ? [parseFloat(startPos[0]), parseFloat(startPos[1])]
      : [28.6139, 77.2090]; // fallback (Delhi)

  useEffect(() => setIsClient(true), []);

  // 📍 Current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setEndPos([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setEndPos(parsedStartPos);
      }
    );
  }, []);

  // 📏 Distance calc
  useEffect(() => {
    if (parsedStartPos && endPos) {
      const dist = getDistance(parsedStartPos, endPos);
      setDistance(dist.toFixed(2));
    }
  }, [parsedStartPos, endPos]);

  // 🔍 Search
  const handleSearch = async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );

      const data = await res.json();

      if (data.length > 0) {
        setEndPos([
          parseFloat(data[0].lat),
          parseFloat(data[0].lon),
        ]);
      } else {
        toast.error("Location not found");
      }
    } catch {
      toast.error("Error fetching location");
    }
  };

  if (!isClient) return null;

  return (
    <div className="w-full">
      <ToastContainer position="top-right" />

      {/* 📱 Mobile Search */}
      <div className="flex sm:hidden gap-2 mb-2">
        <input
          type="text"
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          onClick={handleSearch}
          disabled={!search.trim()}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Go
        </button>
      </div>

      {/* 🗺️ Map */}
      <div className="relative w-full h-[350px] sm:h-[500px] rounded-xl overflow-hidden z-30">
        <MapContainer
          center={parsedStartPos}
          zoom={7}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FitBounds startPos={parsedStartPos} endPos={endPos} />

          <Marker position={parsedStartPos} icon={startIcon} />

          <LocationSelector setEndPos={setEndPos} />

          {endPos && (
            <>
              <Marker
                position={endPos}
                icon={endIcon}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    const pos = e.target.getLatLng();
                    setEndPos([pos.lat, pos.lng]);
                  },
                }}
              />

              <Polyline
                positions={[parsedStartPos, endPos]}
                pathOptions={{ color: "blue", weight: 4 }}
              />
            </>
          )}
        </MapContainer>

        {/* 💻 Desktop Search */}
        <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 z-[1000] w-[400px] bg-white shadow-lg rounded-full overflow-hidden border border-gray-200/50 backdrop-blur-md bg-white/60 rounded-xl shadow-sm">
          <input
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-5 py-3 outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={!search.trim()}
            className="bg-blue-600 text-white px-5"
          >
            Search
          </button>
        </div>

        {/* 📍 My Location */}
        <button
          onClick={() => {
            navigator.geolocation.getCurrentPosition((pos) => {
              setEndPos([pos.coords.latitude, pos.coords.longitude]);
            });
          }}
          className="absolute top-3 right-3 sm:top-16 z-[1000] bg-white shadow-md px-3 py-2 rounded-lg text-sm"
        >
          📍 My Location
        </button>

        {/* 💻 Desktop Distance */}
        {distance && (
          <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-xl px-6 py-3 items-center gap-3 z-[1000] border border-gray-200/50 backdrop-blur-md bg-white/60 rounded-xl shadow-sm">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              📍
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Distance</p>
              <h3 className="text-lg font-bold text-gray-800">
                {distance} km
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* 📱 Mobile Distance */}
      {distance && (
        <div className="sm:hidden mt-3 bg-white shadow-xl rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            📍
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Distance</p>
            <h3 className="text-base font-bold text-gray-800">
              {distance} km
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}