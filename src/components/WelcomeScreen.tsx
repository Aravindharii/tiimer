"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PartyPopper } from "lucide-react";

export default function WelcomeScreen() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Play a gentle welcome sound if allowed by browser policies
        try {
            // NOTE: Browsers often block autoplaying audio without user interaction.
            // This is a generic chime. Using a low volume sine wave just as a placeholder
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
            oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // slide to A5

            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 1.5);
        } catch (e) {
            console.log("Audio not supported or blocked");
        }

        // Trigger awesome confetti
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3b82f6', '#8b5cf6', '#ec4899']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#3b82f6', '#8b5cf6', '#ec4899']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    if (!mounted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_100%)] pointer-events-none" />

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                className="bg-slate-900 border border-slate-700/50 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-2xl w-full text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/30"
                >
                    <PartyPopper className="w-10 h-10 text-blue-400" />
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight">
                    Welcome back!
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 font-medium">
                    We&apos;ve been waiting for you.
                </p>

            </motion.div>
        </motion.div>
    );
}
