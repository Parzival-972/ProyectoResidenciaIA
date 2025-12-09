"use client";
import React, { useState, useEffect } from "react";
import { 
  ClipboardList, Calendar, User, Activity, AlertCircle, FileImage, 
  Loader2, Check, X, RotateCcw, FileText
} from "lucide-react";
import Swal from 'sweetalert2'; 

const HistorialTab = ({ userId }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); 

  // Cargar datos al montar
  useEffect(() => {
    const fetchHistorial = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/patients/${userId}/diagnosticos`);
        if (!res.ok) throw new Error("Error al obtener el historial");
        const data = await res.json();
        setHistorial(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, [userId]);

  // --- FUNCIÓN PARA ACTUALIZAR LA VALIDACIÓN ---
  const handleValidacion = async (diagnosticoId, nuevoEstado) => {
    setUpdatingId(diagnosticoId); 

    try {
      const response = await fetch("/api/diagnostico", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: diagnosticoId,
          esCorrecto: nuevoEstado
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar");

      setHistorial(prev => prev.map(item => 
        item._id === diagnosticoId ? { ...item, esCorrecto: nuevoEstado } : item
      ));

      // Toast discreto y profesional
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });

      if (nuevoEstado === true) {
        Toast.fire({ icon: 'success', title: 'Diagnóstico Validado' });
      } else if (nuevoEstado === false) {
        Toast.fire({ icon: 'error', title: 'Marcado como Incorrecto' });
      } else {
        Toast.fire({ icon: 'info', title: 'Validación reiniciada' });
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la validación',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getCertezaBadge = (nivel) => {
    if (nivel >= 85) return "bg-green-50 text-green-700 border border-green-200";
    if (nivel >= 50) return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    return "bg-red-50 text-red-700 border border-red-200";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-gray-500">Cargando historial clínico...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-6xl mx-auto mt-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Historial y Validación de Diagnósticos
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estudio Analizado</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Resultado IA</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Certeza</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Evaluado Por</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-40">Validación</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historial.length > 0 ? (
              historial.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* COLUMNA 1: FECHA */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>

                  {/* COLUMNA 2: ESTUDIO */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     {item.medicalImage ? (
                       <a 
                         href={item.medicalImage.fileUrl} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline group"
                       >
                         <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                         <span className="truncate max-w-[140px]" title={item.medicalImage.fileName}>
                           {item.medicalImage.fileName}
                         </span>
                       </a>
                     ) : (
                       <span className="text-gray-400 italic text-xs flex items-center gap-1">
                         <AlertCircle className="w-3 h-3"/> Archivo no disponible
                       </span>
                     )}
                  </td>

                  {/* COLUMNA 3: DIAGNÓSTICO */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{item.diagnosticoIA}</div>
                    <div className="text-xs text-gray-500 mt-1">Modelo: {item.modeloUsado}</div>
                  </td>

                  {/* COLUMNA 4: CERTEZA */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${getCertezaBadge(item.nivelCerteza)}`}>
                      {item.nivelCerteza}%
                    </span>
                  </td>

                  {/* COLUMNA 5: PROFESIONAL */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {item.profesional}
                    </div>
                  </td>

                  {/* COLUMNA 6: ACCIONES (PROFESIONAL) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {updatingId === item._id ? (
                      <Loader2 className="animate-spin w-5 h-5 mx-auto text-blue-600" />
                    ) : (
                      <div className="flex justify-center items-center gap-2">
                        {/* Botón CORRECTO (Check) */}
                        <button
                          onClick={() => handleValidacion(item._id, true)}
                          title="Validar como Correcto"
                          className={`p-1.5 rounded-full border transition-all ${
                            item.esCorrecto === true 
                              ? "bg-green-600 text-white border-green-600 shadow-md transform scale-105" 
                              : "bg-white text-gray-300 border-gray-200 hover:border-green-500 hover:text-green-500"
                          }`}
                        >
                          <Check className="w-5 h-5" />
                        </button>

                        {/* Botón INCORRECTO (X) */}
                        <button
                          onClick={() => handleValidacion(item._id, false)}
                          title="Marcar como Incorrecto"
                          className={`p-1.5 rounded-full border transition-all ${
                            item.esCorrecto === false 
                              ? "bg-red-600 text-white border-red-600 shadow-md transform scale-105" 
                              : "bg-white text-gray-300 border-gray-200 hover:border-red-500 hover:text-red-500"
                          }`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                        
                        {/* Botón RESET */}
                        {(item.esCorrecto !== null) && (
                           <button
                             onClick={() => handleValidacion(item._id, null)}
                             title="Deshacer selección"
                             className="p-1 ml-1 text-gray-300 hover:text-blue-500 transition-colors"
                           >
                             <RotateCcw className="w-4 h-4" />
                           </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  <Activity className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                  <p>No hay diagnósticos registrados para este paciente.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialTab;