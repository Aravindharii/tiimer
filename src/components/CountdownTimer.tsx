"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
} from "date-fns";

// ✈️ EK 242: Departs YYZ — Thu, Apr 09 2026 at 14:55 ET (EDT = UTC-4)
const DEPARTURE_DATE = new Date("2026-04-09T18:55:00Z");

// ✈️ EK 532: Arrives COK — Sat, Apr 11 2026 at 02:55 IST (UTC+5:30)
const ARRIVAL_DATE = new Date("2026-04-10T21:25:00Z");

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
};

function calculateTimeLeft(target: Date): TimeLeft {
    const now = new Date();
    const totalSeconds = differenceInSeconds(target, now);

    if (totalSeconds <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = differenceInDays(target, now);
    const hours = differenceInHours(target, now) % 24;
    const minutes = differenceInMinutes(target, now) % 60;
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, total: totalSeconds };
}

function TimerBlock({
    timeLeft,
    targetDate,
    timezone,
    label,
    flagEmoji,
    accentClass,
    borderGlow,
    glowColor,
    sublabel,
}: {
    timeLeft: TimeLeft;
    targetDate: Date;
    timezone: string;
    label: string;
    flagEmoji: string;
    accentClass: string;
    borderGlow: string;
    glowColor: string;
    sublabel: string;
}) {
    const timeBlocks = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ];

    const formattedTime = new Intl.DateTimeFormat(undefined, {
        timeZone: timezone,
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
    }).format(targetDate);

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Header */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{flagEmoji}</span>
                    <span className={`text-sm font-semibold tracking-widest uppercase ${accentClass}`}>
                        {label}
                    </span>
                </div>
                <span className="text-xs text-slate-500 tracking-wide">{sublabel}</span>
            </div>

            {/* Digit Blocks */}
            <div
                className={`flex flex-wrap items-center justify-center gap-3 sm:gap-5 bg-black/40 p-5 sm:p-7 rounded-3xl backdrop-blur-md border ${borderGlow} shadow-2xl relative`}
            >
                <div className={`absolute inset-0 rounded-3xl blur-xl opacity-15 ${glowColor}`} />
                {timeBlocks.map((block) => (
                    <div key={block.label} className="flex flex-col items-center">
                        <div className="relative w-[72px] h-[88px] sm:w-24 sm:h-28 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            <AnimatePresence mode="popLayout">
                                <motion.span
                                    key={block.value}
                                    initial={{ y: 20, opacity: 0, scale: 0.8 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -20, opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3, type: "spring" }}
                                    className={`text-3xl sm:text-5xl font-bold font-mono tracking-tighter ${accentClass}`}
                                >
                                    {block.value.toString().padStart(2, "0")}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <span className={`mt-2 text-xs sm:text-sm font-light tracking-widest uppercase ${accentClass} opacity-70`}>
                            {block.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Formatted Target Time */}
            <p className={`text-xs sm:text-sm tracking-wide ${accentClass} opacity-60`}>
                <span className="font-medium">Target:</span>{" "}
                <span className="whitespace-nowrap">{formattedTime}</span>
            </p>
        </div>
    );
}

export default function CountdownTimer({ onComplete }: { onComplete: () => void }) {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    // 🇨🇦 Counts down to YYZ departure — Apr 9, 14:55 ET
    const [canadaTimeLeft, setCanadaTimeLeft] = useState<TimeLeft>({
        days: 0, hours: 0, minutes: 0, seconds: 0, total: 1,
    });

    // 🇮🇳 Counts down to COK arrival — Apr 11, 02:55 IST
    const [indiaTimeLeft, setIndiaTimeLeft] = useState<TimeLeft>({
        days: 0, hours: 0, minutes: 0, seconds: 0, total: 1,
    });

    useEffect(() => {
        setMounted(true);
        setCanadaTimeLeft(calculateTimeLeft(DEPARTURE_DATE));
        setIndiaTimeLeft(calculateTimeLeft(ARRIVAL_DATE));

        const timer = setInterval(() => {
            const canada = calculateTimeLeft(DEPARTURE_DATE);
            const india = calculateTimeLeft(ARRIVAL_DATE);
            setCanadaTimeLeft(canada);
            setIndiaTimeLeft(india);

            if (india.total <= 0) {
                onComplete();
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [onComplete]);

    if (!mounted) return null;
    if (indiaTimeLeft.total <= 0) return null;

    const handleCopy = async () => {
        const textToCopy =
            `🇨🇦 Departure in: ${canadaTimeLeft.days}d ${canadaTimeLeft.hours}h ${canadaTimeLeft.minutes}m ${canadaTimeLeft.seconds}s\n` +
            `🇮🇳 Arrival in:   ${indiaTimeLeft.days}d ${indiaTimeLeft.hours}h ${indiaTimeLeft.minutes}m ${indiaTimeLeft.seconds}s`;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="flex flex-col items-center mt-12 z-10 relative gap-12">

            {/* ── Two Timers ── */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 w-full">

                {/* 🇨🇦 Canada — Departure Apr 9, 14:55 ET */}
                <TimerBlock
                    timeLeft={canadaTimeLeft}
                    targetDate={DEPARTURE_DATE}
                    timezone="America/Toronto"
                    label="Canada — Departure"
                    flagEmoji="🇨🇦"
                    sublabel="EK 242 · Apr 09 · 14:55 ET · YYZ"
                    accentClass="text-red-200"
                    borderGlow="border-red-500/20"
                    glowColor="bg-red-500"
                />

                {/* Vertical Divider */}
                <div className="hidden lg:flex flex-col items-center gap-3 text-white/20 select-none">
                    <div className="w-px h-36 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <span className="text-lg">✈️</span>
                    <div className="w-px h-36 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>

                {/* Mobile Divider */}
                <div className="flex lg:hidden items-center gap-3 w-full max-w-xs">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="text-lg">✈️</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                {/* 🇮🇳 India — Arrival Apr 11, 02:55 IST */}
                <TimerBlock
                    timeLeft={indiaTimeLeft}
                    targetDate={ARRIVAL_DATE}
                    timezone="Asia/Kolkata"
                    label="India — Arrival"
                    flagEmoji="🇮🇳"
                    sublabel="EK 532 · Apr 11 · 02:55 IST · COK"
                    accentClass="text-blue-100"
                    borderGlow="border-white/10"
                    glowColor="bg-blue-500"
                />
            </div>

            {/* ── Copy Button ── */}
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all text-blue-100 font-medium tracking-wide shadow-lg group cursor-pointer"
            >
                {copied ? (
                    <>
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                    </>
                ) : (
                    <>
                        <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Copy Timers</span>
                    </>
                )}
            </button>
        </div>
    );
}