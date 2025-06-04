import { motion } from "framer-motion";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}

const TabButton = ({ isActive, onClick, children }: TabButtonProps) => (
  <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <motion.a
      onClick={onClick}
      className={clsx(
        "flex justify-center py-4 px-6 cursor-pointer transition-all duration-200",
        isActive
          ? "bg-white rounded-lg shadow text-indigo-900"
          : "text-gray-500 hover:text-gray-700"
      )}
    >
      {children}
    </motion.a>
  </motion.li>
);

export default TabButton;
