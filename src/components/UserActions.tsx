"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface UserActionsProps {
  status: "active" | "pending";
  onApprove: () => void;
  onReject: () => void;
}

export function UserActions({ status, onApprove, onReject }: UserActionsProps) {
  if (status === "active") return null;

  return (
    <div className="flex space-x-2">
      <button
        onClick={onApprove}
        className="p-1 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
        title="Approve"
      >
        <CheckCircle size={20} />
      </button>
      <button
        onClick={onReject}
        className="p-1 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
        title="Reject"
      >
        <XCircle size={20} />
      </button>
    </div>
  );
}
