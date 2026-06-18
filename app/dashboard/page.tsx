"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MapPin, Search, AlertCircle, ArrowLeft, PlusCircle, Sparkles, X } from "lucide-react";
import { CivicPin } from "@/components/MapDemo";

const MapDemo = dynamic(() => import("@/components/MapDemo"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm animate-pulse">
      Loading Radar Canvas Grid...
    </div>
  ),
});

const ZIP_DATABASE: Record<string, [number, number]> = {
  "400050": [19.0550, 72.8294],  // Bandra West, Mumbai
  "400051": [19.0627, 72.8460],  // Bandra East, Mumbai
  "400012": [18.9979, 72.8412],  // Parel, Mumbai
  "400014": [19.0145, 72.8455],  // Dadar, Mumbai
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [zipInput, setZipInput] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number]>([19.0145, 72.8455]);
  const [errorMsg, setErrorMsg] = useState("");

  // Live Array State holding dynamically submitted Civic Issues
 const [pinsList, setPinsList] = useState<CivicPin[]>([
  {
    id: "demo-1",
    lat: 19.0551,
    lng: 72.8301,
    title: "Hill Road Pothole Danger",
    category: "potholes",
    details: "Huge deep gap right near the crosswalk intersection by Elco Market causing cars to swerve."
  }
]);

  // Form Overlay Control States
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [formError, setFormError] = useState("");
  
  // Field values
  const [issueTitle, setIssueTitle] = useState("");
  const [issueCategory, setIssueCategory] = useState<CivicPin["category"]>("streetlight");
  const [issueDetails, setIssueDetails] = useState("");

  useEffect(() => {
    const urlZip = searchParams.get("zip");
    if (urlZip) {
      setZipInput(urlZip);
      if (ZIP_DATABASE[urlZip]) {
        setCurrentCoordinates(ZIP_DATABASE[urlZip]);
        setErrorMsg("");
      } else {
        setErrorMsg(`"${urlZip}" isn't pre-mapped. Showing default region.`);
      }
    }
  }, [searchParams]);

  // Handle Map Interaction Clicks
  const handleMapClick = (lat: number, lng: number, distanceKm: number) => {
    if (distanceKm > 2.0) {
      setFormError(`Out of bounds! That point is ${(distanceKm).toFixed(2)}km away. You can only pin issues within your strict 2km community radius.`);
      setSelectedCoords(null);
      return;
    }

    // Inside 2km radius -> Open Form
    setFormError("");
    setSelectedCoords({ lat, lng });
  };

  const handleCreatePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim() || !issueDetails.trim() || !selectedCoords) return;

    const newPin: CivicPin = {
      id: `pin-${Date.now()}`,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
      title: issueTitle,
      category: issueCategory,
      details: issueDetails,
    };

    setPinsList((prev) => [...prev, newPin]);
    
    // Reset Form Input State fields cleanly
    setIssueTitle("");
    setIssueDetails("");
    setSelectedCoords(null);
  };

  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = zipInput.trim();
    if (ZIP_DATABASE[cleanZip]) {
      setCurrentCoordinates(ZIP_DATABASE[cleanZip]);
      setErrorMsg("");
      router.push(`/dashboard?zip=${cleanZip}`, { scroll: false });
    } else {
      setErrorMsg("Use test codes: 400012, 400014, 400055 or 400051");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Banner Header Nav */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Landing Page
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-red-500 text-white p-1.5 rounded-lg shadow-sm">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-black tracking-tight">PushThePin Hyperlocal Engine</span>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-6">
        
        {/* Left Side: Parameters / Form Submissions Column */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Section A: Radius Configuration Lookup */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3">Community Hub Center</h2>
            <form onSubmit={handleZipSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  placeholder="Zip code (10001, 90210...)"
                  className="w-full pl-8 pr-3 py-2 bg-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/30 border-none text-slate-900"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
              <button type="submit" className="bg-slate-950 hover:bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-medium transition-colors">
                Sync
              </button>
            </form>
            {errorMsg && <p className="text-[11px] text-amber-600 font-medium mt-2">{errorMsg}</p>}
          </div>

          {/* Section B: Action Context Box - Civic Issue Intake Form */}
          {selectedCoords ? (
            <div className="bg-white p-5 rounded-2xl border-2 border-red-500 shadow-md relative animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button 
                onClick={() => setSelectedCoords(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1.5 text-red-500 mb-2">
                <PlusCircle className="w-4 h-4" />
                <h3 className="text-sm font-bold">Raise Civic Issue</h3>
              </div>
              
              <p className="text-[11px] text-slate-500 mb-4">
                Dropping a live report marker at coordinates: <span className="font-mono text-slate-700 bg-slate-100 px-1 rounded">[{selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}]</span>
              </p>

              <form onSubmit={handleCreatePinSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Brief Title Summary</label>
                  <input
                    type="text"
                    required
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    placeholder="e.g. Broken overhead lamp post"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-red-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Issue Category classification</label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value as CivicPin["category"])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-red-500 text-slate-900 capitalize"
                  >
                    <option value="streetlight">💡 Streetlight Issue</option>
                    <option value="potholes">🚗 Potholes & Road Cracks</option>
                    <option value="garbage">🚮 Garbage & Waste Clutter</option>
                    <option value="water issues">🚰 Water Issues / Leaks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Detailed Description</label>
                  <textarea
                    required
                    rows={3}
                    value={issueDetails}
                    onChange={(e) => setIssueDetails(e.target.value)}
                    placeholder="Provide specific notes so neighbors or utility teams understand scope..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-red-500 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-red-500/10"
                >
                  Broadcast Pin to Radius Map
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Interactive Guidance</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click anywhere on the map inside the red perimeter transparent circle to immediately build a localized pin tracker entry.
              </p>
              {formError && (
                <div className="p-3 bg-red-950 text-red-300 rounded-xl border border-red-900 text-[11px] flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}
            </div>
          )}

          {/* Section C: Live Array Local Stats counter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Radius Feed Statistics</span>
            <div className="flex justify-between border-b pb-1.5 text-slate-500">
              <span>Total Active Pins Registered</span>
              <span className="font-bold text-slate-900">{pinsList.length}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Dynamic Memory State</span>
              <span className="text-emerald-500 font-semibold">Active Demo Mode</span>
            </div>
          </div>
        </div>

        {/* Right Side: Map Canvas view column */}
        <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold">Live Visual Tracking Canvas</h3>
              <p className="text-[11px] text-slate-400">Clicking map surface triggers the localized issue pop-up constructor</p>
            </div>
            <div className="flex gap-3 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1"> <span className="w-2 h-2 rounded-full bg-yellow-500"/> Light</span>
              <span className="flex items-center gap-1"> <span className="w-2 h-2 rounded-full bg-orange-600"/> Road</span>
              <span className="flex items-center gap-1"> <span className="w-2 h-2 rounded-full bg-amber-900"/> Waste</span>
              <span className="flex items-center gap-1"> <span className="w-2 h-2 rounded-full bg-blue-600"/> Water</span>
            </div>
          </div>
          
          <MapDemo 
            center={currentCoordinates} 
            pins={pinsList} 
            onMapClick={handleMapClick} 
          />
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-400">Loading Workspace...</div>}>
      <DashboardContent />
    </Suspense>
  );
}