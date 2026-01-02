"use client";

import { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import api from "@/utils/axiosInstance";
import Swal from "sweetalert2";

const UpdateProjectModal = ({ open, closeModal, product }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (product) reset(product);
    }, [product, reset]);

    const onSubmit = async (data) => {
        try {
            await api.patch(`/admin/projects/${product._id}`, data);

            Swal.fire({
                icon: "success",
                title: "Updated!",
                timer: 1200,
                showConfirmButton: false,
            });

            closeModal(); // socket will update UI
        } catch (err) {
            console.error(err.response?.data || err.message);
            Swal.fire("Error", "Project update failed", "error");
        }
    };


    if (!product) return null;

    return (
        <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm">
            <DialogTitle>Update Project</DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="space-y-4">
                    <TextField
                        label="Project Title"
                        fullWidth
                        {...register("projectTitle", { required: true })}
                        error={!!errors.projectTitle}
                    />

                    <TextField
                        label="Category"
                        fullWidth
                        {...register("category", { required: true })}
                    />

                    <TextField
                        label="Location"
                        fullWidth
                        {...register("location", { required: true })}
                    />

                    <TextField
                        label="Area Size"
                        fullWidth
                        {...register("areaSize", { required: true })}
                    />

                    <TextField
                        label="Budget Range"
                        fullWidth
                        {...register("budgetRange")}
                    />

                    <TextField
                        label="Completion Time"
                        fullWidth
                        {...register("completionTime")}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UpdateProjectModal;
