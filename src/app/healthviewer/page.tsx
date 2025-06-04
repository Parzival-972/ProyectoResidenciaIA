"use client";

import HealthDataViewer from "@/components/HealthDataViewer";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <HealthDataViewer />
      </div>
    </ProtectedRoute>
  );
}
