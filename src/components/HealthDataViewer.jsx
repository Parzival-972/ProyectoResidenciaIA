"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/useToast";

export default function HealthDataViewer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/health-data");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const deleteEntry = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Health Data");
    XLSX.writeFile(workbook, "health_data.xlsx");
    toast({
      title: "Download Completed",
      description: "Excel file downloaded",
      type: "success",
    });
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Vista de datos de salud</h1>
      <button
        onClick={downloadExcel}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Descargar Excel
      </button>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-3">
                  {header}
                </th>
              ))}
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4">
                    {typeof item[header] === "boolean"
                      ? item[header]
                        ? "Yes"
                        : "No"
                      : item[header]}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteEntry(index)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}