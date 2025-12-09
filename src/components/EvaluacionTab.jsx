"use client";
import React, { useState, useEffect } from "react";
import { Brain, Loader2, Search, Activity } from "lucide-react";
import Swal from 'sweetalert2'; 

const EvaluacionTab = ({ userId }) => {
  const [enfermedad, setEnfermedad] = useState("");
  const [modelo, setModelo] = useState("");
  const [estudiosCargados, setEstudiosCargados] = useState([]);
  const [estudioSeleccionado, setEstudioSeleccionado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEstudios, setLoadingEstudios] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para la info del doctor
  const [doctorInfo, setDoctorInfo] = useState({ name: "", id: "" });

  const modelosDisponibles = {
    Alzheimer: [
      { nombre: "Tomografía Blanco y Negro", id: "alzheimer_grayscale", tipoArchivo: ".jpg" },
      { nombre: "Tomografía a Color", id: "alzheimer_color", tipoArchivo: ".jpg" },
    ],
    Parkinson: [
      { nombre: "Test Espiral o de Ondas", id: "parkinson_spiral_wave", tipoArchivo: ".jpg" },
    ],
  };

  // 0. OBTENER USUARIO ACTUAL
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/check"); 
        const data = await res.json();
        
        if (data.isAuthenticated) {
          setDoctorInfo({
            name: data.name || data.email, 
            id: data.userId
          });
        }
      } catch (err) {
        console.error("Error verificando sesión", err);
      }
    };
    checkSession();
  }, []);

  // 1. CARGAR ESTUDIOS
  useEffect(() => {
    const fetchEstudios = async () => {
      if (!userId) return;
      try {
        setLoadingEstudios(true);
        setError(null);
        const response = await fetch(`/api/patients/${userId}/estudios`);
        if (!response.ok) throw new Error("Error al obtener los estudios médicos");
        const data = await response.json();
        setEstudiosCargados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingEstudios(false);
      }
    };
    fetchEstudios();
  }, [userId]);

  const mostrarResultadoDiagnostico = (resultado) => {
    Swal.fire({
      title: 'Diagnóstico Completado',
      icon: 'success', 
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
      customClass: { confirmButton: 'mi-boton-personalizado' }
    });
  };

  // --- 2. ENVIAR A EVALUAR (AQUÍ ESTÁ LA CORRECCIÓN) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!enfermedad || !modelo || !estudioSeleccionado) {
      Swal.fire({
        title: '¡Atención!',
        text: "Por favor, completa los 3 pasos: selecciona la enfermedad, el modelo y el estudio.",
        icon: 'warning', 
        confirmButtonText: 'Entendido',
        customClass: { confirmButton: 'mi-boton-personalizado' }
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const estudioObj = estudiosCargados.find(e => e._id === estudioSeleccionado);
      if (!estudioObj) throw new Error("Estudio no encontrado en la lista");

      const response = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: estudioObj.fileUrl, 
          modeloId: modelo,           
          pacienteId: userId,

          // --- AGREGADO: DATOS PARA GUARDAR EN BASE DE DATOS ---
          estudioId: estudioSeleccionado,                // <--- IMPORTANTE: ID del estudio
          nombreProfesional: doctorInfo.name || "Desconocido" // <--- IMPORTANTE: Nombre del doctor
          // ----------------------------------------------------
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error al realizar el diagnóstico");
      }

      const resultado = await response.json();
      mostrarResultadoDiagnostico(resultado);

    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error en la Evaluación',
        text: `Ocurrió un error: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'Cerrar',
        customClass: { confirmButton: 'mi-boton-personalizado' }
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        {/* 2. Selector de Modelo */}
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

        {/* 3. Selector de Estudio */}
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