import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import "./public.css";
import "./theme.css";
import "./responsive.css";
export const metadata = {
    title: "ResumeLens | A kinder way to grow your resume",
    description: "Get clear, encouraging feedback and practical next steps for your resume.",
};
export default function RootLayout({ children }) {
    return (_jsx("html", { lang: "en", className: "h-full antialiased", suppressHydrationWarning: true, children: _jsx("body", { className: "min-h-full", children: _jsx(ThemeProvider, { attribute: "class", defaultTheme: "light", enableSystem: false, children: children }) }) }));
}
