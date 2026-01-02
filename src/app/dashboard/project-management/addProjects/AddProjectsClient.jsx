"use client";

import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Rating } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";
import Image from "next/image";
import { FaImage } from "react-icons/fa";
import api from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import Spinner from "@/components/ui/Spinner";
import { initSocket } from "@/utils/socket";
import { useRouter } from "next/navigation";

export default function AddProjectsClient() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: { category: "" }
    });

    const {
        uploadImage,
        uploadGalleryImages,
        galleryImages,
        image,
        uploading
    } = useCloudinaryUpload()

    const onSubmit = async (data) => {
        try {
            const projectData = { ...data, image, galleryImages };
            const res = await api.post("/admin/projects", projectData);

            if (res?.data) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Project Added Successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });

                // Socket will automatically update table
                reset();
                router.push("/dashboard/project-management");
            }
        } catch (error) {
            console.error("❌ Failed to add project!", error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        await uploadImage(file)
    };

    const handleGalleryUpload = async (e) => {
        const files = e.target.files;
        if (!files.length) return;
        await uploadGalleryImages(files);
    }

    if (uploading) return <Spinner />

    return (
        <div className="min-h-screen px-1 py-3 md:p-5 lg:p-10">
            <Card>
                <CardContent className="bg-white rounded-xl shadow p-6">
                    <Typography variant="h5" className="font-bold text-primary text-center">
                        Add New Project
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6 pt-5">
                        <TextField
                            label="Project Title"
                            {...register("projectTitle", { required: "Project Title is required" })}
                            error={!!errors.projectTitle}
                            helperText={errors.projectTitle?.message}
                            fullWidth
                        />

                        <TextField
                            label="Category"
                            {...register("category", { required: "Category is required" })}
                            error={!!errors.category}
                            helperText={errors.category?.message}
                            fullWidth
                        />

                        <TextField
                            label="Location"
                            {...register("location", { required: "Location is required" })}
                            error={!!errors.location}
                            helperText={errors.location?.message}
                            fullWidth
                        />

                        <TextField
                            label="Area Size"
                            {...register("areaSize", { required: "Area Size is required" })}
                            error={!!errors.areaSize}
                            helperText={errors.areaSize?.message}
                            fullWidth
                        />

                        {/* Main Image */}
                        <div>
                            <span className="font-bold text-lg">Main Image</span>
                            <div className="relative">
                                <FaImage className="text-[#4da3d1] absolute left-1.5 top-2.5" size={22} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("image", { required: "Image is required" })}
                                    onChange={handleImageUpload}
                                    className="w-full px-4 py-2 border rounded-md bg-[#fcfcfc] text-[#a3bfc7] pl-10"
                                />
                                {image && <Image src={image} width={50} height={50} alt="Preview" className="rounded mt-2" />}
                            </div>
                        </div>

                        {/* Gallery Images */}
                        <div>
                            <span className="font-bold text-lg">Gallery Images</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryUpload}
                                className="w-full px-4 py-2 border rounded-md bg-[#fcfcfc] mt-2"
                            />
                            <div className="grid grid-cols-4 gap-3 mt-3">
                                {galleryImages.map((img, idx) => (
                                    <Image key={idx} src={img} width={80} height={80} alt="gallery" className="rounded border" />
                                ))}
                            </div>
                        </div>

                        <TextField
                            label="Short Description"
                            {...register("shortDescription", { required: "Short Description is required" })}
                            error={!!errors.shortDescription}
                            helperText={errors.shortDescription?.message}
                            fullWidth
                            multiline
                            rows={3}
                            className="md:col-span-2"
                        />

                        {/* Review */}
                        <TextField
                            label="Client Review"
                            {...register("clientReview", { required: "Design Style is required" })}
                            error={!!errors.clientReview}
                            helperText={errors.clientReview?.message}
                            fullWidth
                        />

                        {/* Client Rating */}
                        <Controller
                            name="clientRating"
                            control={control}
                            rules={{ required: "Rating is required" }}
                            render={({ field }) => (
                                <Rating {...field} value={field.value || 0} onChange={(_, val) => field.onChange(val)} />
                            )}
                        />

                        <div className="md:col-span-2 flex justify-center mt-4">
                            <Button type="submit" variant="contained" color="primary" disabled={uploading}>
                                {uploading ? "Adding..." : "Add New Project"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
