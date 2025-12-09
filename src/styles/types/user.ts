export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "pending";
  createdAt: string;
  lastActive: string;
  avatarUrl?: string;
}
