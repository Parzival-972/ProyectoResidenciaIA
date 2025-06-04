import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HealthSectionProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

const HealthSection = ({ title, children, delay = 0 }: HealthSectionProps) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    className="mb-8"
  >
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </motion.section>
);

export default HealthSection;
