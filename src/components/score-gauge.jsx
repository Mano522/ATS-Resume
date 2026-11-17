"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
export function ScoreGauge({ score, size = 144, strokeWidth = 12, compact = false, label }) {
    const progress = useMotionValue(0);
    const rounded = useTransform(progress, (value) => Math.round(value));
    const [displayScore, setDisplayScore] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    useEffect(() => {
        const controls = animate(progress, score, { duration: 1.1, ease: "easeOut" });
        const unsubscribe = rounded.on("change", setDisplayScore);
        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [progress, rounded, score]);
    return (_jsxs("div", { className: `score-gauge ${compact ? "score-gauge--compact" : ""}`, style: { width: size, height: size }, role: "img", "aria-label": `Resume score ${score} out of 100${label ? `, ${label}` : ""}`, children: [_jsxs("svg", { viewBox: `0 0 ${size} ${size}`, "aria-hidden": "true", children: [_jsx("circle", { className: "score-gauge__track", cx: size / 2, cy: size / 2, r: radius, strokeWidth: strokeWidth }), _jsx(motion.circle, { className: "score-gauge__value", cx: size / 2, cy: size / 2, r: radius, strokeWidth: strokeWidth, strokeDasharray: circumference, initial: { strokeDashoffset: circumference }, animate: { strokeDashoffset: circumference * (1 - score / 100) }, transition: { duration: 1.15, ease: "easeOut" }, transform: `rotate(-90 ${size / 2} ${size / 2})` })] }), _jsxs("div", { className: "score-gauge__center", children: [_jsx("span", { className: "score-gauge__number", children: displayScore }), !compact && _jsx("span", { className: "score-gauge__out-of", children: "out of 100" })] })] }));
}
