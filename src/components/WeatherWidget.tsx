"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Wind, AlertCircle } from "lucide-react";

interface WeatherData {
    temp: number;
    description: string;
    iconId: string;
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // In a real app we'd fetch from OpenWeather API here.
        // Instead of failing due to a missing key, we'll simulate the fetch.
        const fetchWeather = async () => {
            try {
                setLoading(true);
                // Simulate network request
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock data for "London" / "Destination"
                setWeather({
                    temp: 18,
                    description: "Partly Cloudy",
                    iconId: "02d",
                });
            } catch (err) {
                setError("Failed to fetch weather data.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getWeatherIcon = (description: string) => {
        const desc = description.toLowerCase();
        if (desc.includes("rain")) return <CloudRain className="w-8 h-8 text-blue-400" />;
        if (desc.includes("cloud")) return <Cloud className="w-8 h-8 text-slate-300" />;
        if (desc.includes("wind")) return <Wind className="w-8 h-8 text-slate-400" />;
        return <Sun className="w-8 h-8 text-yellow-400" />;
    };

    if (loading) {
        return (
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-center animate-pulse">
                <div className="w-24 h-6 bg-white/10 rounded" />
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-2xl p-4 flex items-center gap-2 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Weather unavailable</span>
            </div>
        );
    }

    return (
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-2xl p-4 flex items-center gap-4 hover:bg-black/60 transition-colors cursor-default group z-20">
            <div className="p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                {getWeatherIcon(weather.description)}
            </div>
            <div>
                <div className="flex items-start">
                    <span className="text-2xl font-bold text-white tracking-tight">{weather.temp}</span>
                    <span className="text-sm font-medium text-slate-400 mt-1 ml-0.5">°C</span>
                </div>
                <p className="text-xs text-slate-400 font-medium capitalize truncate max-w-[100px]">
                    {weather.description}
                </p>
            </div>
        </div>
    );
}
