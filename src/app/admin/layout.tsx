"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ClientSideWrapper from "@/components/ClientSideWrapper";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login"); // Redirect to login
      } else if (role !== "Admin") {
        router.push("/unauthorized"); // Redirect if not an admin
      }
    }
  }, [isAuthenticated, role, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || role !== "Admin") return null;

  return <ClientSideWrapper requireAdmin={true}>{children}</ClientSideWrapper>;
};

export default AdminLayout;
