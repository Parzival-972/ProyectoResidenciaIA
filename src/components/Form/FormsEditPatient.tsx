import React from 'react'; // No olvides importar React

// 1. Usa "export const" en lugar de "const"
export const FormSection = ({ title, children }) => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
};

// 2. Usa "export const"
export const FormInput = ({ label, name, ...props }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-semibold text-gray-600 block"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...props}
        className="block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg px-4 py-2"
      />
    </div>
  );
};

// 3. Usa "export const"
export const FormSelect = ({ label, name, options, ...props }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-semibold text-gray-600 block"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        {...props}
        className="block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded-lg px-4 py-2"
      >
        <option value="" disabled={props.value !== ""}>
          Seleccionar
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};