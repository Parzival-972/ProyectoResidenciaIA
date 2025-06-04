// src/app/patients/[id]/view/components/ServerTab.tsx
import MedicalForm from "../components/Form/MedicalForm";

const MedicoTab = ({ userId }) => {
  return (
    <div>
      <MedicalForm userId={userId} />
    </div>
  );
};

export default MedicoTab;
