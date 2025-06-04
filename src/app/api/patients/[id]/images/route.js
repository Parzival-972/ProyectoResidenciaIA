// src/app/api/patients/[userId]/images/route.js
import diagnosisAP from "../../../../../models/diagnosisAP"; // Adjust the import path to match your project structure
import connection from "../../../../../../libs/connection"; // Import your database connection utility

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    console.error("No userId provided");
    return new Response(JSON.stringify({ message: "User ID is missing" }), {
      status: 400,
    });
  }

  try {
    await connection(); // Ensure the database is connected

    // Find all images associated with the given userId
    const images = await diagnosisAP.find({ userID: id });

    // Return 404 if no images found
    if (images.length === 0) {
      return new Response(
        JSON.stringify({ message: "No images found for this user" }),
        { status: 200 }
      );
    }

    // Transform the image URLs
    const transformedImages = images.map((image) => ({
      ...image._doc,
      imageUrl: image.imageUrl.startsWith("http")
        ? image.imageUrl
        : `${process.env.BASE_URL}/${image.imageUrl}`,
    }));

    return new Response(JSON.stringify(transformedImages), { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching images", error }),
      { status: 500 }
    );
  }
}
export async function DELETE(req, { params }) {
  const { id } = params;
  const { imageId } = await req.json();

  if (!id || !imageId) {
    console.error("Missing userId or imageId");
    return new Response(
      JSON.stringify({ message: "User ID or Image ID is missing" }),
      {
        status: 400,
      }
    );
  }

  try {
    await connection(); // Ensure the database is connected

    // Delete the image with the given imageId
    const deletedImage = await diagnosisAP.findOneAndDelete({
      userID: id,
      _id: imageId,
    });

    if (!deletedImage) {
      return new Response(JSON.stringify({ message: "Imagen no encontrada" }), {
        status: 404,
      });
    }

    console.log("Deleted Image:", deletedImage);
    return new Response(
      JSON.stringify({ message: "Imagen eliminada correctamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return new Response(
      JSON.stringify({ message: "Error al eliminar imagen", error }),
      { status: 500 }
    );
  }
}