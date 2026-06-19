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
  
  // Workspace UI Modes
  const [activeMode, setActiveMode] = useState<"issue" | "event">("issue");
  const [zipInput, setZipInput] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number]>([19.0145, 72.8455]);
  const [errorMsg, setErrorMsg] = useState("");

  // Live client-side storage state array
  const [pinsList, setPinsList] = useState<CivicPin[]>([
    {
      id: "demo-1",
      lat: 19.0551,
      lng: 72.8301,
      title: "Hill Road Pothole Danger",
      type: "issue",
      category: "potholes",
      details: "Huge deep gap right near the crosswalk intersection by Elco Market causing cars to swerve."
    }
  ]);

  // Form Overlay State
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [formError, setFormError] = useState("");
  
  // Bound form state values
  const [issueTitle, setIssueTitle] = useState("");
  const [issueCategory, setIssueCategory] = useState<string>("");
  const [issueDetails, setIssueDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [bookingUrl, setBookingUrl] = useState(""); // ✨ New RSVP State hook

  // Get Today's Date String format (YYYY-MM-DD) for min-date constraint
  const [minDateString, setMinDateString] = useState("");

  useEffect(() => {
    // Generates today's date adjusted to your local timezone offset safely
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setMinDateString(`${year}-${month}-${day}`);
  }, []);

  // Reset category selectors intelligently when user toggles modes
  useEffect(() => {
    setIssueCategory(activeMode === "issue" ? "safety" : "party");
    setSelectedCoords(null);
    setFormError("");
  }, [activeMode]);

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

  const handleMapClick = (lat: number, lng: number, distanceKm: number) => {
    if (distanceKm > 1.0) {
      setFormError(`Out of bounds! That point is ${(distanceKm).toFixed(2)}km away. You can only drop pins within a strict 1km walking distance.`);
      setSelectedCoords(null);
      return;
    }
    setFormError("");
    setSelectedCoords({ lat, lng });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim() || !issueDetails.trim() || !selectedCoords) return;

    const newPin: CivicPin = {
      id: `pin-${Date.now()}`,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
      title: issueTitle,
      type: activeMode,
      category: issueCategory as any,
      details: issueDetails + (bookingUrl.trim() ? ` \n🔗 Ticket Link: ${bookingUrl}` : ""),
      ...(activeMode === "event" && { eventDate, eventTime })
    };

    setPinsList((prev) => [...prev, newPin]);
    
    // Reset inputs
    setIssueTitle("");
    setIssueDetails("");
    setEventDate("");
    setEventTime("");
    setBookingUrl("");
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
      setErrorMsg("Use test codes: 400012, 400014, 400050 or 400051");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </button>
          <div className="flex items-center gap-1.5">
            <div className="bg-red-500 text-white p-1.5 rounded-lg shadow-sm">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-black tracking-tight hidden sm:inline">PushThePin Hyperlocal Engine</span>
            <span className="text-sm font-black tracking-tight sm:hidden">PushThePin</span>
          </div>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-red-500 bg-red-50 px-2 py-0.5 rounded-full">1KM BOUND LOCKED</span>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-12 gap-6">
        
        {/* Control Sidebar Column */}
        <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
          
          {/* View Mode Switching Tab Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveMode("issue")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${activeMode === "issue" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              🚨 Civic Issues
            </button>
            <button
              onClick={() => setActiveMode("event")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${activeMode === "event" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
            >
              🎉 Local Events
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3">Community Hub Center</h2>
            <form onSubmit={handleZipSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  placeholder="Zip code (400050, 400014...)"
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-100 rounded-xl text-base md:text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500/30 border-none text-slate-900 animate-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
              </div>
              <button type="submit" className="bg-slate-950 hover:bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-semibold transition-colors shrink-0">
                Sync
              </button>
            </form>
            {errorMsg && <p className="text-[11px] text-amber-600 font-medium mt-2">{errorMsg}</p>}
          </div>

          {/* Contextual Intake Form Block */}
          {selectedCoords ? (
            <div className={`bg-white p-5 rounded-2xl border-2 shadow-md relative animate-in fade-in slide-in-from-bottom-2 duration-200 ${activeMode === "event" ? "border-emerald-500" : "border-red-500"}`}>
              <button onClick={() => setSelectedCoords(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
              
              <div className={`flex items-center gap-1.5 mb-2 ${activeMode === "event" ? "text-emerald-600" : "text-red-500"}`}>
                <PlusCircle className="w-4 h-4" />
                <h3 className="text-sm font-bold">{activeMode === "event" ? "Broadcast New Event" : "Raise Civic Issue"}</h3>
              </div>
              
              <p className="text-[11px] text-slate-500 mb-4">
                Dropping pinpoint at: <span className="font-mono text-slate-700 bg-slate-100 px-1 rounded">[{selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}]</span>
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    {activeMode === "event" ? "Event Name Summary" : "Brief Title Summary"}
                  </label>
                  <input
                    type="text" required value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)}
                    placeholder={activeMode === "event" ? "e.g. Bandra Garage Thrift Sale" : "e.g. Broken overhead lamp post"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base md:text-xs focus:outline-none focus:border-slate-400 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Classification Category</label>
                  <select
                    value={issueCategory} onChange={(e) => setIssueCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base md:text-xs focus:outline-none focus:border-slate-400 text-slate-900 capitalize"
                  >
                    {activeMode === "issue" ? (
                      <>
                        <option value="safety">🚨 Neighborhood Safety Alert</option>
                        <option value="streetlight">💡 Streetlight Issue</option>
                        <option value="potholes">🚗 Potholes & Road Cracks</option>
                        <option value="garbage">🚮 Garbage & Waste Clutter</option>
                        <option value="water issues">🚰 Water Issues / Leaks</option>
                      </>
                    ) : (
                      <>
                        <option value="party">🥳 Block Party / Gathering</option>
                        <option value="sale">💰 Garage & Thrift Sale</option>
                        <option value="market">🛍️ Pop-up Farmers Market</option>
                      </>
                    )}
                  </select>
                </div>

                {activeMode === "event" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date</label>
                        {/* ✨ Fixed: Added min validation parameter to automatically block out past calendar dates natively */}
                        <input
                          type="date" required min={minDateString} value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base md:text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Time</label>
                        <input
                          type="time" required value={eventTime} onChange={(e) => setEventTime(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base md:text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    {/* ✨ Added Booking Link / Register RSVP Form Section Block */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Booking / RSVP URL <span className="text-slate-400 lowercase font-normal">(optional)</span></label>
                      <input
                        type="url" value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)}
                        placeholder="https://insider.in/event-link-id"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base md:text-xs focus:outline-none focus:border-slate-400 text-slate-900 text-left font-mono"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Detailed Description</label>
                  <textarea
                    required rows={3} value={issueDetails} onChange={(e) => setIssueDetails(e.target.value)}
                    placeholder={activeMode === "event" ? "What should attendees bring? Parking notes..." : "Provide specific details so support teams or neighbors understand scope..."}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-base md:text-xs focus:outline-none focus:border-slate-400 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md ${activeMode === "event" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10" : "bg-red-500 hover:bg-red-600 shadow-red-500/10"}`}
                >
                  {activeMode === "event" ? "Broadcast Event Pin" : "Broadcast Complaint Pin"}
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
                {activeMode === "event" 
                  ? "Switch to Events mode, then click inside the 1km cropped boundary to broadcast block parties, pop-up stalls, or local thrift events."
                  : "Click inside the map bounds to log potholes, broken street lights, waste clutters, or safety alerts directly into the live tracker."}
              </p>
              {formError && (
                <div className="p-3 bg-red-950 text-red-300 rounded-xl border border-red-900 text-[11px] flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}
            </div>
          )}

          {/* Metric Dashboard */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Live Radius Statistics</span>
            <div className="flex justify-between border-b pb-1.5 text-slate-500">
              <span>Total Pins Active in Radius</span>
              <span className="font-bold text-slate-900">
                {pinsList.filter(p => p.type === activeMode).length} active {activeMode}s
              </span>
            </div>
          </div>
        </div>

        {/* Map Canvas Column */}
        <div className="lg:col-span-8 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm order-1 lg:order-2">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h3 className="text-xs font-bold">1KM Cropped Bounding Box Radar</h3>
              <p className="text-[11px] text-slate-400">Map panning is locked to the selected zone. Click to drop pins.</p>
            </div>
            
            {/* Color Index Legend */}
            <div className="flex gap-2 text-[10px] font-bold text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"> <span className="w-2 h-2 rounded-full bg-red-600"/> Safety</span>
              <span className="flex items-center gap-1"> <span className="w-2 h-2 rounded-full bg-yellow-500"/> Light</span>
              <span className="flex items-center gap-1"> <span className="w-2 h-2 rounded-full bg-orange-600"/> Road</span>
              <span className="flex items-center gap-1"> <span className="w-2 h-2 rounded-full bg-purple-500"/> Events</span>
              <span className="flex items-center gap-1"> <span className="w-2 h-2 rounded-full bg-emerald-500"/> Sales</span>
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