"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

export default function SimpleRouteMap() {
  const mapRef = useRef(null);
  const routingRef = useRef(null);

  useEffect(() => {
    // Ensure DOM exists
    if (!mapRef.current) return;

    // Create map instance
    const map = L.map(mapRef.current).setView([23.2599, 77.4126], 5);

    // Add tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Define start & end
    const start = L.latLng(28.6139, 77.2090); // Delhi
    const end = L.latLng(19.0760, 72.8777);   // Mumbai

    // ✅ Create routing control manually to prevent async cleanup issue
    const control = L.Routing.control({
      waypoints: [start, end],
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      show: false,
      lineOptions: {
        styles: [{ color: "blue", weight: 5, opacity: 0.7 }],
      },
      createMarker: (i, wp) =>
        L.marker(wp.latLng).bindPopup(i === 0 ? "Start: Delhi" : "End: Mumbai"),
    });

    control.addTo(map);
    routingRef.current = control;

    // ✅ Cleanup (manual order)
    return () => {
      // Step 1: Stop routing events safely
      if (routingRef.current) {
        try {
          routingRef.current.getPlan().setWaypoints([]); // clear waypoints
          routingRef.current.spliceWaypoints(0, 2);      // clear internal refs
          routingRef.current._container = null;          // nullify container reference
        } catch (e) {
          console.warn("Routing cleanup issue ignored:", e);
        }
      }

      // Step 2: Clear all layers before removing map
      map.eachLayer((layer) => {
        try {
          map.removeLayer(layer);
        } catch {}
      });

      // Step 3: Remove map itself
      try {
        map.remove();
      } catch (e) {
        console.warn("Map already removed:", e);
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        zIndex: 0,
      }}
    />
  );
}
