"use client";
import React, { useState } from "react";
import { Upload, Brain } from "lucide-react";

const EvaluacionTab = ({ userId }) => {
  const [modelo, setModelo] = useState("");
  const [imagen, setImagen] = useState(null);

  const handleFileChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!modelo) {
      alert("Por favor, selecciona un modelo.");
      return;
    }
    if (modelo === "alzheimer" && !imagen) {
      alert("Debes subir una imagen para el modelo de Alzheimer.");
      return;
    }

    // Aquí más adelante haremos la conexión con la API de predicción 🔮
    alert(`Modelo seleccionado: ${modelo}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Evaluación de Estudio Médico
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar modelo
          </label>
          <select
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Selecciona un modelo --</option>
            <option value="alzheimer">Alzheimer</option>
            <option value="parkinson">Parkinson</option>
          </select>
        </div>

        {/* Subida de imagen solo si es Alzheimer */}
        {modelo === "alzheimer" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subir imagen (Resonancia o Tomografía)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full border rounded-md p-2"
            />
            {imagen && (
              <p className="text-sm text-gray-500 mt-2">
                Archivo seleccionado: {imagen.name}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Evaluar
        </button>
      </form>
    </div>
  );
};

export default EvaluacionTab;
