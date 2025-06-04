import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  suffix?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  readOnly,
  suffix,
}: FormInputProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`
            block w-full px-4 py-2.5 rounded-xl
            ${readOnly ? "bg-gray-50" : "bg-white/50"}
            border border-gray-200
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            transition-all duration-200
            ${suffix ? "pr-12" : ""}
          `}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
