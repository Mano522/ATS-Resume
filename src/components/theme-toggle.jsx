"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
export function ThemeToggle({ className = "" }) {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
    const dark = mounted && resolvedTheme === "dark";
    return _jsx("button", { className: `theme-toggle ${className}`, type: "button", onClick: () => setTheme(dark ? "light" : "dark"), "aria-label": dark ? "Switch to light mode" : "Switch to dark mode", title: dark ? "Switch to light mode" : "Switch to dark mode", children: dark ? _jsx(Sun, { size: 17 }) : _jsx(Moon, { size: 17 }) });
}
