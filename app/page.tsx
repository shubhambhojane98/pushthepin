'use client'
import React, { useState } from 'react';
import { MapPin, Bell, Shield, Share2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {

  const [zip, setZip] = useState("");
  const router = useRouter();

  const handleGoToMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zip.trim()) return;
    // Redirects to /dashboard and passes the zip code in the URL
    router.push(`/dashboard?zip=${encodeURIComponent(zip.trim())}`);
  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 text-white p-2 rounded-xl shadow-md shadow-red-500/20">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              PushThePin
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-red-500 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-red-500 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-red-500 transition-colors">Pricing</a>
          </nav>
          <div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
              Get App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold bg-red-50 text-red-600 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Hyperlocal Community Network
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
              What’s happening down your street? <span className="text-red-500">Pin it.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Drop real-time pins for garage sales, local block parties, street closures, or immediate neighborhood alerts. Your neighborhood, broadcasted instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <form onSubmit={handleGoToMap} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <input 
        type="text" 
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="Enter zip code (e.g., 400012)" 
        className="px-4 py-3.5 bg-slate-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm font-medium min-w-[260px] text-slate-900"
      />
      <button 
        type="submit" 
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 group text-sm"
      >
        Explore Your Radius
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
            </div>
          </div>
          
          {/* Visual Mockup Side */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-amber-500/10 blur-3xl rounded-full scale-75 -z-10" />
            {/* Standard representation of an app mockup screen using pure CSS */}
            <div className="w-[300px] h-[600px] border-[8px] border-slate-900 bg-slate-100 rounded-[40px] shadow-2xl overflow-hidden relative">
              <div className="w-28 h-4 bg-slate-900 mx-auto rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-20" />
              <div className="p-4 pt-8 h-full flex flex-col justify-between bg-cover bg-center" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #f1f5f9 20%, #e2e8f0 100%)' }}>
                <div className="space-y-3 relative z-10 mt-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex items-center gap-3">
                    <div className="bg-red-500 text-white p-2 rounded-lg"><MapPin className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold">Block Party Started!</p>
                      <p className="text-[10px] text-slate-500">2 mins ago • 50m away</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex items-center gap-3">
                    <div className="bg-amber-500 text-white p-2 rounded-lg"><Bell className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold">Lost Golden Retriever</p>
                      <p className="text-[10px] text-slate-500">14 mins ago • 300m away</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200/40 mb-2">
                  <div className="h-1 w-12 bg-slate-300 mx-auto rounded-full mb-3" />
                  <p className="text-xs font-bold text-center mb-1">Push a Pin to the Map</p>
                  <p className="text-[10px] text-slate-500 text-center mb-3">Alert your 1km radius instantly</p>
                  <button className="w-full bg-red-500 text-white text-xs font-bold py-2 rounded-xl">Drop Live Pin</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Built for active communities.
            </h2>
            <p className="text-slate-600 text-base">
              Social networks became too global. PushThePin drops the noise and focuses strictly on what matters within walking distance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="bg-red-50 text-red-500 p-3 rounded-xl w-fit mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Geofenced Radius</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your posts only broadcast to users physically within your selected perimeter (500m to 5km). No global clutter.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="bg-amber-50 text-amber-600 p-3 rounded-xl w-fit mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ephemeral Life Cycles</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pins naturally expire after a few hours or days depending on the type. Food trucks, cleanups, and estate sales disappear when done.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Locals</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our lightweight location verification keeps bad actors and distant spammers out of your hyper-local feed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof CTA */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
            Reclaim your neighborhood pulse.
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-base sm:text-lg">
            Available on iOS and Android next month. Join over 12,000 users locked into early alpha access.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free for citizens</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No ads tracking data</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Moderated by neighbors</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>© 2026 PushThePin Inc. All rights reserved. Keeping it local.</p>
      </footer>
    </div>
  );
}