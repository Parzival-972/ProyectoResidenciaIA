import React, { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Trash2, Eye } from "lucide-react";
import { uploadImage } from "../../libs/s3";
import useDetection from "../hooks/useDetection";
import Loading from "../components/Loading";
import PopUpModelSelection from "../components/PopUpModelSelection";

const modelURLs = {
  model1: "https://teachablemachine.withgoogle.com/models/MjPyRRCJ9/",
  model2: "https://teachablemachine.withgoogle.com/models/ASVNnIYj4/",
};

const ArchivosTab = ({ userId }) => {
  if (!userId) {
    console.error("El ID de usuario es requerido pero no ha sido ingresado.");
    return null;
  }

  const { predict, loading: modelLoading, setModelURL } = useDetection();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [currentImageForModelSelection, setCurrentImageForModelSelection] =
    useState(null);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/patients/${userId}/images`);
        if (!response.ok) {
          throw new Error("Error al conseguir imágenes");
        }
        const images = await response.json();

        setUploadedFiles(
          images.map((image) => ({
            file: { name: image.imageUrl.split("/").pop() },
            preview: image.imageUrl,
            prediction: image.similarityPercentage,
            uploadStatus: "success",
            imageId: image._id,
          }))
        );
      } catch (error) {
        console.error("Error al conseguir imágenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [userId]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFile = {
        file: e.target.files[0],
        preview: URL.createObjectURL(e.target.files[0]),
      };

      setCurrentImageForModelSelection(newFile);
      setShowModelSelection(true);
    }
  };

  const handleModelSelection = async (modelId) => {
    if (!currentImageForModelSelection) return;

    try {
      const fileObj = currentImageForModelSelection;

      console.log("Modelo elegido:", modelId);
      setModelURL(modelURLs[modelId]);

      // Wait for the model to load before making predictions
      while (modelLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Make the prediction
      const predictions = await predict(fileObj.file);
      console.log("Prediccion recibidas:", predictions);

      let probability = 0;
      let className = "N/A";

      if (predictions.length > 0) {
        const { className: predictedClassName, probability: predictedProb } =
          predictions[0];
        probability = predictedProb;
        className = predictedClassName;
      }

      console.log("Subiendo imagen a S3...");
      const uploadedUrl = await uploadImage(fileObj.file);
      console.log("Imagen subida a S3:", uploadedUrl);

      // Store image data in the database after successful prediction and upload
      const diseaseName = "exampleDisease";
      await storeImageData({
        userID: userId,
        diseaseName,
        similarityPercentage: probability,
        imageUrl: uploadedUrl,
      });

      // Update the uploadedFiles state to add the newly uploaded file with prediction
      setUploadedFiles((prev) => [
        ...prev,
        {
          file: { name: fileObj.file.name },
          preview: uploadedUrl,
          prediction: probability,
          uploadStatus: "success",
          className: className,
        },
      ]);
    } catch (error) {
      console.error("Carga o predicción fallida:", error);
    } finally {
      setLoading(false);
      setShowModelSelection(false);
      setCurrentImageForModelSelection(null);
    }
  };

  const handleCancelModelSelection = () => {
    setShowModelSelection(false);
    setCurrentImageForModelSelection(null);
  };

  const storeImageData = async (data) => {
    try {
      const response = await fetch("/api/patients/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al guardar metadatos de la imagen");
      }

      console.log("Metadatos de la imagen almacenados correctamente");
    } catch (error) {
      console.error("Error al guardar metadatos de la imagen:", error);
    }
  };

  const handleDeleteImage = async (imageId, file) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${userId}/images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la imagen");
      }

      console.log("Imagen eliminada correctamente");
      setUploadedFiles((prev) => prev.filter((f) => f.file.name !== file.name));
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    } finally {
      setLoading(false);
    }
  };

  const showImagePopup = (preview, name) => {
    setSelectedImage({ preview, name });
  };
  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-11/12">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
        >
          <span className="flex items-center space-x-2">
            <Upload className="w-6 h-6 text-gray-600" />
            <span className="font-medium text-gray-600">
              Suelte archivos para adjuntar o explore
            </span>
          </span>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Imagenes Subidas</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Prevista</th>
                  <th className="py-2 px-4 text-left">Nombre del archivo</th>
                  <th className="py-2 px-4 text-left">Estado de carga</th>
                  <th className="py-2 px-4 text-left">Probabilidad</th>
                  <th className="py-2 px-4 text-left">Nombre de la clase</th>
                  <th className="py-2 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">
                      <button
                        onClick={() =>
                          showImagePopup(file.preview, file.file.name)
                        }
                      >
                        <img
                          src={file.preview}
                          alt="Preview"
                          className="h-16 w-16 object-cover rounded cursor-pointer"
                        />
                      </button>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {file.file.name.slice(0, 10)} ...
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`text-sm font-medium ${
                          file.uploadStatus === "success"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {file.uploadStatus === "success"
                          ? "Upload Successful"
                          : "Upload Failed"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm text-gray-600">
                        {file.prediction !== null
                          ? `${(file.prediction * 100).toFixed(2)}%`
                          : "Not calculated"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm text-gray-600">
                        {file.className || "N/A"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            showImagePopup(file.preview, file.file.name)
                          }
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteImage(file.imageId, file.file)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Image Popup for Preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeImagePopup}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.preview}
              alt="Full size preview"
              className="max-w-full h-auto"
            />
            <button
              onClick={closeImagePopup}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Cerrar
            </button>
            <span className="m-7">{selectedImage.name}</span>
          </div>
        </div>
      )}

      {/* Model Selection Popup */}
      {showModelSelection && currentImageForModelSelection && (
        <PopUpModelSelection
          onClose={handleCancelModelSelection}
          onSelectModel={handleModelSelection}
          imagePreview={currentImageForModelSelection.preview}
        />
      )}
    </div>
  );
};

export default ArchivosTab;