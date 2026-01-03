"use client";
import axios from "axios";
import { useState } from "react";
import imageCompression from "browser-image-compression";

const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.warn("Cloudinary CLOUD_NAME or UPLOAD_PRESET missing in .env");
  }

  const uploadFile = async (file) => {
    if (!file) return null;

    const options = {
      maxSizeMB: 2,          // Max size 1MB
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000, // 30 sec timeout
        }
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed:", err.response?.data || err.message);
      return null;
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    setImage("");
    const url = await uploadFile(file);
    if (url) setImage(url);
    setUploading(false);
    return url;
  };

  const uploadGalleryImages = async (files) => {
    if (!files || !files.length) return null;
    setUploading(true);
    const urls = [];
    for (let file of files) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    setGalleryImages((prev) => [...prev, ...urls]);
    setUploading(false);
    return urls;
  };

  return {
    uploadImage,
    image,
    setImage,
    galleryImages,
    uploadGalleryImages,
    uploading,
  };
};

export default useCloudinaryUpload;
