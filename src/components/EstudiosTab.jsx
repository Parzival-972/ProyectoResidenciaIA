"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";

const EstudiosTab = ({ userId }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      // Aquí puedes manejar los archivos seleccionados
      console.log(e.target.files);
      // Por ejemplo, podrías añadirlos a un estado para mostrarlos en una lista
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para subir los archivos al servidor
    alert("Subiendo estudios...");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Subir Estudios Médicos
        </h2>
      </div>
      <p className="text-gray-600 mb-4">
        Sube aquí los archivos de tomografías, resonancias magnéticas u otros estudios de imagen.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="estudio-upload"
            className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
          >
            <span className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-gray-600" />
              <span className="font-medium text-gray-600">
                Arrastra los archivos o haz clic para seleccionar
              </span>
            </span>
            <input
              id="estudio-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.dcm" // Acepta imágenes y archivos DICOM
              multiple
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Subir Archivos
        </button>
      </form>
    </div>
  );
};

export default EstudiosTab;