"use client";
import React, { useState, useEffect } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Eye, Trash2, Loader2 } from "lucide-react";
// Asumimos que esta es tu función para subir archivos a S3, como en Archivos.jsx
import { uploadImage } from "../../libs/s3";

// Helper para formatear el tamaño del archivo
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const EstudiosTab = ({ userId }) => {
  const [paciente, setPaciente] = useState(null);
  const [uploads, setUploads] = useState([]); // Cola de archivos a subir y ya subidos
  const [tipoDeEstudio, setTipoDeEstudio] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulación del nombre del profesional que ha iniciado sesión
  const nombreProfesional = "Oscar Sención";

  // --- 1. OBTENER ESTUDIOS EXISTENTES ---
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Obtener datos del paciente
        const pacienteRes = await fetch(`/api/patients/${userId}`);
        const pacienteData = await pacienteRes.json();
        setPaciente(pacienteData);

        // Obtener estudios existentes
        const estudiosRes = await fetch(`/api/patients/${userId}/estudios`);
        if (!estudiosRes.ok) throw new Error("Error al obtener estudios");
        const estudiosData = await estudiosRes.json();

        // Mapear los estudios existentes al formato de la tabla
        const estudiosExistentes = estudiosData.map(estudio => ({
          id: estudio._id, // Usamos el ID de la base de datos
          file: { name: estudio.fileName, size: estudio.fileSize },
          paciente: `${pacienteData.name} ${pacienteData.apellidoPaterno}`,
          profesional: estudio.subidoPor,
          tipoDeEstudio: estudio.tipoDeEstudio,
          fecha: new Date(estudio.fechaDeCarga),
          status: 'Completado',
          url: estudio.fileUrl, // Guardamos la URL para el botón de "Ver"
        }));
        setUploads(estudiosExistentes);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userId]);


  // --- 2. GUARDAR METADATOS EN LA BASE DE DATOS ---
  const storeEstudioData = async (data) => {
    const response = await fetch(`/api/patients/uploadEstudio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Error al guardar los metadatos del estudio.");
    }
    return await response.json();
  };

  // --- 3. MANEJO DE LA SUBIDA DE ARCHIVOS ---
  const handleUpload = async () => {
    const filesToUpload = uploads.filter(u => u.status === 'Pendiente');
    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    for (const upload of filesToUpload) {
      // Actualizar UI a 'Subiendo'
      setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'Subiendo' } : u));

      try {
        // Subir archivo a S3
        const fileUrl = await uploadImage(upload.file);

        // Guardar metadatos en la base de datos
        const newEstudioData = await storeEstudioData({
          userId: userId,
          fileName: upload.file.name,
          fileSize: upload.file.size,
          fileUrl: fileUrl,
          tipoDeEstudio: upload.tipoDeEstudio,
          subidoPor: nombreProfesional,
        });

        // Actualizar UI a 'Completado' con los datos de la BD
        setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'Completado', id: newEstudioData._id, url: fileUrl } : u));

      } catch (error) {
        console.error("Fallo la subida para el archivo:", upload.file.name, error);
        setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'Error', error: error.message } : u));
      }
    }
    setIsUploading(false);
  };

  // --- 4. MANEJO DEL BORRADO DE ARCHIVOS ---
  const handleDeleteEstudio = async (estudioId, fileUrl) => {
    // Confirmación antes de borrar
    if (!confirm("¿Estás seguro de que quieres eliminar este estudio? Esta acción no se puede deshacer.")) {
        return;
    }
    try {
        // Aquí deberías tener una lógica para borrar de S3 si lo deseas
        // await deleteImageFromS3(fileUrl);
        
        const response = await fetch(`/api/patients/${userId}/estudios`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estudioId }),
        });

        if (!response.ok) throw new Error("Error al eliminar el estudio");

        setUploads(prev => prev.filter(u => u.id !== estudioId));

    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar el estudio.");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && tipoDeEstudio) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: `${file.name}-${Date.now()}`,
        file: file,
        paciente: paciente ? `${paciente.name} ${paciente.apellidoPaterno}` : "N/A",
        profesional: nombreProfesional,
        tipoDeEstudio: tipoDeEstudio,
        fecha: new Date(),
        status: 'Pendiente',
      }));
      setUploads(prev => [...prev, ...newFiles]);
    } else {
        alert("Por favor, selecciona primero un tipo de estudio.");
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-5xl mx-auto mt-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Gestor de Estudios para{" "}
          <span className="text-blue-600">{paciente ? `${paciente.name} ${paciente.apellidoPaterno}` : "Paciente"}</span>
        </h2>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 border rounded-lg bg-gray-50">
          <div className="md:col-span-1">
              <label htmlFor="tipo-estudio" className="block text-sm font-semibold text-gray-700 mb-2">
                1. Tipo de Estudio
              </label>
              <select
                id="tipo-estudio"
                value={tipoDeEstudio}
                onChange={(e) => setTipoDeEstudio(e.target.value)}
                className="block w-full bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                 <option value="" disabled>Seleccione...</option>
                 <option value="Tomografía (TC)">Tomografía (TC)</option>
                 <option value="Resonancia (RM)">Resonancia (RM)</option>
                 <option value="Rayos X">Rayos X</option>
                 <option value="Laboratorio">Laboratorio</option>
                 <option value="Otro">Otro</option>
              </select>
          </div>
          <div className="md:col-span-2">
             <label className="block text-sm font-semibold text-gray-700 mb-2">
                2. Seleccionar Archivos
              </label>
            <input
                id="estudio-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,.pdf,.dcm"
                multiple
                disabled={!tipoDeEstudio || isUploading}
              />
            <label htmlFor="estudio-upload" className={`flex items-center justify-center w-full h-full px-4 py-2 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none ${!tipoDeEstudio || isUploading ? 'cursor-not-allowed bg-gray-200' : 'cursor-pointer hover:border-gray-400'}`}>
                <Upload className="w-6 h-6 text-gray-600 mr-2" />
                <span>Añadir archivos a la cola</span>
            </label>
          </div>
      </div>


      {/* --- TABLA DE CARGA --- */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Archivo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Estudio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Carga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subido por</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uploads.length > 0 ? (
              uploads.map((upload) => (
                <tr key={upload.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{upload.file.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.tipoDeEstudio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatBytes(upload.file.size)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.fecha.toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.profesional}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {upload.status === 'Pendiente' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Pendiente</span>}
                    {upload.status === 'Subiendo' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 flex items-center"><Loader2 className="animate-spin w-4 h-4 mr-1"/>Subiendo</span>}
                    {upload.status === 'Completado' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/>Completado</span>}
                    {upload.status === 'Error' && <span title={upload.error} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>Error</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href={upload.url} target="_blank" rel="noopener noreferrer" className={`text-blue-600 hover:text-blue-900 mr-3 ${upload.status !== 'Completado' && 'hidden'}`} title="Ver archivo"><Eye className="w-5 h-5"/></a>
                      <button onClick={() => handleDeleteEstudio(upload.id, upload.url)} className="text-red-600 hover:text-red-900" title="Eliminar"><Trash2 className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay archivos para este paciente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       <div className="mt-6">
        <button
          onClick={handleUpload}
          disabled={isUploading || uploads.filter(u => u.status === 'Pendiente').length === 0}
          className="w-full bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {isUploading ? <><Loader2 className="animate-spin h-5 w-5 mr-3"/> Procesando...</> : `Subir ${uploads.filter(u => u.status === 'Pendiente').length} Archivo(s)`}
        </button>
      </div>
    </div>
  );
};

export default EstudiosTab;