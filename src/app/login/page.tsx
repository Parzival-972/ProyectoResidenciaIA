"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Extract the redirect URL or default to "/healthviewer"
  const redirectUrl = searchParams.get("redirect") || "/healthviewer";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.role);
        router.push(redirectUrl);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Email o contraseña inválida.");
      }
    } catch (err) {
      setError("Ha ocurrido un error inesperado. Por favor intente más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Bienvenido
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ingresa a tu cuenta
          </p>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className={`relative w-full flex items-center justify-center px-4 py-3 text-white rounded-xl text-sm font-medium transition duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting && (
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Iniciando sesión..." : "Inicia sesión"}
          </motion.button>
        </form>

        <motion.div whileHover={{ scale: 1.01 }} className="text-center">
          <Link
            href="/register"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition duration-200"
          >
            ¿No tienes una cuenta? Regístrate
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPageContent />
      </Suspense>
    </div>
  );
}
