"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    PlaneTakeoff,
    PlaneLanding,
    Clock,
    RefreshCw,
    Wifi,
    WifiOff,
    CircleCheck,
    CircleAlert,
    Loader2,
} from "lucide-react";

// ── Static flight schedule ────────────────────────────────────────────────────
interface FlightSegment {
    airline: string;
    flightNumber: string;
    flightIata: string;
    aircraft: string;
    class: string;
    departure: {
        time: string;
        date: string;
        airport: string;
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
        airline: "Emirates",
        flightNumber: "EK 242",
        flightIata: "EK242",
        aircraft: "Airbus A380-800",
        class: "Economy / Saver",
        departure: {
            time: "14:55",
            date: "Thu, 09 Apr 2026",
            airport: "YYZ",
        },
        arrival: {
            time: "12:40 (+1)",
            date: "Fri, 10 Apr 2026",
            airport: "DXB",
        },
        duration: "13h 45m",
    },
    {
        airline: "Emirates",
        flightNumber: "EK 532",
        flightIata: "EK532",
        aircraft: "Boeing 777-300ER",
        class: "Economy / Saver",
        departure: {
            time: "21:25",
            date: "Fri, 10 Apr 2026",
            airport: "DXB",
        },
        arrival: {
            time: "02:55 (+1)",
            date: "Sat, 11 Apr 2026",
            airport: "COK",
        },
        duration: "04h 00m",
    },
];

