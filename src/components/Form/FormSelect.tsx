import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Seleccionar opción",
}: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          block w-full px-4 py-2.5 rounded-xl
          bg-white/50 border border-gray-200
          focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          transition-all duration-200
        "
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
