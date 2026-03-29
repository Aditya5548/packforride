"use client";

import dynamic from "next/dynamic";

// ✅ Disable SSR completely
const MapComponent = dynamic(() => import('../Components/MapComponent'), {
  ssr: false,
});

export default function Page() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Distance Calculator Map</h2>
      <MapComponent />
    </div>
  );
}