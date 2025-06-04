"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Heart,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const { logout, role } = useAuth(); // Get role from AuthContext
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "72px" },
  };

  console.log(role);

  // Dynamically filter menu items based on role
  const menuItems = [
    ...(role === "Admin"
      ? [
          {
            title: "Administrador",
            icon: <LayoutDashboard size={20} />,
            href: "/admin",
          },
        ]
      : []),
    {
      title: "Datos de Salud",
      icon: <Heart size={20} />,
      href: "/healthviewer",
    },
    { title: "Pacientes", icon: <Users size={20} />, href: "/patients" },
    { title: "Ajustes", icon: <Settings size={20} />, href: "/settings" },
  ];

  const handleLogout = () => {
    logout(); // Clear the token and authentication state
    router.push("/login"); // Redirect to the login page
  };

  return (
    <motion.div
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight
            size={16}
            className="text-gray-600 dark:text-gray-400"
          />
        </motion.div>
      </button>

      {/* Logo Area */}
      <div className="p-4 flex items-center space-x-3">
        <motion.div
          animate={{ scale: isCollapsed ? 1.2 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Heart size={24} className="text-blue-600" />
        </motion.div>
        <motion.span
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="font-semibold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden"
        >
          Health Portal
        </motion.span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">
                  {item.icon}
                </span>
                <motion.span
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    x: isCollapsed ? -10 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-500 whitespace-nowrap overflow-hidden"
                >
                  {item.title}
                </motion.span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <motion.span
            animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -10 : 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap overflow-hidden"
          >
            Cerrar sesión
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
}
