import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, Plus } from "lucide-react";
export function SkillChip({ children, kind = "existing", onClick }) {
    const Icon = kind === "existing" ? Check : Plus;
    return (_jsxs("button", { className: `skill-chip skill-chip--${kind}`, type: "button", onClick: onClick, "aria-label": `${kind === "existing" ? "Existing skill" : kind === "missing" ? "Missing skill" : "Recommended skill"}: ${children}`, children: [_jsx(Icon, { size: 13, strokeWidth: 2.4, "aria-hidden": "true" }), children] }));
}
