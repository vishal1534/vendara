/**
 * Callout Component
 * 
 * Use callouts to add explanatory notes, highlight important features, or document 
 * design decisions in wireframes.
 * 
 * Types:
 * - info (blue): General information, explanations
 * - warning (yellow): Constraints, limitations, important considerations
 * - success (green): Benefits, positive outcomes, value propositions
 * - note (purple): Technical notes, implementation details
 * - feature (orange): Feature highlights, UX patterns, design choices
 * 
 * Usage:
 * <Callout type="feature" title="Feature Name">
 *   Description of the feature or design decision
 * </Callout>
 */

import { Info, AlertCircle, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

type CalloutType = "info" | "warning" | "success" | "note" | "feature";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({ type = "info", title, children, className = "" }: CalloutProps) {
  const config = {
    info: {
      icon: Info,
      borderColor: "border-blue-400",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
    },
    warning: {
      icon: AlertTriangle,
      borderColor: "border-yellow-400",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-900",
    },
    success: {
      icon: CheckCircle,
      borderColor: "border-green-400",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
    },
    note: {
      icon: AlertCircle,
      borderColor: "border-purple-400",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      titleColor: "text-purple-900",
    },
    feature: {
      icon: Lightbulb,
      borderColor: "border-orange-400",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      titleColor: "text-orange-900",
    },
  };

  const { icon: Icon, borderColor, bgColor, iconColor, titleColor } = config[type];

  return (
    <div className={`border-2 ${borderColor} ${bgColor} rounded-lg p-3 ${className}`}>
      <div className="flex gap-2">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && <div className={`font-semibold text-sm ${titleColor} mb-1`}>{title}</div>}
          <div className="text-sm text-gray-700">{children}</div>
        </div>
      </div>
    </div>
  );
}
