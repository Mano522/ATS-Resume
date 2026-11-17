import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, Circle, LockKeyhole } from "lucide-react";
export function RoadmapPath({ steps }) {
    return (_jsx("ol", { className: "roadmap-path", children: steps.map((step, index) => (_jsxs("li", { className: `roadmap-step roadmap-step--${step.state}`, children: [_jsx("span", { className: "roadmap-step__node", "aria-hidden": "true", children: step.state === "done" ? _jsx(Check, { size: 16 }) : step.state === "current" ? _jsx(Circle, { size: 13, fill: "currentColor" }) : _jsx(LockKeyhole, { size: 14 }) }), _jsxs("div", { children: [_jsxs("span", { className: "roadmap-step__number", children: ["STEP ", String(index + 1).padStart(2, "0")] }), _jsx("h3", { children: step.title }), _jsx("p", { children: step.detail })] })] }, step.title))) }));
}
