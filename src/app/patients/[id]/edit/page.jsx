"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

export default function EditPatientPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [fields, setFields] = useState([
    { label: "Nombre", name: "name", value: "" },
    { label: "Apellido Paterno", name: "apellidoPaterno", value: "" },
    { label: "Apellido Materno", name: "apellidoMaterno", value: "" },
    { label: "Fecha de Nacimiento", name: "fechaDeNacimiento", value: "" },
    { label: "Lugar de Nacimiento", name: "lugarDeNacimiento", value: "" },
    { label: "Genero", name: "genero", value: "" },
    { label: "Phone", name: "phone", value: "" },
    { label: "Email", name: "email", value: "" },
    { label: "CURP", name: "curp", value: "" },
    { label: "Estado Civil", name: "estadoCivil", value: "" },
    { label: "Educacion", name: "educacion", value: "" },
    { label: "Ocupacion", name: "ocupacion", value: "" },
    { label: "Ciudad", name: "ciudad", value: "" },
    { label: "Estado", name: "estado", value: "" },
    { label: "Calle", name: "calle", value: "" },
    { label: "Colonia", name: "colonia", value: "" },
    { label: "Codigo Postal", name: "codigoPostal", value: "" },
    { label: "Nombre Familiar", name: "nombreFamiliar", value: "" },
    { label: "Phone Familiar", name: "phoneFamiliar", value: "" },
    { label: "Email Familiar", name: "emailFamiliar", value: "" },
    { label: "Tabaco", name: "tabaco", value: "" },
    { label: "Alcohol", name: "alcohol", value: "" },
    { label: "Drogas", name: "drogas", value: "" },
    { label: "Actividad", name: "actividad", value: "" },
    { label: "Enfermedad Cronica", name: "enfermedadCronica", value: "" },
    { label: "Alergias", name: "alergias", value: "" },
    { label: "Cirugias", name: "cirugias", value: "" },
    { label: "Trastornos", name: "trastornos", value: "" },
    { label: "Cancer", name: "cancer", value: "" },
    { label: "Hipertension", name: "hipertension", value: "" },
    { label: "Diabetes", name: "diabetes", value: "" },
    { label: "Cancer Familiar", name: "cancerF", value: "" },
    { label: "Asma", name: "asma", value: "" },
    { label: "Enfermedad Neurologica", name: "enfermedadN", value: "" },
  ]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${id}`);
        const data = await response.json();
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            value: data[field.name] || "",
          }))
        );
      } catch (error) {
        console.error("Error al conseguir información del paciente:", error);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (index, newValue) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, value: newValue } : field
      )
    );
  };

  const handleSave = async () => {
    const updatedData = fields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error();

      alert("¡Se ha actualizado la información del paciente!");
      router.push(`/patients/${id}/view`);
    } catch (error) {
      console.error("Error al actualizar información del paciente:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Editar Información del Paciente</h1>
      <form className="space-y-8">
        {[
          { title: "Datos Personales", keys: ["name", "apellidoPaterno", "apellidoMaterno", "fechaDeNacimiento", "lugarDeNacimiento", "genero"] },
          { title: "Contacto", keys: ["phone", "email"] },
          { title: "Dirección", keys: ["calle", "colonia", "codigoPostal", "ciudad", "estado"] },
          { title: "Información Familiar", keys: ["nombreFamiliar", "phoneFamiliar", "emailFamiliar"] },
          { title: "Hábitos", keys: ["tabaco", "alcohol", "drogas", "actividad"] },
          { title: "Salud", keys: ["enfermedadCronica", "alergias", "cirugias", "trastornos", "cancer", "hipertension", "diabetes", "asma", "cancerF", "enfermedadN"] },
          { title: "Otros Datos", keys: ["curp", "estadoCivil", "educacion", "ocupacion"] },
        ].map((section, sIndex) => (
          <section key={sIndex} className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields
                .filter((f) => section.keys.includes(f.name))
                .map((field, index) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.name === "fechaDeNacimiento" ? "date" : "text"}
                      value={field.value}
                      onChange={(e) => handleChange(fields.findIndex(f => f.name === field.name), e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                ))}
            </div>
          </section>
        ))}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
          >
            <Save size={18} className="mr-2" /> Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => router.push(`/patients/`)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
