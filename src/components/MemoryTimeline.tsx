"use client";

import { motion } from "framer-motion";

interface Memory {
    id: number;
    date: string;
    caption: string;
    mediaUrl: string;
    mediaType: "image" | "video";
}

const MEMORIES: Memory[] = [
    { id: 1, date: "Summer 2022", caption: "The adventure began here.", mediaUrl: "/2.jpeg", mediaType: "image" },
    { id: 2, date: "Winter 2023", caption: "Coffee and long conversations.", mediaUrl: "/1.jpeg", mediaType: "image" },
    { id: 3, date: "Spring 2024", caption: "Exploring new horizons.", mediaUrl: "/3.mp4", mediaType: "video" },
    { id: 4, date: "April 2025", caption: "The last goodbye, until next time.", mediaUrl: "/4.jpeg", mediaType: "image" },
];

export default function MemoryTimeline() {
    return (
        <section className="py-24 px-4 w-full max-w-5xl mx-auto relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Our Memories</h2>
                <p className="text-slate-400 mt-4 text-lg">Looking back before looking forward.</p>
            </motion.div>

            <div className="relative border-l-2 border-slate-700/50 ml-4 md:ml-12 space-y-12 pb-12">
                {MEMORIES.map((memory, index) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative pl-8 md:pl-12"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-8 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

                        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-4 md:p-6 rounded-2xl hover:bg-slate-800/80 transition-colors group flex flex-col md:flex-row gap-6 items-center">

                            {/* Media Display */}
                            <div className="w-full md:w-64 h-48 rounded-xl shadow-lg overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 bg-slate-800/50" />
                                {memory.mediaType === "video" ? (
                                    <video
                                        src={memory.mediaUrl}
                                        className="w-full h-full object-cover relative z-10"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={memory.mediaUrl}
                                        alt={memory.caption}
                                        className="w-full h-full object-cover relative z-10"
                                    />
                                )}
                            </div>

                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-sm font-semibold tracking-wider">
                                    {memory.date}
                                </span>
                                <p className="text-xl text-slate-200 mt-2 font-medium leading-relaxed">
                                    {memory.caption}
                                </p>
                            </div>

                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
