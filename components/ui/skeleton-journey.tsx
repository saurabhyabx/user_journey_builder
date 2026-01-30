
"use client";

import { motion } from "framer-motion";

export function SkeletonJourney() {
    return (
        <div className="w-full h-full p-8 flex flex-col items-center justify-center space-y-8">
            {/* Central "Thinking" Node */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                </div>

                {/* Orbiting particles */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-blue-500/30 border-t-transparent"
                />
            </motion.div>

            {/* Optimistic Journey Path */}
            <div className="flex items-center space-x-4">
                {[1, 2, 3].map((i) => (
                    <React.Fragment key={i}>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            className="w-32 h-20 rounded-xl bg-slate-100 flex flex-col p-3 space-y-2 border border-slate-200"
                        >
                            <div className="w-1/2 h-3 bg-slate-200 rounded animate-pulse" />
                            <div className="w-3/4 h-2 bg-slate-200 rounded animate-pulse" />
                        </motion.div>
                        {i < 3 && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: 32 }}
                                transition={{ delay: i * 0.2 + 0.1 }}
                                className="h-0.5 bg-slate-200"
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <p className="text-slate-400 text-sm font-medium animate-pulse">
                Designing your strategy...
            </p>
        </div>
    );
}

import React from "react";
