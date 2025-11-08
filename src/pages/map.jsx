import dynamic from "next/dynamic";

const MapView = dynamic(() => import("../Components/Mapview"), {
  ssr: false, // Required for Leaflet
});

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Interactive Map with Search</h1>
      <MapView />
    </main>
  );
}