// ── AeroDataBox response shape ────────────────────────────────────────────────
interface LiveFlight {
    status: string; // "Expected" | "EnRoute" | "Landed" | "Cancelled" | "Diverted"
    departure: {
        airport: { iata: string; name: string };
        scheduledTime: { local: string; utc: string };
        revisedTime?: { local: string; utc: string };
        actualTime?: { local: string };
        terminal?: string;
        gate?: string;
        delay?: number;
    };
    arrival: {
        airport: { iata: string; name: string };
        scheduledTime: { local: string; utc: string };
        revisedTime?: { local: string; utc: string };
        actualTime?: { local: string };
        terminal?: string;
        gate?: string;
        delay?: number;
        baggageBelt?: string;
    };
    aircraft?: {
        reg: string;
        model: string;
    };
    greatCircleDistance?: {
        km: number;
        mile: number;
    };
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
    string,
    { label: string; className: string; icon: React.ReactNode }
> = {
    Expected: {
        label: "Scheduled",
        className: "bg-slate-700/80 text-slate-300 border-slate-600",
        icon: <Clock className="w-3 h-3" />,
    },
    EnRoute: {
        label: "In Air ✈️",
        className:
            "bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse",
        icon: <Wifi className="w-3 h-3" />,
    },
    Landed: {
        label: "Landed ✅",
        className: "bg-green-500/20 text-green-300 border-green-500/40",
        icon: <CircleCheck className="w-3 h-3" />,
    },
    Cancelled: {
        label: "Cancelled",
        className: "bg-red-500/20 text-red-300 border-red-500/40",
        icon: <CircleAlert className="w-3 h-3" />,
    },
    Diverted: {
        label: "Diverted",
        className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
        icon: <CircleAlert className="w-3 h-3" />,
    },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extracts HH:MM from AeroDataBox local time string "2026-04-09 21:00+05:30" */
function fmtTime(iso?: string): string {
    if (!iso) return "—";
    const parts = iso.split(" ");
    return parts[1]?.substring(0, 5) ?? "—";
}

function DelayBadge({ minutes }: { minutes?: number }) {
    if (!minutes || minutes <= 0)
        return <span className="text-green-400 text-xs font-medium">On time</span>;
    return (
        <span className="text-red-400 text-xs font-medium">+{minutes} min delay</span>
    );
}

// ── Status Pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["Expected"];
    return (
        <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide ${cfg.className}`}
        >
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

// ── Live Data Panel ───────────────────────────────────────────────────────────
function LiveDataPanel({ live }: { live: LiveFlight }) {
    const depTime =
        live.departure.actualTime?.local ??
        live.departure.revisedTime?.local ??
        live.departure.scheduledTime?.local;

    const arrTime =
        live.arrival.actualTime?.local ??
        live.arrival.revisedTime?.local ??
        live.arrival.scheduledTime?.local;

    const cards = [
        {
            label: "Departed",
            value: fmtTime(depTime),
            sub: <DelayBadge minutes={live.departure.delay} />,
            extra: live.departure.gate
                ? `Gate ${live.departure.gate}`
                : undefined,
            accent: "text-white",
        },
        {
            label: "Arrives (Est.)",
            value: fmtTime(arrTime),
            sub: <DelayBadge minutes={live.arrival.delay} />,
            extra: live.arrival.gate
                ? `Gate ${live.arrival.gate}`
                : undefined,
            accent: "text-white",
        },
        live.greatCircleDistance
            ? {
                label: "Distance",
                value: `${live.greatCircleDistance.km.toLocaleString()} km`,
                sub: (
                    <span className="text-slate-500 text-xs">
                        {live.greatCircleDistance.mile.toLocaleString()} mi
                    </span>
                ),
                extra: undefined,
                accent: "text-blue-300",
            }
            : null,
        live.arrival.baggageBelt
            ? {
                label: "Baggage Belt",
                value: `Belt ${live.arrival.baggageBelt}`,
                sub: (
                    <span className="text-slate-500 text-xs">
                        After landing
                    </span>
                ),
                extra: undefined,
                accent: "text-purple-300",
            }
            : null,
    ].filter(Boolean) as {
        label: string;
        value: string;
        sub: React.ReactNode;
        extra?: string;
        accent: string;
    }[];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 pt-5 border-t border-slate-700/50 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="bg-slate-800/60 rounded-2xl p-3 flex flex-col gap-1"
                >
                    <span className="text-xs text-slate-500 uppercase tracking-widest">
                        {card.label}
                    </span>
                    <span
                        className={`text-lg font-bold font-mono ${card.accent}`}
                    >
                        {card.value}
                    </span>
                    {card.sub}
                    {card.extra && (
                        <span className="text-xs text-slate-400">
                            {card.extra}
                        </span>
                    )}
                </div>
            ))}

            {/* Aircraft reg if available */}
            {live.aircraft?.reg && (
                <div className="col-span-2 sm:col-span-4 flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <PlaneTakeoff className="w-3 h-3" />
                    Aircraft: {live.aircraft.model} · Reg:{" "}
                    <span className="text-slate-400 font-mono">
                        {live.aircraft.reg}
                    </span>
                </div>
            )}
        </motion.div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function FlightTracker() {
    const [liveData, setLiveData] = useState<
        Record<string, LiveFlight | null>
    >({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<Record<string, string | null>>({});
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchFlight = useCallback(async (flightIata: string, flightNumber: string) => {
        setLoading((prev) => ({ ...prev, [flightNumber]: true }));
        setError((prev) => ({ ...prev, [flightNumber]: null }));

        try {
            const res = await fetch(`/api/flight?flight_iata=${flightIata}`);
            const json = await res.json();

            if (json?.data?.length > 0) {
                setLiveData((prev) => ({
                    ...prev,
                    [flightNumber]: json.data[0],
                }));
            } else {
                setError((prev) => ({
                    ...prev,
                    [flightNumber]:
                        "No live data yet — flight not active.",
                }));
            }
        } catch {
            setError((prev) => ({
                ...prev,
                [flightNumber]: "Could not reach tracking service.",
            }));
        } finally {
            setLoading((prev) => ({ ...prev, [flightNumber]: false }));
            setLastUpdated(new Date());
        }
    }, []);

    // Fetch on mount + poll every 60s
    useEffect(() => {
        FLIGHTS.forEach((f) => fetchFlight(f.flightIata, f.flightNumber));
        const interval = setInterval(() => {
            FLIGHTS.forEach((f) => fetchFlight(f.flightIata, f.flightNumber));
        }, 60_000);
        return () => clearInterval(interval);
    }, [fetchFlight]);

    return (
        <section className="py-16 px-4 w-full max-w-5xl mx-auto relative z-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    The Journey Home
                </h2>
                <p className="text-slate-400 mt-4 text-lg">
                    Tracking MS Architha Nair's Flight
                </p>

                {/* Last updated + manual refresh */}
                <div className="flex items-center justify-center gap-3 mt-4">
                    {lastUpdated && (
                        <span className="text-xs text-slate-500">
                            Updated{" "}
                            {lastUpdated.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    )}
                    <button
                        onClick={() =>
                            FLIGHTS.forEach((f) =>
                                fetchFlight(f.flightIata, f.flightNumber)
                            )
                        }
                        className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Refresh
                    </button>
                </div>
            </motion.div>

            <div className="space-y-6">
                {FLIGHTS.map((flight, index) => {
                    const live = liveData[flight.flightNumber];
                    const isLoading = loading[flight.flightNumber];
                    const err = error[flight.flightNumber];

                    return (
                        <motion.div
                            key={flight.flightNumber}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 sm:p-8 hover:bg-slate-800/80 transition-all duration-300 group shadow-xl"
                        >
                            {/* ── Card Header ── */}
                            <div className="flex flex-wrap items-center justify-between border-b border-slate-700/50 pb-4 mb-6 gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600">
                                        <PlaneTakeoff className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-200">
                                            {flight.flightNumber}
                                        </h3>
                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                            Operated by {flight.airline}
                                            <span className="w-1 h-1 bg-slate-500 rounded-full inline-block" />
                                            {/* Prefer live aircraft model if available */}
                                            {live?.aircraft?.model ?? flight.aircraft}
                                        </p>
                                    </div>
                                </div>

                                {/* Right badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full border border-slate-700">
                                        {flight.class}
                                    </span>
                                    {isLoading && (
                                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Fetching…
                                        </span>
                                    )}
                                    {!isLoading && live && (
                                        <StatusPill status={live.status} />
                                    )}
                                    {!isLoading && !live && !err && (
                                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <WifiOff className="w-3 h-3" />
                                            Not yet active
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* ── Flight Path ── */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">

                                {/* Departure */}
                                <div className="flex-1 text-center md:text-left">
                                    <p className="text-sm text-slate-400 mb-1 font-medium">
                                        {flight.departure.date}
                                    </p>
                                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                                            {flight.departure.time}
                                        </span>
                                        <span className="text-2xl font-bold text-blue-400">
                                            {flight.departure.airport}
                                        </span>
                                    </div>
                                    {flight.departure.terminal && (
                                        <p className="text-sm text-slate-500 mt-1">
                                            Terminal: {flight.departure.terminal}
                                        </p>
                                    )}
                                    {/* Live gate */}
                                    {live?.departure.gate && (
                                        <p className="text-sm text-blue-400 mt-1 font-medium">
                                            Gate: {live.departure.gate}
                                        </p>
                                    )}
                                    {/* Delay warning */}
                                    {live?.departure.delay && live.departure.delay > 0 && (
                                        <p className="text-xs text-red-400 mt-1">
                                            Delayed +{live.departure.delay} min
                                        </p>
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
                                    {/* Live status label under path */}
                                    {live?.status === "EnRoute" && (
                                        <p className="text-xs text-blue-400 mt-2 animate-pulse">
                                            ✈️ Currently airborne
                                        </p>
                                    )}
                                </div>

                                {/* Arrival */}
                                <div className="flex-1 text-center md:text-right">
                                    <p className="text-sm text-slate-400 mb-1 font-medium">
                                        {flight.arrival.date}
                                    </p>
                                    <div className="flex items-baseline justify-center md:justify-end gap-2">
                                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                                            {flight.arrival.time.split(" ")[0]}
                                            <span className="text-base text-slate-500 ml-1 font-normal tracking-normal">
                                                {flight.arrival.time.split(" ")[1]}
                                            </span>
                                        </span>
                                        <span className="text-2xl font-bold text-purple-400">
                                            {flight.arrival.airport}
                                        </span>
                                    </div>
                                    {flight.arrival.terminal && (
                                        <p className="text-sm text-slate-500 mt-1">
                                            Terminal: {flight.arrival.terminal}
                                        </p>
                                    )}
                                    {/* Live gate */}
                                    {live?.arrival.gate && (
                                        <p className="text-sm text-purple-400 mt-1 font-medium">
                                            Gate: {live.arrival.gate}
                                        </p>
                                    )}
                                    {/* Arrival delay */}
                                    {live?.arrival.delay && live.arrival.delay > 0 && (
                                        <p className="text-xs text-red-400 mt-1">
                                            Delayed +{live.arrival.delay} min
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* ── Live Data Panel (shows only when live data exists) ── */}
                            {live && <LiveDataPanel live={live} />}

                            {/* Error message */}
                            {err && !isLoading && (
                                <p className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                                    <WifiOff className="w-3.5 h-3.5" />
                                    {err}
                                </p>
                            )}
                        </motion.div>
                    );
                })}

                {/* Connection time */}
                {FLIGHTS.length > 1 && (
                    <div className="flex items-center justify-center -mt-2 mb-4">
                        <div className="bg-slate-800/80 border border-slate-700/50 px-6 py-2 rounded-full text-sm text-slate-300 font-medium flex items-center gap-2 shadow-lg z-20">
                            <Clock className="w-4 h-4 text-blue-400" />
                            Connection Time in DXB: 08h 45m
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-slate-500 text-sm flex gap-4 justify-center items-center flex-wrap">
                    <span>Total journey: 26h 30m</span>
                    <span>•</span>
                    <span>Route: YYZ → DXB → COK</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-blue-400" />
                        Live via AeroDataBox
                    </span>
                </div>
            </div>
        </section>
    );
}