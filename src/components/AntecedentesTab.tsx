import { motion } from "framer-motion";
import {
  Cigarette,
  Wine,
  Pill,
  Activity,
  Heart,
  AlertCircle,
  Scissors,
  Brain,
  HeartPulse,
  Users,
  Bandage,
  Brain as BrainIcon,
  CandyOff,
  Wind,
} from "lucide-react";
import HealthCard from "./HealthCard";
import HealthSection from "./HealthSection";

interface Patient {
  tabaco: string;
  alcohol: string;
  drogas: string;
  actividad: string;
  enfermedadCronica: string;
  alergias: string;
  cirugias: string;
  trastornos: string;
  cancer: string;
  hipertension: string;
  diabetes: string;
  cancerF: string;
  asma: string;
  enfermedadN: string;
}

interface AntecedentesTabProps {
  patient: Patient;
}

const AntecedentesTab = ({ patient }: AntecedentesTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-sm space-y-8"
    >
      <HealthSection title="Hábitos y Estilo de Vida" delay={0.1}>
        <HealthCard
          icon={<Cigarette className="w-5 h-5" />}
          title="Tabaco"
          value={patient.tabaco}
          delay={0.1}
        />
        <HealthCard
          icon={<Wine className="w-5 h-5" />}
          title="Alcohol"
          value={patient.alcohol}
          delay={0.2}
        />
        <HealthCard
          icon={<Pill className="w-5 h-5" />}
          title="Drogas"
          value={patient.drogas}
          delay={0.3}
        />
        <HealthCard
          icon={<Activity className="w-5 h-5" />}
          title="Actividad Física"
          value={patient.actividad}
          delay={0.4}
        />
      </HealthSection>

      <HealthSection title="Condiciones Actuales" delay={0.3}>
        <HealthCard
          icon={<Heart className="w-5 h-5" />}
          title="Enfermedad Crónica"
          value={patient.enfermedadCronica}
          delay={0.5}
        />
        <HealthCard
          icon={<AlertCircle className="w-5 h-5" />}
          title="Alergias"
          value={patient.alergias}
          delay={0.6}
        />
        <HealthCard
          icon={<Scissors className="w-5 h-5" />}
          title="Cirugías"
          value={patient.cirugias}
          delay={0.7}
        />
        <HealthCard
          icon={<Brain className="w-5 h-5" />}
          title="Trastornos"
          value={patient.trastornos}
          delay={0.8}
        />
      </HealthSection>

      <HealthSection title="Historial Médico" delay={0.5}>
        <HealthCard
          icon={<Bandage className="w-5 h-5" />}
          title="Cáncer"
          value={patient.cancer}
          delay={0.9}
        />
        <HealthCard
          icon={<HeartPulse className="w-5 h-5" />}
          title="Hipertensión"
          value={patient.hipertension}
          delay={1.0}
        />
        <HealthCard
          icon={<CandyOff className="w-5 h-5" />}
          title="Diabetes"
          value={patient.diabetes}
          delay={1.1}
        />
        <HealthCard
          icon={<Users className="w-5 h-5" />}
          title="Cáncer Familiar"
          value={patient.cancerF}
          delay={1.2}
        />
        <HealthCard
          icon={<Wind className="w-5 h-5" />}
          title="Asma"
          value={patient.asma}
          delay={1.3}
        />
        <HealthCard
          icon={<BrainIcon className="w-5 h-5" />}
          title="Enfermedad Neurológica"
          value={patient.enfermedadN}
          delay={1.4}
        />
      </HealthSection>
    </motion.div>
  );
};

export default AntecedentesTab;
