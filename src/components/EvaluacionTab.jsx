"use client";
import React, { useState, useEffect } from "react";
import { Brain, Loader2, Search, Activity } from "lucide-react";
import Swal from 'sweetalert2'; 

const EvaluacionTab = ({ userId }) => {
  const [enfermedad, setEnfermedad] = useState("");
  const [modelo, setModelo] = useState(""); // Aquí guardaremos el ID técnico del modelo
  const [estudiosCargados, setEstudiosCargados] = useState([]);
  const [estudioSeleccionado, setEstudioSeleccionado] = useState(""); // ID del estudio
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga para la evaluación
  const [loadingEstudios, setLoadingEstudios] = useState(true); // Estado de carga para los estudios
  const [error, setError] = useState(null);

  // --- CONFIGURACIÓN DE MODELOS ---
  // El 'id' debe coincidir con lo que espera tu API de Python (NeuroAPI)
  const modelosDisponibles = {
    Alzheimer: [
      { nombre: "Tomografía Blanco y Negro", id: "alzheimer_grayscale", tipoArchivo: ".jpg" },
      { nombre: "Tomografía a Color", id: "alzheimer_color", tipoArchivo: ".jpg" },
    ],
    Parkinson: [
      { nombre: "Test Espiral o de Ondas", id: "parkinson_spiral_wave", tipoArchivo: ".jpg" },
    ],
  };

  // --- 1. CARGAR ESTUDIOS ---
  useEffect(() => {
    const fetchEstudios = async () => {
      if (!userId) return;
      try {
        setLoadingEstudios(true);
        setError(null);
        // Usamos el endpoint unificado de estudios que creamos anteriormente
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
        setLoadingEstudios(false);
      }
    };

    fetchEstudios();
  }, [userId]);

  // Función para mostrar el resultado del diagnóstico usando Swal
  const mostrarResultadoDiagnostico = (resultado) => {
    Swal.fire({
      title: 'Diagnóstico Completado',
      icon: 'success', // Usamos un icono de éxito
      
      // Usamos 'html' para dar formato al contenido
      html: 
        `<div style="text-align: left; padding: 0 10px;">
           <p style="font-size: 1.2em; font-weight: bold; margin-bottom: 5px;">
             Resultado: <span style="color: #22c55e;">${resultado.diagnostico}</span>
           </p>
           <p style="font-size: 1.1em; color: #555;">
             Nivel de Certeza: <strong>${resultado.nivel_de_certeza}%</strong>
           </p>
         </div>`,
      
      confirmButtonText: 'Aceptar y Cerrar',
    
      customClass: {
        confirmButton: 'mi-boton-personalizado'
      }
    });
  };

  // --- 2. ENVIAR A EVALUAR ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 💡 MODIFICACIÓN 1: Reemplazar alert() por Swal.fire (Advertencia de datos faltantes)
    if (!enfermedad || !modelo || !estudioSeleccionado) {
      Swal.fire({
        title: '¡Atención!',
        text: "Por favor, completa los 3 pasos: selecciona la enfermedad, el modelo y el estudio.",
        icon: 'warning', 
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'mi-boton-personalizado'
        }
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Buscar el objeto del estudio completo para obtener la URL
      const estudioObj = estudiosCargados.find(e => e._id === estudioSeleccionado);
      if (!estudioObj) throw new Error("Estudio no encontrado en la lista");

      // 2. Llamar a nuestro "puente" de API
      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: estudioObj.fileUrl, // URL de S3
          modeloId: modelo,            // ID técnico (ej: 'alzheimer_grayscale')
          pacienteId: userId
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error al realizar el diagnóstico");
      }

      const resultado = await response.json();

      // 3. Mostrar resultado usando la función Swal
      mostrarResultadoDiagnostico(resultado);

    } catch (err) {
      console.error(err);
      
      // 💡 MODIFICACIÓN 2: Reemplazar alert() por Swal.fire (Error de Diagnóstico)
      Swal.fire({
        title: 'Error en la Evaluación',
        text: `Ocurrió un error: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'Cerrar',
        customClass: {
          confirmButton: 'mi-boton-personalizado'
        }
      });

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar estudios basados en el término de búsqueda
  const estudiosFiltrados = estudiosCargados.filter(
    (estudio) =>
      estudio.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (estudio.tipoDeEstudio && estudio.tipoDeEstudio.toLowerCase().includes(searchTerm.toLowerCase()))
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
              setModelo(""); 
              setEstudioSeleccionado("");
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
                setEstudioSeleccionado(""); 
              }}
              className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Selecciona un modelo --</option>
              {modelosDisponibles[enfermedad]?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
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
            {loadingEstudios ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
                <span className="ml-2">Cargando estudios...</span>
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
              <>
                {/* Barra de búsqueda */}
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
                
                {/* Dropdown de estudios */}
                <select
                  value={estudioSeleccionado}
                  onChange={(e) => setEstudioSeleccionado(e.target.value)}
                  className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500"
                  disabled={estudiosFiltrados.length === 0}
                >
                  <option value="">-- Selecciona un estudio --</option>
                  {estudiosFiltrados.length > 0 ? (
                    estudiosFiltrados.map((estudio) => (
                      <option key={estudio._id} value={estudio._id}>
                        {estudio.fileName} ({estudio.tipoDeEstudio || "Sin tipo"})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No se encontraron estudios</option>
                  )}
                </select>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition font-semibold flex justify-center items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!enfermedad || !modelo || !estudioSeleccionado || loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Procesando Diagnóstico...
            </>
          ) : (
            <>
              <Activity className="h-5 w-5 mr-2" />
              Evaluar Estudio
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EvaluacionTab;