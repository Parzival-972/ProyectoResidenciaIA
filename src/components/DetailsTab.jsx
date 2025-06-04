import { motion } from "framer-motion";
import { InfoSection, InfoItem } from "@/components/InfoSection";
import { User, Mail, MapPin, Phone, Activity } from "lucide-react";

const DetailsTab = ({ patient, imc, categoria }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-sm"
    >
      <div className="space-y-8">
        <InfoSection title="Información Personal">
          <div className="col-span-full flex items-center gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {`${patient.name} ${patient.apellidoPaterno} ${patient.apellidoMaterno}`}
              </h2>
              <p className="text-gray-500">ID: {patient.curp}</p>
            </div>
          </div>
          <InfoItem
            label="Fecha de Nacimiento"
            value={new Date(patient.fechaDeNacimiento).toLocaleDateString()}
          />
          <InfoItem label="Género" value={patient.genero} />
          <InfoItem
            label="Lugar de Nacimiento"
            value={patient.lugarDeNacimiento}
          />
        </InfoSection>

        <InfoSection title="Información de Contacto">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <InfoItem label="Email" value={patient.email} />
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <InfoItem label="Teléfono" value={patient.phone} />
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <InfoItem
              label="Dirección"
              value={`${patient.calle}, ${patient.colonia}`}
            />
          </div>
          <InfoItem label="Ciudad" value={patient.ciudad} />
          <InfoItem label="Estado" value={patient.estado} />
          <InfoItem label="Código Postal" value={patient.codigoPostal} />
        </InfoSection>

        <InfoSection title="Información Médica">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <InfoItem label="Estatura" value={`${patient.estatura} cm`} />
          </div>
          <InfoItem label="Peso" value={`${patient.peso} kg`} />
          <InfoItem label="IMC" value={imc ? `${imc} (${categoria})` : "No disponible"} />
          <InfoItem label="Estado Civil" value={patient.estadoCivil} />
          <InfoItem label="Educación" value={patient.educacion} />
          <InfoItem label="Ocupación" value={patient.ocupacion} />
        </InfoSection>
      </div>
    </motion.div>
  );
};

export default DetailsTab;
