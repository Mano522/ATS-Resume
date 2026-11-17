import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
export default function AuthPage({ searchParams }) {
    return _jsx(Suspense, { fallback: _jsx("main", { className: "auth-page", children: _jsxs("div", { className: "auth-loading", children: [_jsxs("span", { className: "brand-mark", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }), _jsx("p", { children: "Opening your space\u2026" })] }) }), children: _jsx(AuthContent, { searchParams: searchParams }) });
}
async function AuthContent({ searchParams }) {
    const { mode } = await searchParams;
    return _jsx(AuthForm, { initialMode: mode === "login" ? "login" : "register" });
}
