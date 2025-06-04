"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/useToast";
import { Loader2, User, Mail, Lock, IdCard } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!role || !name || !email || !password || !id) {
      toast({
        title: "Campos faltantes",
        description: "Todos los campos deben ser llenados",
        type: "warning",
      });
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, name, email, password, id }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        toast({
          title: "Registro exitoso",
          description: "¡Bienvenido!",
          type: "success",
        });
        router.push("/healthviewer");
      } else {
        const errorData = await response.json();
        console.log(errorData);
        toast({
          title: "Registro fallido",
          description: errorData.message || "Intente de nuevo.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: `ERROR!`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      id: "role",
      type: "select",
      value: role,
      onChange: setRole,
      placeholder: "Selecciona el rol",
      icon: <User className="text-gray-400" size={20} />,
      options: ["Doctor", "Enfermero", "Técnico", "Administrador", "Otro"],
    },
    {
      id: "name",
      type: "text",
      value: name,
      onChange: setName,
      placeholder: "Nombre completo",
      icon: <User className="text-gray-400" size={20} />,
    },
    {
      id: "email",
      type: "email",
      value: email,
      onChange: setEmail,
      placeholder: "Correo",
      icon: <Mail className="text-gray-400" size={20} />,
    },
    {
      id: "password",
      type: "password",
      value: password,
      onChange: setPassword,
      placeholder: "Contraseña",
      icon: <Lock className="text-gray-400" size={20} />,
    },
    {
      id: "id",
      type: "text",
      value: id,
      onChange: setId,
      placeholder: "ID",
      icon: <IdCard className="text-gray-400" size={20} />,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
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
              Crear cuenta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Únete a la plataforma
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {field.icon}
                </div>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    className="pl-10 w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                )}
              </motion.div>
            ))}

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
              {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
            </motion.button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                o
              </span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.01 }} className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition duration-200"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
