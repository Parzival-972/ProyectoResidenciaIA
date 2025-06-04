import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InfoItemProps {
  label: string;
  value: string | number;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <motion.div
    className="mb-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <span className="text-gray-500 text-sm">{label}</span>
    <p className="text-gray-900 font-medium">{value}</p>
  </motion.div>
);

interface InfoSectionProps {
  title: string;
  children: ReactNode;
}

export const InfoSection = ({ title, children }: InfoSectionProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </motion.div>
);

export { InfoItem };
