"use client";

import { toast } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  color?: string; // Custom background color
  textColor?: string; // Custom text color
};

export function useToast() {
  const showToast = ({
    title,
    description = "",
    type = "info",
    duration = 5000,
    color,
    textColor,
  }: ToastProps) => {
    const toastFn =
      type === "error"
        ? toast.error
        : type === "success"
        ? toast.success
        : type === "warning"
        ? toast.warning
        : toast.info;

    // Ensure title is always shown, apply custom styles
    toastFn(description ? `${title} - ${description}` : title, {
      duration,
      style: {
        backgroundColor: color || getDefaultBackgroundColor(type),
        color: textColor || "#FFFFFF",
      },
    });
  };

  const getDefaultBackgroundColor = (type: ToastProps["type"]) => {
    switch (type) {
      case "success":
        return "#4CAF50"; // Default green
      case "error":
        return "#F44336"; // Default red
      case "warning":
        return "#FFC107"; // Default yellow
      case "info":
      default:
        return "#2196F3"; // Default blue
    }
  };

  return { toast: showToast };
}
