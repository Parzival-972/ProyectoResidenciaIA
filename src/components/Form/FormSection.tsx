import React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="backdrop-blur-lg bg-white/30 p-6 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mr-2" />
        {title}
      </h3>
      {children}
    </div>
  );
}
