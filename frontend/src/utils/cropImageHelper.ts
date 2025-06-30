import type { Area } from "react-easy-crop";

export default function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject(new Error("Canvas context not found"));

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        resolve(blobUrl);
      }, "image/jpeg");
    };

    image.onerror = () => reject(new Error("Image load error"));
  });
}
