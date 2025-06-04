"use client";
import PatientTable from "@/components/PatientTable";
import ProtectedRoute from "@/components/ProtectedRoute";
export default function Patients() {
  return (
    <ProtectedRoute>
      <main>
        <PatientTable />
      </main>
    </ProtectedRoute>
  );
}
