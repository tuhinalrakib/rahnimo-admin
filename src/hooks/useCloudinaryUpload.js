"use client";
import axios from "axios";
import { useState } from "react";

const useCloudinaryUpload = () => {
    const [uploading, setUploading] = useState(false)
    const [image, setImage] = useState("")

    const uploadImage = async (file) => {
        if (!file) return null
        setUploading(true)
        setImage("")
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
            )

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            const url = res.data.secure_url;
            setImage(url)
        } catch (error) {
            console.error("Cloudinary upload failed:", error);
            return null;
        }finally{
            setUploading(false)
        }
    }

    return { uploadImage, uploading, image, setImage}
}

export default useCloudinaryUpload