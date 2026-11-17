import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DiffViewer({ before, after, leftLabel = "Before", rightLabel = "After · suggested" }) {
    return (_jsxs("div", { className: "diff-viewer", children: [_jsxs("section", { className: "diff-pane diff-pane--before", children: [_jsx("span", { className: "field-label", children: leftLabel }), _jsx("p", { children: before })] }), _jsxs("section", { className: "diff-pane diff-pane--after", children: [_jsx("span", { className: "field-label", children: rightLabel }), _jsx("p", { children: after })] })] }));
}
