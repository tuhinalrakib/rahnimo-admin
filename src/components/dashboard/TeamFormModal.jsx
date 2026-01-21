"use client";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";
import { addMember, updateMember } from "@/services/teamService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import Spinner from "../ui/Spinner";
import { useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { initSocket } from "@/utils/socket";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

export default function TeamFormModal({ open, setOpen, editData, setEditData }) {
    const queryClient = useQueryClient();
    // const [socketReady, setSocketReady] = useState(false);
    const { uploadImage, image, uploading } = useCloudinaryUpload();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (!open) return;

        if (editData) {
            reset({
                name: editData.name,
                designation: editData.designation,
                description: editData.description,
                image: ""
            });
        } else {
            reset({
                name: "",
                designation: "",
                description: "",
                image: ""
            });
        }
    }, [open, editData, reset]);


    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        await uploadImage(file);
    };

    const { mutate } = useMutation({
        mutationFn: async (payload) => {
            return editData
                ? updateMember(editData._id, payload)
                : addMember(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["team"]);
            setEditData(null);
            reset();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Member Create/update successful!!",
                showConfirmButton: false,
                timer: 1500,
            });
            setOpen(false);
        }
    });

    const onSubmit = (data) => {
        if (!editData && !image) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Image not upload yet!",
            })
            return;
        }

        const payload = {
            name: data.name,
            designation: data.designation,
            description: data.description,
            image: image || editData?.image
        };
        mutate(payload);
    };

    if (!open) return null;
    if (uploading) return <Spinner />;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                    {editData ? "Edit Team Member" : "Add Team Member"}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Team Member Name"
                        {...register("name", { required: "Name is required" })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Designation"
                        {...register("designation", { required: "Designation is required" })}
                        error={!!errors.designation}
                        helperText={errors.designation?.message}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        label="Short Description"
                        {...register("description", { required: "Description is required" })}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />

                    <div className="relative mb-4">
                        <FaImage className="text-[#4da3d1] absolute left-2 top-3" size={20} />
                        <input
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            onChange={handleImageUpload}
                            className="w-full pl-10 px-3 py-2 border rounded-md "
                        />
                        {(image || editData?.image) && (
                            <Image
                                src={image || editData.image}
                                width={80}
                                height={80}
                                alt="Preview"
                                loading="lazy"
                                className="w-20 h-20 rounded-full mt-2 object-cover border"
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(false);
                                setEditData(null);
                                reset({
                                    name: "",
                                    designation: "",
                                    description: "",
                                    image: ""
                                });
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ backgroundColor: "#4e38f5" }}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
