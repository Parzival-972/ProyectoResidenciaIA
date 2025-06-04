import React from "react";

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormCheckbox({
  label,
  name,
  checked,
  onChange,
}: FormCheckboxProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="
            peer sr-only
          "
        />
        <div
          className="
          h-6 w-6 rounded-lg border-2 border-gray-300
          peer-checked:border-blue-500 peer-checked:bg-blue-500
          transition-all duration-200
          flex items-center justify-center
          group-hover:border-blue-400
        "
        >
          {checked && (
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
        {label}
      </span>
    </label>
  );
}
