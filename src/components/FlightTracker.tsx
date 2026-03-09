"use client";

import { motion } from "framer-motion";
import { PlaneTakeoff, PlaneLanding, Clock, ArrowRight } from "lucide-react";

interface FlightSegment {
    airline: string;
    flightNumber: string;
    aircraft: string;
    class: string;
    departure: {
        time: string;
        date: string;
        airport: string;
        gate?: string;
        terminal?: string;
    };
    arrival: {
        time: string;
        date: string;
        airport: string;
        terminal?: string;
    };
    duration: string;
}

const FLIGHTS: FlightSegment[] = [
    {
        airline: "Qatar Airways",
        flightNumber: "QR 768",
        aircraft: "Airbus A350-1000",
        class: "Economy(N)",
        departure: {
            time: "21:00",
            date: "Thu, 09 Apr 2026",
            airport: "YYZ",
            terminal: "3",
        },
        arrival: {
            time: "16:35 (+1)",
            date: "Fri, 10 Apr 2026",
            airport: "DOH"
        },
        duration: "12h 35m",
    },
    {
        airline: "Qatar Airways",
        flightNumber: "QR 516",
        aircraft: "Airbus A330-300",
        class: "Economy(N)",
        departure: {
            time: "20:00",
            date: "Fri, 10 Apr 2026",
            airport: "DOH",
        },
        arrival: {
            time: "02:45 (+1)",
            date: "Sat, 11 Apr 2026",
            airport: "COK",
            terminal: "3",
        },
        duration: "04h 15m",
    }
];

export default function FlightTracker() {
    return (
        <section className="py-16 px-4 w-full max-w-5xl mx-auto relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    The Journey Home
                </h2>
                <p className="text-slate-400 mt-4 text-lg">Tracking MS Architha Nair's Flight</p>
            </motion.div>

            <div className="space-y-6">
                {FLIGHTS.map((flight, index) => (
                    <motion.div
                        key={flight.flightNumber}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 hover:bg-slate-800/80 transition-all duration-300 group shadow-xl"
                    >
                        {/* Header: Airline & Aircraft info */}
                        <div className="flex flex-wrap items-center justify-between border-b border-slate-700/50 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600">
                                    <PlaneTakeoff className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-200">{flight.flightNumber}</h3>
                                    <p className="text-sm text-slate-400 flex items-center gap-2">
                                        Operated by {flight.airline} <span className="w-1 h-1 bg-slate-500 rounded-full" /> {flight.aircraft}
                                    </p>
                                </div>
                            </div>
                            <span className="mt-2 sm:mt-0 px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full border border-slate-700">
                                {flight.class}
                            </span>
                        </div>

                        {/* Flight Path Details */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">

                            {/* Departure */}
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-sm text-slate-400 mb-1 font-medium">{flight.departure.date}</p>
                                <div className="flex items-baseline justify-center md:justify-start gap-2">
                                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                                        {flight.departure.time}
                                    </span>
                                    <span className="text-2xl font-bold text-blue-400">{flight.departure.airport}</span>
                                </div>
                                {flight.departure.terminal && (
                                    <p className="text-sm text-slate-500 mt-2">Terminal: {flight.departure.terminal}</p>
                                )}
                            </div>

                            {/* Path & Duration */}
                            <div className="flex flex-col items-center flex-1 w-full px-4 text-center">
                                <div className="flex items-center w-full justify-center text-slate-500 text-sm font-medium mb-2 gap-2">
                                    <Clock className="w-4 h-4" />
                                    {flight.duration}
                                </div>
                                <div className="w-full flex items-center justify-center relative">
                                    <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-slate-600 to-transparent top-1/2 -translate-y-1/2" />
                                    <PlaneTakeoff className="w-6 h-6 text-slate-400 bg-slate-900/60 p-1 rounded-full relative z-10 -ml-8 group-hover:translate-x-full transition-transform duration-[3s] ease-linear" />
                                    <PlaneLanding className="w-6 h-6 text-slate-600 bg-slate-900/60 p-1 rounded-full relative z-10 -ml-1" />
                                </div>
                            </div>

                            {/* Arrival */}
                            <div className="flex-1 text-center md:text-right">
                                <p className="text-sm text-slate-400 mb-1 font-medium">{flight.arrival.date}</p>
                                <div className="flex items-baseline justify-center md:justify-end gap-2">
                                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                                        {flight.arrival.time.split(" ")[0]}
                                        <span className="text-base text-slate-500 ml-1 font-normal tracking-normal">{flight.arrival.time.split(" ")[1]}</span>
                                    </span>
                                    <span className="text-2xl font-bold text-purple-400">{flight.arrival.airport}</span>
                                </div>
                                {flight.arrival.terminal && (
                                    <p className="text-sm text-slate-500 mt-2">Terminal: {flight.arrival.terminal}</p>
                                )}
                            </div>
                        </div>

                    </motion.div>
                ))}

                {/* Connection time visually */}
                {FLIGHTS.length > 1 && (
                    <div className="flex items-center justify-center -mt-2 mb-4">
                        <div className="bg-slate-800/80 border border-slate-700/50 px-6 py-2 rounded-full text-sm text-slate-300 font-medium flex items-center gap-2 shadow-lg z-20">
                            <Clock className="w-4 h-4 text-blue-400" />
                            Connection Time in DOH: 03h 25m
                        </div>
                    </div>
                )}

                {/* Total Duration Footer */}
                <div className="mt-8 text-center text-slate-500 text-sm flex gap-4 justify-center items-center">
                    <span>Total journey: 20h 15m</span>
                    <span>•</span>
                    <span>Checked-in: 2 Piece(s), up to 23 kg each</span>
                </div>
            </div>
        </section>
    );
}
