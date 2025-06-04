"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Flag to enforce admin role
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        console.log("hello");
        // router.push("/login"); // Redirect to login if not authenticated
      } else if (requireAdmin && role !== "Admin") {
        console.log("admin");
        // router.push("/unauthorized"); // Redirect if not an admin
      }
    }
  }, [isAuthenticated, role, loading, requireAdmin, router]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (!isAuthenticated || (requireAdmin && role !== "admin")) {
    return null; // Prevent rendering content
  }

  return <>{children}</>;
};

export default ProtectedRoute;
