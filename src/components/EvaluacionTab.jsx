"use client";
import React, { useState, useEffect } from "react";
import { Brain, Loader2, Search } from "lucide-react";

const EvaluacionTab = ({ userId }) => {
  const [enfermedad, setEnfermedad] = useState("");
  const [modelo, setModelo] = useState("");
  const [estudiosCargados, setEstudiosCargados] = useState([]);
  const [estudioSeleccionado, setEstudioSeleccionado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Objeto para definir los modelos disponibles por enfermedad
  const modelosDisponibles = {
    Alzheimer: ["Modelo de Resonancia Magnética", "Modelo de Tomografía"],
    Parkinson: ["Modelo de Análisis de Voz", "Modelo de Dibujo Espiral"],
  };

  // Obtener los estudios existentes para este paciente
  useEffect(() => {
    const fetchEstudios = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/patients/${userId}/estudios`);
        if (!response.ok) {
          throw new Error("Error al obtener los estudios médicos");
        }
        const data = await response.json();
        setEstudiosCargados(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudios();
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!enfermedad || !modelo || !estudioSeleccionado) {
      alert("Por favor, completa todos los pasos.");
      return;
    }
    alert(
      `Evaluando estudio ID: ${estudioSeleccionado} para ${enfermedad} con el modelo: ${modelo}`
    );
  };

  // Filtrar estudios basados en el término de búsqueda
  const estudiosFiltrados = estudiosCargados.filter(
    (estudio) =>
      estudio.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudio.tipoDeEstudio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Evaluación de Estudio Médico
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Selector de Enfermedad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1. Seleccionar Enfermedad
          </label>
          <select
            value={enfermedad}
            onChange={(e) => {
              setEnfermedad(e.target.value);
              setModelo(""); // Resetear modelo
              setEstudioSeleccionado(""); // Resetear estudio
            }}
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Selecciona una enfermedad --</option>
            <option value="Alzheimer">Alzheimer</option>
            <option value="Parkinson">Parkinson</option>
          </select>
        </div>

        {/* 2. Selector de Modelo (condicional) */}
        {enfermedad && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              2. Seleccionar Modelo de IA
            </label>
            <select
              value={modelo}
              onChange={(e) => {
                setModelo(e.target.value);
                setEstudioSeleccionado(""); // Resetear estudio
              }}
              className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Selecciona un modelo --</option>
              {modelosDisponibles[enfermedad]?.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 3. Selector de Estudio (condicional) */}
        {modelo && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3. Seleccionar Estudio Cargado
            </label>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
                <span className="ml-2">Cargando estudios...</span>
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
              <>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded-md w-full p-2 pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={estudioSeleccionado}
                  onChange={(e) => setEstudioSeleccionado(e.target.value)}
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500"
                  disabled={estudiosFiltrados.length === 0}
                >
                  <option value="">-- Selecciona un estudio --</option>
                  {estudiosFiltrados.map((estudio) => (
                    <option key={estudio._id} value={estudio._id}>
                      {estudio.fileName} ({estudio.tipoDeEstudio})
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition font-semibold"
          disabled={!modelo || !estudioSeleccionado || loading}
        >
          Evaluar Estudio
        </button>
      </form>
    </div>
  );
};

export default EvaluacionTab;