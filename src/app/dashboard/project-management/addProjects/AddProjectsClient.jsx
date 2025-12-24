"use client";

import { useState } from "react";
import { TextField, MenuItem, Button, Rating, Card, CardContent, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";
import Image from "next/image";
import { FaImage } from "react-icons/fa";

const categories = [
    "Residential",
    "Commercial",
    "Office",
    "Restaurant"
]

export default function AddProjectsClient() {
    //   const [form, setForm] = useState({
    //     projectTitle: "",
    //     category: "",
    //     location: "",
    //     areaSize: "",
    //     budgetRange: "",
    //     completionTime: "",
    //     designStyle: "",
    //     shortDescription: "",
    //     clientReview: "",
    //     clientRating: 0,
    //     featured: false,
    //   });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: { category: "" } 
    });

    const { uploadImage, imageURL, uploading } = useCloudinaryUpload()

    //   const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    //   };

    const onSubmit = async (data) => {
        console.log(data);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        await uploadImage(file)
    };

    return (
        <div className="min-h-screen px-1 py-3 md:p-5 lg:p-10">
            <Card className="max-w-4xl mx-auto">
                <CardContent className="bg-white backdrop-blur-lg rounded-xl shadow p-6">
                    <Typography
                        variant="h5"
                        className="font-bold text-primary text-center"
                    >
                        Add New Interior Project
                    </Typography>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="grid md:grid-cols-2 gap-6 pt-5"
                    >
                        {/* Title */}
                        <TextField
                            className="w-full px-4 bg-[#fcfcfc] pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
                            label="Project Title"
                            {...register("projectTitle", { required: "Project Title is required" })}
                            error={!!errors.projectTitle}
                            helperText={errors.projectTitle?.message}
                            fullWidth
                        />
                        {/* categories */}
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Category"
                                    className="w-full px-4 bg-[#fcfcfc] pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
                                    fullWidth
                                    error={!!errors.category}
                                    helperText={errors.category?.message}
                                >
                                    {categories.map((cat, i) => (
                                        <MenuItem key={i} value={cat}>{cat}</MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        {/* Location */}
                        <TextField
                            className="w-full px-4 bg-[#fcfcfc] pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
                            label="Location"
                            {...register("location", { required: "Location is required" })}
                            error={!!errors.location}
                            helperText={errors.location?.message}
                            fullWidth
                        />

                        {/* Area Size */}
                        <TextField
                            className="w-full px-4 bg-[#fcfcfc] pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
                            label="Area Size (sqft)"
                            {...register("areaSize", { required: "Area Size is required" })}
                            error={!!errors.areaSize}
                            helperText={errors.areaSize?.message}
                            fullWidth
                        />
                        {/* Budgets Range */}
                        <TextField
                            className="w-full px-4 bg-[#fcfcfc] pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
                            label="Budget Range"
                            {...register("budgetRange", { required: "Budget Range is required" })}
                            error={!!errors.budgetRange}
                            helperText={errors.budgetRange?.message}
                            fullWidth
                        />

                        {/* Completion Time */}
                        <TextField
                            className="w-full px-4 bg-[#fcfcfc] pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
                            label="Completion Time"
                            {...register("completionTime", { required: "Completion Time is required" })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                        />

                        {/* ✅ Image Upload Field */}
                        <div className="relative">
                            <FaImage
                                className="text-[#4da3d1] absolute left-1.5 top-2.5"
                                size={22}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                {...register("image", { required: "Image is required" })}
                                onChange={handleImageUpload}
                                className="w-full px-4 py-2 border rounded-md bg-[#fcfcfc] text-[#a3bfc7] pl-10"
                            />
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                            )}
                            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                            {imageURL && (
                                <Image
                                    src={imageURL}
                                    width={20}
                                    height={20}
                                    alt="Preview"
                                    loading="lazy"
                                    className="w-20 h-20 rounded-full mt-2 object-cover border"
                                />
                            )}
                        </div>
                        <input
                            type="hidden"
                            {...register("image", { required: "Image is required" })}
                        />

                        <TextField
                            className="w-full px-4 bg-[#fcfcfc] pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
                            label="Design Style"
                            name=""
                            {...register("designStyle", { required: "Design Style is required" })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                        />

                        {/* Description */}
                        <TextField
                            label="Short Description"
                            name="shortDescription"
                            {...register("shortDescription", { required: "Short Description is required" })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                            multiline
                            rows={3}
                            className="md:col-span-2"
                        />

                        {/* Review */}
                        {/* <TextField
                            label="Client Review"
                            name="clientReview"
                            value={form.clientReview}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            className="md:col-span-2"
                        /> */}

                        {/* Submit Button */}
                        <div className="md:col-span-2 flex justify-center mt-4">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={uploading}
                                className="bg-primary px-6 py-2 rounded-lg"
                            >
                                {uploading ? "Add Project..." : "Add New Project"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
/**
 * <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 "
    >

      

      <div className="md:col-span-2">
        <p className="mb-1 text-sm">Client Rating</p>
        <Rating
          value={form.clientRating}
          onChange={(e, val) =>
            setForm({ ...form, clientRating: val })
          }
        />
      </div>

      <div className="md:col-span-2 flex items-center gap-3">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
        />
        <span>Mark as Featured Project</span>
      </div>

      <div className="md:col-span-2">
        <Button
          variant="contained"
          type="submit"
          className="bg-primary w-full py-3"
        >
          Save Project
        </Button>
      </div>
    </form>
 */