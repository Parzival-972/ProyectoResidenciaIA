import React from "react";
import { X, Brain } from "lucide-react";

const models = [
  {
    id: "model1",
    name: "Modelo De Analisis de Alzheimer",
    description:
      "Analiza imagenes por medio de IA para determinar la probabilidad de padecer Alzheimer",
  },
  {
    id: "model2",
    name: "Modelo De Analisis De Parkinson",
    description:
      "Analiza imagenes por medio de IA para determinar la probabilidad de padecer Parkinson",
  },
];

export default function PopUpModelSelection({
  onClose,
  onSelectModel,
  imagePreview,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Selecciona el modelo{" "}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={imagePreview}
              alt="Vista previa"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-600 mb-4">
              Selecciona un modelo para comenzar. La imagen será eliminada si no
              se selecciona un modelo
            </p>
          </div>

          <div className="space-y-3">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => onSelectModel(model.id)}
                className="w-full p-4 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium">{model.name}</div>
                <div className="text-sm text-gray-600">{model.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}