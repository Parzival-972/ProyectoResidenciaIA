import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HealthCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  delay?: number;
}

const HealthCard = ({ icon, title, value, delay = 0 }: HealthCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="text-blue-500">{icon}</div>
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
    </div>
    <p className="text-gray-900 font-medium ml-9">{value}</p>
  </motion.div>
);

export default HealthCard;
