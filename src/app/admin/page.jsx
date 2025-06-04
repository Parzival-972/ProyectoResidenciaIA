"use client";

import { useState, useEffect } from "react";
import { UserTable } from "@/components/UserTable";
import { UserSearchBar } from "@/components/UserSearchBar";
import { toast } from "sonner"; // Toast notifications
import ProtectedRoute from "@/components/ProtectedRoute";
export default function UsersPage() {
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []); // Fallback to an empty array if data.users is undefined
        } else {
          toast.error("Failed to fetch users.");
        }
      } catch (err) {
        toast.error("Error fetching users.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleApprove = async (userId) => {
    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isApproved: true }),
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, isApproved: true } : user
          )
        );
        toast.success("User approved successfully.");
      } else {
        toast.error("Failed to approve user.");
      }
    } catch (err) {
      toast.error("Error approving user.");
      console.error(err);
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        toast.success("User rejected successfully.");
      } else {
        toast.error("Failed to reject user.");
      }
    } catch (err) {
      toast.error("Error rejecting user.");
      console.error(err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast.success("Role updated successfully.");
      } else {
        toast.error("Failed to update role.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating role.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Administración de Usuarios
              </h1>
              <UserSearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p>Cargando usuarios...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p>No se encontraron usuarios.</p>
              </div>
            ) : (
              <UserTable
                users={filteredUsers}
                onApprove={handleApprove}
                onReject={handleReject}
                onChangeRole={handleChangeRole}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
