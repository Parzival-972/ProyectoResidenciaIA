import { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-02-15",
    lastActive: "2024-03-10",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "pending",
    createdAt: "2024-03-01",
    lastActive: "2024-03-01",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
  // Add more mock users as needed
];
