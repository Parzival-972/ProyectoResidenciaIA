"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { FormSection, FormInput, FormSelect } from '@/components/Form/FormsEditPatient';

const yesNoSelectFields = [
  "tabaco", "alcohol", "drogas", "actividad", "enfermedadCronica", 
  "alergias", "cirugias", "trastornos", "cancer", "hipertension", 
  "diabetes", "cancerF", "asma", "enfermedadN"
];
const YES_NO_OPTIONS = ["Si", "No"];
const GENDER_OPTIONS = ["Masculino", "Femenino"];
const ESTADO_CIVIL_OPTIONS = ["Soltero(a)", "Casado(a)", "Unión Libre", "Separado(a)", "Divorciado(a)", "Viudo(a)"];
const EDUCACION_OPTIONS = ["Ninguna", "Preescolar", "Primaria", "Secundaria", "Media Superior", "Carrera técnica", "Licenciatura", "Maestría", "Doctorado"];
const OCUPACION_OPTIONS = ["Estudiante", "Empleado(a) (Sector Público)", "Empleado(a) (Sector Privado)", "Trabajador(a) Independiente", "Labores de hogar", "Jubilado(a)", "Desempleado(a)", "Otro"];

const formSections = [
    { title: "Datos Personales", keys: ["name", "apellidoPaterno", "apellidoMaterno", "fechaDeNacimiento", "lugarDeNacimiento", "genero"] },
    { title: "Contacto", keys: ["phone", "email"] },
    { title: "Dirección", keys: ["calle", "colonia", "codigoPostal", "ciudad", "estado"] },
    { title: "Información Familiar", keys: ["nombreFamiliar", "phoneFamiliar", "emailFamiliar"] },
    { title: "Hábitos", keys: ["tabaco", "alcohol", "drogas", "actividad"] },
    { title: "Salud", keys: ["enfermedadCronica", "alergias", "cirugias", "trastornos", "cancer", "hipertension", "diabetes", "asma", "cancerF", "enfermedadN"] },
    { title: "Otros Datos", keys: ["curp", "estadoCivil", "educacion", "ocupacion"] },
];

const FormField = ({ field, onChange }) => {
  const commonProps = {
    label: field.label,
    name: field.name,
    value: field.value,
    onChange: onChange,
  };

  if (yesNoSelectFields.includes(field.name)) {
    const options = YES_NO_OPTIONS.map(option => ({
      value: option,
      label: option,
    }));
    return <FormSelect {...commonProps} options={options} />;
  }

  if (field.name === "genero") {
    const options = GENDER_OPTIONS.map(option => ({
      value: option,
      label: option,
    }));
    return <FormSelect {...commonProps} options={options} />;
  }

  if (field.name === "fechaDeNacimiento") {
    return <FormInput {...commonProps} type="date" />;
  }

  if (field.name === "estadoCivil") {
    const options = ESTADO_CIVIL_OPTIONS.map(option => ({
      value: option,
      label: option,
    }));
    return <FormSelect {...commonProps} options={options} />;
  }
  if (field.name === "educacion") {
    const options = EDUCACION_OPTIONS.map(option => ({
      value: option,
      label: option,
    }));
    return <FormSelect {...commonProps} options={options} />;
  }
  if (field.name === "ocupacion") {
    const options = OCUPACION_OPTIONS.map(option => ({
      value: option,
      label: option,
    }));
    return <FormSelect {...commonProps} options={options} />;
  }

  return <FormInput {...commonProps} type="text" />;
};

export default function EditPatientPage({ params }) {
  const { id } = params;
  const router = useRouter();
  
  const [fields, setFields] = useState([
    { label: "Nombre", name: "name", value: "" },
    { label: "Apellido Paterno", name: "apellidoPaterno", value: "" },
    { label: "Apellido Materno", name: "apellidoMaterno", value: "" },
    { label: "Fecha de Nacimiento", name: "fechaDeNacimiento", value: "" },
    { label: "Lugar de Nacimiento", name: "lugarDeNacimiento", value: "" },
    { label: "Sexo", name: "genero", value: "" },
    { label: "Teléfono", name: "telefono", value: "" },
    { label: "Correo electrónico", name: "email", value: "" },
    { label: "CURP", name: "curp", value: "" },
    { label: "Estado Civil", name: "estadoCivil", value: "" },
    { label: "Educación", name: "educacion", value: "" },
    { label: "Ocupación", name: "ocupacion", value: "" },
    { label: "Ciudad", name: "ciudad", value: "" },
    { label: "Estado", name: "estado", value: "" },
    { label: "Calle", name: "calle", value: "" },
    { label: "Colonia", name: "colonia", value: "" },
    { label: "Código Postal", name: "codigoPostal", value: "" },
    { label: "Nombre Familiar", name: "nombreFamiliar", value: "" },
    { label: "Teléfono Familiar", name: "telefonoFamiliar", value: "" },
    { label: "Correo Electrónico Familiar", name: "emailFamiliar", value: "" },
    { label: "Tabaco", name: "tabaco", value: "" },
    { label: "Alcohol", name: "alcohol", value: "" },
    { label: "Drogas", name: "drogas", value: "" },
    { label: "Actividad Física", name: "actividad", value: "" },
    { label: "Enfermedad Crónica", name: "enfermedadCronica", value: "" },
    { label: "Alergias", name: "alergias", value: "" },
    { label: "Cirugías", name: "cirugias", value: "" },
    { label: "Trastornos", name: "trastornos", value: "" },
    { label: "Cáncer", name: "cancer", value: "" },
    { label: "Hipertensión", name: "hipertension", value: "" },
    { label: "Diabetes", name: "diabetes", value: "" },
    { label: "Cáncer Familiar", name: "cancerF", value: "" },
    { label: "Asma", name: "asma", value: "" },
    { label: "Enfermedad Neurológica", name: "enfermedadN", value: "" },
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
            ...(field.name === "fechaDeNacimiento" && data[field.name]
              ? { value: new Date(data[field.name]).toISOString().split("T")[0] }
              : {}),
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

  const handleSave = async (e) => {
    e.preventDefault();
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
      if (!response.ok) throw new Error("Error al actualizar");
      alert("¡Se ha actualizado la información del paciente!");
      router.push(`/patients/${id}/view`);
    } catch (error) {
      console.error("Error al actualizar información del paciente:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Editar Información del Paciente</h1>
      <form className="space-y-8" onSubmit={handleSave}>
        {formSections.map((section) => (
          <FormSection key={section.title} title={section.title}>
            {fields
              .filter((f) => section.keys.includes(f.name))
              .map((field) => {
                const fieldIndex = fields.findIndex((f) => f.name === field.name);
                return (
                  <FormField
                    key={field.name}
                    field={field}
                    onChange={(e) => handleChange(fieldIndex, e.target.value)}
                  />
                );
              })}
          </FormSection>
        ))}
        
        <div className="flex justify-between mt-6">
          <button
            type="submit"
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