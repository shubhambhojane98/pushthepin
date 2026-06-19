"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Unified dynamic database structural type configuration
export interface CivicPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: "issue" | "event";
  category:
    | "safety"
    | "streetlight"
    | "potholes"
    | "garbage"
    | "water issues"
    | "party"
    | "sale"
    | "market";
  details: string;
  eventDate?: string;
  eventTime?: string;
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

  // Semantic category coloring framework
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      // Civic Issues Palette
      case "safety":
        return "#dc2626"; // Crimson Red
      case "streetlight":
        return "#eab308"; // Amber
      case "potholes":
        return "#ea580c"; // Safety Orange
      case "garbage":
        return "#78350f"; // Brown
      case "water issues":
        return "#2563eb"; // Deep Blue
      // Community Events Palette
      case "party":
        return "#a855f7"; // Purple
      case "sale":
        return "#10b981"; // Emerald
      case "market":
        return "#06b6d4"; // Cyan
      default:
        return "#64748b";
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Calculate bounding parameters strictly restricted to a 1000m radius
    const centerLatLng = L.latLng(center[0], center[1]);
    const bounds = centerLatLng.toBounds(1000);

    // 2. Build map canvas structural configuration layer
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        minZoom: 14, // Hard limit zooming out
        maxZoom: 18,
        maxBounds: bounds, // Frame-locks panning grid boundaries
        maxBoundsViscosity: 1.0, // Hard stop dragging outside the box
      }).fitBounds(bounds);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapInstanceRef.current);

      activePinsGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // 3. Keep tracking boundaries synced dynamically when changing zip codes
    map.setMaxBounds(bounds);
    map.flyToBounds(bounds, { duration: 1.2 });

    // 4. Remove duplicate historical nodes
    if (centerMarkerRef.current) centerMarkerRef.current.remove();
    if (circleRef.current) circleRef.current.remove();

    const homeIcon = L.divIcon({
      className:
        "bg-slate-900 w-4 h-4 rounded-full border-2 border-white shadow-lg",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    centerMarkerRef.current = L.marker(center, { icon: homeIcon })
      .addTo(map)
      .bindPopup("<b>Your Hyperlocal Core Center</b>");

    circleRef.current = L.circle(center, {
      color: "#ef4444",
      fillColor: "#f87171",
      fillOpacity: 0.04,
      radius: 1000,
    }).addTo(map);

    // 5. Unbind stale click event contexts and assign a clean instance targeting the new coordinates
    map.off("click");
    map.on("click", (e: L.LeafletMouseEvent) => {
      const clickedLatLng = e.latlng;
      const distanceMeters = centerLatLng.distanceTo(clickedLatLng);
      const distanceKm = distanceMeters / 1000;

      onMapClick(clickedLatLng.lat, clickedLatLng.lng, distanceKm);
    });
  }, [center, onMapClick]);

  // Dynamic list rendering sync loop
  useEffect(() => {
    if (!mapInstanceRef.current || !activePinsGroupRef.current) return;
    activePinsGroupRef.current.clearLayers();

    pins.forEach((pin) => {
      const pinColor = getCategoryColor(pin.category);
      const emojiPrefix = pin.type === "event" ? "🎉" : "🚨";

      const civicIcon = L.divIcon({
        className: "relative flex items-center justify-center",
        html: `<div style="background-color: ${pinColor}" class="w-5 h-5 rounded-full border-2 border-white shadow-md animate-fade-in"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const popupHtml = `
        <div class="text-slate-900 font-sans p-1 max-w-[200px]">
          <h4 class="font-bold text-xs capitalize border-b pb-1 mb-1 flex items-center gap-1" style="color: ${pinColor}">
            ${emojiPrefix} ${pin.category.replace("issues", "")}
          </h4>
          <p class="font-bold text-xs my-0.5">${pin.title}</p>
          ${pin.type === "event" ? `<p class="text-[10px] font-semibold text-indigo-600 my-0">📅 ${pin.eventDate} @ ${pin.eventTime}</p>` : ""}
          <p class="text-[11px] text-slate-500 leading-tight mt-1">${pin.details}</p>
        </div>
      `;

      const newMarker = L.marker([pin.lat, pin.lng], {
        icon: civicIcon,
      }).bindPopup(popupHtml);
      activePinsGroupRef.current?.addLayer(newMarker);
    });
  }, [pins]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] sm:h-[520px] rounded-2xl border border-slate-200 shadow-inner z-0 cursor-crosshair"
    />
  );
}
