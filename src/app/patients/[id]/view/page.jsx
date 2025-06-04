"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import DetailsTab from "@/components/DetailsTab";
import AntecedentesTab from "@/components/AntecedentesTab";
import ArchivosTab from "@/components/ArchivosTab";
import Loading from "../../../../components/Loading";
import MedicoTab from "@/components/MedicoTab";
import TabButton from "@/components/TabButton";
import TabContent from "@/components/TabContent";

const ViewPatientPage = ({ params }) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("details");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "details", label: "Detalles de paciente" },
    { id: "antecedentes", label: "Antecedentes" },
    { id: "archivos", label: "Archivos" },
    { id: "medico", label: "Estudio Medico" },
  ];

  const calculateIMC = (peso, estatura) => {
    const pesoNum = parseFloat(peso);
    const estaturaNum = parseFloat(estatura);
  
    if (!isNaN(pesoNum) && !isNaN(estaturaNum) && estaturaNum > 0) {
      const estaturaEnMetros = estaturaNum / 100;
      const imc = pesoNum / (estaturaEnMetros * estaturaEnMetros);
  
      let categoria = "";
      if (imc < 18.5) {
        categoria = "Bajo";
      } else if (imc >= 18.5 && imc < 24.9) {
        categoria = "Normal";
      } else if (imc >= 25 && imc < 29.9) {
        categoria = "Medio";
      } else {
        categoria = "Alto";
      }
  
      return { imc: imc.toFixed(2), categoria };
    }
  
    return { imc: "N/A", categoria: "Desconocido" };
  };
  

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${id}`);
        if (!response.ok) {
          throw new Error("Error al conseguir datos del paciente");
        }
        const data = await response.json();
        setPatient(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen w-11/12"
      >
        <Loading />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-center p-4"
      >
        Error: {error}
      </motion.div>
    );
  }

  if (!patient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-500 text-center p-4"
      >
        Paciente no encontrado
      </motion.div>
    );
  }

  const { imc, categoria } = calculateIMC(patient.peso, patient.estatura);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-6 px-4 max-w-7xl"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 py-4 border-b mb-10"
      >
        Detalles del Paciente
      </motion.h1>

      <motion.ul
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-flow-col text-center bg-gray-50 rounded-xl p-2 gap-2"
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </motion.ul>

      <AnimatePresence mode="wait">
        <TabContent>
          {activeTab === "details" && (
            <DetailsTab patient={patient} imc={imc} categoria={categoria} />
          )}
          {activeTab === "antecedentes" && (
            <AntecedentesTab patient={patient} />
          )}
          {activeTab === "archivos" && <ArchivosTab userId={id} />}
          {activeTab === "medico" && <MedicoTab userId={id} />}
        </TabContent>
      </AnimatePresence>
    </motion.div>
  );
};

export default ViewPatientPage;
