"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ClientSideWrapper from "@/components/ClientSideWrapper";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <ClientSideWrapper>{children}</ClientSideWrapper>;
};

export default ProtectedLayout;
