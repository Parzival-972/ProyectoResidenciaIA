"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SideBar from "@/components/SideBar"; // Ensure Sidebar component is imported

const ClientSideWrapper = ({ children, requireAdmin = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login"); // Redirect to login if not authenticated
      } else if (requireAdmin && role !== "Admin") {
        router.push("/unauthorized"); // Redirect if not an admin
      }
    }
  }, [isAuthenticated, role, loading, requireAdmin, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Prevent unauthorized users from seeing content
  if (!isAuthenticated || (requireAdmin && role !== "Admin")) {
    return null;
  }

  return (
    <div className="flex w-full">
      {isAuthenticated && (
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <div className="flex flex-col w-full">
        <div className="flex">{children}</div>
      </div>
    </div>
  );
};

export default ClientSideWrapper;
