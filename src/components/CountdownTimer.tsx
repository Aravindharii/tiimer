"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

// Arrival time in COK is April 11, 2026 at 02:45 AM IST (+05:30)
// To ensure it triggers exactly at local time, we specify the timezone offset.
const TARGET_DATE = new Date("2026-04-10T21:15:00Z"); // 02:45 IST in UTC 

export default function CountdownTimer({ onComplete }: { onComplete: () => void }) {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 1 // Start > 0 to prevent immediate complete
    });

    useEffect(() => {
        setMounted(true);

        const calculateTimeLeft = () => {
            const now = new Date();
            const totalSeconds = differenceInSeconds(TARGET_DATE, now);

            if (totalSeconds <= 0) {
                onComplete();
                return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
            }

            // precise modulo calculation
            const days = differenceInDays(TARGET_DATE, now);
            const hours = differenceInHours(TARGET_DATE, now) % 24;
            const minutes = differenceInMinutes(TARGET_DATE, now) % 60;
            const seconds = totalSeconds % 60;

            return { days, hours, minutes, seconds, total: totalSeconds };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [onComplete]);

    if (!mounted) return null; // Avoid hydration mismatch

    if (timeLeft.total <= 0) return null;

    const timeBlocks = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ];

    const handleCopy = async () => {
        const textToCopy = `${timeLeft.days} Days, ${timeLeft.hours} Hours, ${timeLeft.minutes} Minutes, ${timeLeft.seconds} Seconds remaining!`;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // Fallback for older browsers or non-secure contexts (e.g., local network IP testing)
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;

                // Avoid scrolling to bottom
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="flex flex-col items-center mt-12 z-10 relative gap-8">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-black/40 p-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-xl" />
                {timeBlocks.map((block) => (
                    <div key={block.label} className="flex flex-col items-center">
                        <div className="relative w-20 h-24 sm:w-28 sm:h-32 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] neon-border overflow-hidden">
                            {/* Glossy overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                            <AnimatePresence mode="popLayout">
                                <motion.span
                                    key={block.value}
                                    initial={{ y: 20, opacity: 0, scale: 0.8 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -20, opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3, type: "spring" }}
                                    className="text-4xl sm:text-6xl font-bold neon-text text-blue-100 font-mono tracking-tighter"
                                >
                                    {block.value.toString().padStart(2, "0")}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <span className="mt-3 text-sm sm:text-base text-blue-200 font-light tracking-widest uppercase">
                            {block.label}
                        </span>
                    </div>
                ))}
            </div>

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
                        <span>Copy Timer</span>
                    </>
                )}
            </button>
        </div>
    );
}
