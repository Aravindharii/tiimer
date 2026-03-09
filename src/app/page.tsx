"use client";

import { useState } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import PlaneAnimation from "@/components/PlaneAnimation";
import MemoryTimeline from "@/components/MemoryTimeline";
import WeatherWidget from "@/components/WeatherWidget";
import WelcomeScreen from "@/components/WelcomeScreen";
import FlightTracker from "@/components/FlightTracker";

export default function Home() {
  const [isFinished, setIsFinished] = useState(false);

  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-blue-500/30">
      {/* Background Plane Animation */}
      <PlaneAnimation />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] sm:min-h-screen w-full flex flex-col items-center justify-center pt-20 pb-10 px-4 z-10">
        <WeatherWidget />

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 drop-shadow-sm">
            The Wait Is Almost Over
          </h1>
          <p className="text-lg md:text-xl text-blue-200/80 font-medium tracking-wide">
            April 11, 2026
          </p>
        </div>

        <CountdownTimer onComplete={() => setIsFinished(true)} />

      </section>

      {/* Content Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-10" />

      {/* Flight Tracking Section */}
      <FlightTracker />

      {/* Content Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-10" />

      {/* Memories Section */}
      <MemoryTimeline />

      {/* Conditionally Render the Welcome Event Layer */}
      {isFinished && <WelcomeScreen />}
    </main>
  );
}
