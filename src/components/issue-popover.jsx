"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, Copy, WandSparkles } from "lucide-react";
import { useState } from "react";
export function IssuePopover({ issue, onApply }) {
    const [copied, setCopied] = useState(false);
    const [appliedIds, setAppliedIds] = useState([]);
    const applied = appliedIds.includes(issue.id);
    async function copySuggestion() {
        await navigator.clipboard.writeText(issue.suggestion);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    }
    return (_jsxs("article", { className: "issue-detail", "aria-live": "polite", children: [_jsxs("div", { className: "issue-detail__topline", children: [_jsx("span", { className: `category-mark category-mark--${issue.color}` }), _jsx("span", { className: "eyebrow", children: issue.section }), _jsx("span", { className: `severity severity--${issue.severity.toLowerCase()}`, children: issue.severity })] }), _jsx("h3", { children: issue.issue }), _jsxs("div", { className: "issue-detail__field", children: [_jsx("span", { className: "field-label", children: "Resume check" }), _jsxs("p", { className: "original-line", children: ["\u201C", issue.original, "\u201D"] })] }), _jsx("p", { className: "issue-detail__reason", children: issue.reason }), _jsxs("div", { className: "suggestion-box", children: [_jsxs("span", { className: "field-label", children: [_jsx(WandSparkles, { size: 14 }), " A suggested next step"] }), _jsx("p", { children: issue.suggestion })] }), _jsxs("div", { className: "issue-detail__actions", children: [_jsxs("button", { className: "button button--primary button--small", type: "button", disabled: applied, onClick: () => { setAppliedIds((current) => [...current, issue.id]); onApply(issue.id); }, children: [_jsx(Check, { size: 15 }), " ", applied ? "Reviewed" : "Mark reviewed"] }), _jsxs("button", { className: "button button--quiet button--small", type: "button", onClick: copySuggestion, children: [_jsx(Copy, { size: 15 }), " ", copied ? "Copied" : "Copy"] })] })] }));
}
