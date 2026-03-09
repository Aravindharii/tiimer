"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export default function PlaneAnimation() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <motion.div
                initial={{ x: "-10vw", y: "80vh", rotate: -15, scale: 0.5 }}
                animate={{
                    x: "110vw",
                    y: "10vh",
                    rotate: [-15, -5, -15, -10],
                    scale: [0.5, 1, 0.8, 0.5] // simulate perspective
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 5
                }}
                className="absolute"
            >
                <div className="relative">
                    {/* Plane Tail Trail */}
                    <div className="absolute top-[50%] right-[100%] w-32 h-1 bg-gradient-to-r from-transparent to-white/30 rounded-full blur-[1px]" />
                    <Plane className="w-12 h-12 text-slate-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] fill-slate-300" strokeWidth={1} />
                </div>
            </motion.div>

            {/* Secondary distant plane */}
            <motion.div
                initial={{ x: "110vw", y: "30vh", rotate: -165, scale: 0.2 }}
                animate={{
                    x: "-10vw",
                    y: "50vh",
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 10
                }}
                className="absolute opacity-30 blur-[1px]"
            >
                <Plane className="w-6 h-6 text-slate-400 fill-slate-400" strokeWidth={1} />
            </motion.div>
        </div>
    );
}
