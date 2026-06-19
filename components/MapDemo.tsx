"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface CivicPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: "streetlight" | "potholes" | "garbage" | "water issues" | "safety"; // ✨ Added safety here
  details: string;
}

interface MapDemoProps {
  center: [number, number];
  pins: CivicPin[];
  onMapClick: (lat: number, lng: number, distanceKm: number) => void;
}

export default function MapDemo({ center, pins, onMapClick }: MapDemoProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const activePinsGroupRef = useRef<L.LayerGroup | null>(null);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "safety": return "#dc2626";      // ✨ Crimson Red for Safety alerts
      case "streetlight": return "#eab308"; // Amber
      case "potholes": return "#ea580c";    // Orange
      case "garbage": return "#78350f";     // Brown
      case "water issues": return "#2563eb"; // Blue
      default: return "#ef4444";
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const centerLatLng = L.latLng(center[0], center[1]);
    const bounds = centerLatLng.toBounds(1000); 

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        minZoom: 14,
        maxZoom: 18,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
      }).fitBounds(bounds);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      activePinsGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    map.setMaxBounds(bounds);
    map.flyToBounds(bounds, { duration: 1.2 });

    if (centerMarkerRef.current) centerMarkerRef.current.remove();
    if (circleRef.current) circleRef.current.remove();

    const homeIcon = L.divIcon({
      className: "bg-slate-900 w-4 h-4 rounded-full border-2 border-white shadow-lg",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    centerMarkerRef.current = L.marker(center, { icon: homeIcon })
      .addTo(map)
      .bindPopup("<b>Your Hyperlocal Core Center</b>");

    circleRef.current = L.circle(center, {
      color: "#ef4444",
      fillColor: "#f87171",
      fillOpacity: 0.05,
      radius: 1000, 
    }).addTo(map);

    map.off("click"); 
    map.on("click", (e: L.LeafletMouseEvent) => {
      const clickedLatLng = e.latlng;
      const distanceMeters = centerLatLng.distanceTo(clickedLatLng);
      const distanceKm = distanceMeters / 1000;

      onMapClick(clickedLatLng.lat, clickedLatLng.lng, distanceKm);
    });

  }, [center, onMapClick]);

  useEffect(() => {
    if (!mapInstanceRef.current || !activePinsGroupRef.current) return;
    activePinsGroupRef.current.clearLayers();

    pins.forEach((pin) => {
      const pinColor = getCategoryColor(pin.category);
      
      const civicIcon = L.divIcon({
        className: "relative flex items-center justify-center",
        html: `<div style="background-color: ${pinColor}" class="w-5 h-5 rounded-full border-2 border-white shadow-md"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const newMarker = L.marker([pin.lat, pin.lng], { icon: civicIcon })
        .bindPopup(`
          <div class="text-slate-900 font-sans p-1">
            <h4 class="font-bold text-xs capitalize border-b pb-1 mb-1" style="color: ${pinColor}">🚨 ${pin.category}</h4>
            <p class="font-semibold text-xs my-0.5">${pin.title}</p>
            <p class="text-[11px] text-slate-500 leading-tight">${pin.details}</p>
          </div>
        `);
      
      activePinsGroupRef.current?.addLayer(newMarker);
    });
  }, [pins]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-[520px] rounded-2xl border border-slate-200 shadow-inner z-0 cursor-crosshair" 
    />
  );
}