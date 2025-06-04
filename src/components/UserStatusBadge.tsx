interface UserStatusBadgeProps {
  status: "active" | "pending";
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        status === "active"
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
