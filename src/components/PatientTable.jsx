import React, { useState, useEffect } from "react";
import ButtonGroup from "@/components/ButtonGroup";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import Loading from "./Loading";
const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const patientsPerPage = 5;
  const router = useRouter();

  // Fetch patient data from the correct API route
  const fetchPatients = async (page = 1, search = "") => {
    setLoading(true); // Set loading to true
    setError(null); // Reset error before making the request

    try {
      const response = await fetch(
        `/api/patients?page=${page}&limit=${patientsPerPage}&search=${search}`
      );
      if (!response.ok) {
        throw new Error("Error al conseguir pacientes");
      }
      const data = await response.json();
      setPatients(data.patients);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error al conseguir pacientes:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching is complete
    }
  };

  const createPatient = () => {
    router.push("/patients/create");
  };

  // Handle search input change
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1); // Reset to the first page on new search
    fetchPatients(1, searchTerm);
  };

  // Handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchPatients(pageNumber, searchTerm);
  };

  useEffect(() => {
    // Fetch data when the component mounts or when page or search changes
    fetchPatients(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl py-4 border-b mb-10">Pacientes</h1>

      <button
        onClick={createPatient}
        className="bg-blue-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
      >
        Nuevo Paciente
      </button>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Error Handling */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex items-center justify-center h-12 w-11/12">
          <Loading />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
          <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100"></th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs">
                  Nombre
                </th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs">
                  Apellido
                </th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs">
                  Correo
                </th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs">
                  Genero
                </th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs">
                  Numero de telefono
                </th>
                <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td className="border-dashed border-t border-gray-200 px-3"></td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-3">
                    <span className="text-gray-700">{patient.name}</span>
                  </td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-3">
                    <span className="text-gray-700">
                      {patient.apellidoPaterno}
                    </span>
                  </td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-3">
                    <span className="text-gray-700">{patient.email}</span>
                  </td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-3">
                    <span className="text-gray-700">{patient.genero}</span>
                  </td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-3">
                    <span className="text-gray-700">{patient.phone}</span>
                  </td>
                  <td className="border-dashed border-t border-gray-200 px-6 py-3">
                    <ButtonGroup patientId={patient._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center my-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 border ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600"
              } rounded`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientTable;