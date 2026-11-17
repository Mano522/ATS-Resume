"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
export function Tooltip({ children, content }) {
    return _jsx(TooltipPrimitive.Provider, { delayDuration: 250, children: _jsxs(TooltipPrimitive.Root, { children: [_jsx(TooltipPrimitive.Trigger, { asChild: true, children: children }), _jsx(TooltipPrimitive.Portal, { children: _jsxs(TooltipPrimitive.Content, { className: "lens-tooltip", sideOffset: 6, children: [content, _jsx(TooltipPrimitive.Arrow, { className: "lens-tooltip__arrow" })] }) })] }) });
}
