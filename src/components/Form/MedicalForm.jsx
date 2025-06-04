import React, { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";
import FormSection from "./FormSection";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormCheckbox from "./FormCheckbox";

const initialFormData = {
  nombre: "",
  edad: 0,
  clasificacionEdad: "Infancia",
  peso: 0,
  altura: 0,
  imc: 0,
  clasificacionIMC: "Normal",
  hipertensionArterial: false,
  presionSistolica: 0,
  presionDiastolica: 0,
  consumoAlcohol: false,
  unidadesSemana: 0,
  fumador: false,
  cigarrillosSemana: 0,
  edadInicioFumar: 0,
  minutosActividad: 0,
  actividadClasificacion: "Sin actividad",
  anosEstudio: 0,
  clasificacionEstudio: "primaria",
  diabetesValue: 0,
  diabetesClasificacion: "Ninguno",
  calidadAireValue: 0,
  calidadAireClasificacion: "Bajo",
  discapacidadAuditiva: false,
  porcentajeDiscapacidad: 0,
  traumatismo: false,
  porcentajeTraumatismo: 0,
  antecedentesFamiliares: false,
  aislamientoSocial: false,
};

export default function MedicalForm({ userId }) {
  const [formData, setFormData] = useState(initialFormData);
  const [resultadoDemencia, setResultadoDemencia] = useState("");

  useEffect(() => {
    const alturaMetros = formData.altura / 100;
    const imc = formData.peso / (alturaMetros * alturaMetros);
    let clasificacionIMC = "Normal";
    if (imc < 18.5) clasificacionIMC = "Bajo peso";
    else if (imc >= 25 && imc < 30) clasificacionIMC = "Sobrepeso";
    else if (imc >= 30) clasificacionIMC = "Obesidad";

    let clasificacionEdad = "Infancia";
    if (formData.edad >= 0 && formData.edad <= 5)
      clasificacionEdad = "Primera infancia";
    else if (formData.edad <= 11) clasificacionEdad = "Infancia";
    else if (formData.edad <= 18) clasificacionEdad = "Adolescencia";
    else if (formData.edad <= 26) clasificacionEdad = "Juventud";
    else if (formData.edad <= 59) clasificacionEdad = "Adultez";
    else clasificacionEdad = "Vejez";

    setFormData((prev) => ({
      ...prev,
      imc: Math.round(imc * 10) / 10,
      clasificacionIMC,
      clasificacionEdad,
    }));
  }, [formData.peso, formData.altura, formData.edad]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? e.target.checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/patients/${userId}/medical-study`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Datos enviados correctamente!");
      setFormData(initialFormData);
    } else {
      alert("Envío fallido.");
    }
  };

  const predecirDemencia = () => {
    let score = 0;

    if (formData.edad > 65) score += 2;
    if (formData.antecedentesFamiliares) score += 2;
    if (formData.hipertensionArterial) score += 1;
    if (formData.diabetesValue > 0) score += 1;
    if (formData.fumador) score += 1;
    if (formData.consumoAlcohol) score += 1;
    if (formData.minutosActividad < 60) score += 1;
    if (formData.anosEstudio < 6) score += 1;
    if (formData.aislamientoSocial) score += 1;

    if (score <= 2) setResultadoDemencia("Bajo riesgo");
    else if (score <= 5) setResultadoDemencia("Riesgo moderado");
    else setResultadoDemencia("Alto riesgo");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 mb-4">
            <ClipboardList className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Formulario Médico
          </h2>
          <p className="text-gray-600">Complete la información del paciente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FormSection title="Información Personal">
            <FormInput label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
            <FormInput label="Edad" name="edad" type="number" value={formData.edad} onChange={handleChange} />
            <p>Clasificación por Edad: {formData.clasificacionEdad}</p>
          </FormSection>

          <FormSection title="Medidas Corporales">
            <FormInput label="Peso" name="peso" type="number" value={formData.peso} onChange={handleChange} />
            <FormInput label="Altura" name="altura" type="number" value={formData.altura} onChange={handleChange} />
            <FormInput label="IMC" name="imc" type="number" value={formData.imc} readOnly />
            <p>Clasificación IMC: {formData.clasificacionIMC}</p>
          </FormSection>

          <FormSection title="Presión Arterial">
            <FormCheckbox label="Hipertensión Arterial" name="hipertensionArterial" checked={formData.hipertensionArterial} onChange={handleChange} />
            <FormInput label="Presión Sistólica" name="presionSistolica" type="number" value={formData.presionSistolica} onChange={handleChange} />
            <FormInput label="Presión Diastólica" name="presionDiastolica" type="number" value={formData.presionDiastolica} onChange={handleChange} />
          </FormSection>

          <FormSection title="Hábitos y Salud Mental">
            <FormCheckbox label="Fuma cigarrillos" name="fumador" checked={formData.fumador} onChange={handleChange} />
            <FormCheckbox label="Consumo de alcohol" name="consumoAlcohol" checked={formData.consumoAlcohol} onChange={handleChange} />
            <FormInput label="Minutos de actividad física semanal" name="minutosActividad" type="number" value={formData.minutosActividad} onChange={handleChange} />
            <FormCheckbox label="Aislamiento social o depresión" name="aislamientoSocial" checked={formData.aislamientoSocial} onChange={handleChange} />
          </FormSection>

          <FormSection title="Educación y Antecedentes">
            <FormInput label="Años de estudio" name="anosEstudio" type="number" value={formData.anosEstudio} onChange={handleChange} />
            <FormCheckbox label="Antecedentes familiares de demencia" name="antecedentesFamiliares" checked={formData.antecedentesFamiliares} onChange={handleChange} />
          </FormSection>

          <FormSection title="Diabetes">
            <FormSelect
              label="Tipo de Diabetes"
              name="diabetesValue"
              value={formData.diabetesValue.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  diabetesValue: Number(e.target.value),
                  diabetesClasificacion: e.target.options[e.target.selectedIndex].text,
                }))
              }
              options={[
                { value: "0", label: "Ninguno" },
                { value: "1", label: "Tipo 1" },
                { value: "2", label: "Tipo 2" },
                { value: "3", label: "Tipo 2 controlado" },
              ]}
            />
          </FormSection>

          <FormSection title="Calidad del Aire">
            <FormInput label="Valor Medio ICA" name="calidadAireValue" type="number" value={formData.calidadAireValue} onChange={handleChange} />
            <p>Clasificación del Aire: {formData.calidadAireClasificacion}</p>
          </FormSection>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={predecirDemencia}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Predecir Demencia
            </button>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Guardar Información
            </button>
          </div>

          {resultadoDemencia && (
            <div className="mt-4 p-4 rounded-xl bg-gray-100 text-gray-800 shadow">
              <strong>Resultado:</strong> {resultadoDemencia}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
