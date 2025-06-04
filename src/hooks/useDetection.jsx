import { useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";

const useDetection = (initialModelURL) => {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [modelURL, setModelURL] = useState(initialModelURL);

  useEffect(() => {
    const loadModel = async () => {
      if (!modelURL) return;
      setLoading(true);
      try {
        const modelURLWithFile = modelURL + "model.json";
        const metadataURL = modelURL + "metadata.json";
        const loadedModel = await tmImage.load(modelURLWithFile, metadataURL);
        setModel(loadedModel);
      } catch (error) {
        console.error("Failed to load the model:", error);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, [modelURL]);

  const predict = async (file) => {
    if (!model) {
      throw new Error("Model is not loaded yet.");
    }

    if (!(file instanceof File)) {
      throw new TypeError("Expected a File object for prediction.");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = async () => {
          try {
            const predictions = await model.predict(img);
            resolve(predictions);
          } catch (error) {
            reject(error);
          }
        };
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  return { predict, loading, setModelURL };
};

export default useDetection;
