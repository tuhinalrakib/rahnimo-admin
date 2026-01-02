"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";
import Image from "next/image";
import api from "@/utils/axiosInstance";
import Swal from "sweetalert2";

const UpdateProjectModal = ({ open, closeModal, product }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const {
    uploadImage,
    uploadGalleryImages,
    galleryImages,
    image,
  } = useCloudinaryUpload();

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        image: image || product.image,
        galleryImages: galleryImages.length ? galleryImages : product.galleryImages,
      };

      await api.patch(`/admin/projects/${product._id}`, updatedData);

      Swal.fire({
        icon: "success",
        title: "Project Updated!",
        timer: 1200,
        showConfirmButton: false,
      });

      closeModal();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Project update failed", "error");
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={closeModal} fullWidth maxWidth="md">
      <DialogTitle>Update Project</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="grid grid-cols-2 gap-4">

          <TextField label="Project Title" fullWidth {...register("projectTitle", { required: true })} />
          <TextField label="Category" fullWidth {...register("category", { required: true })} />
          <TextField label="Location" fullWidth {...register("location", { required: true })} />
          <TextField label="Area Size" fullWidth {...register("areaSize", { required: true })} />

          {/* Main Image */}
          <div className="col-span-2">
            <input type="file" accept="image/*" onChange={e => uploadImage(e.target.files[0])} className="w-full px-4 py-2 border rounded-md bg-[#fcfcfc] mt-2"/>
            <div className="mt-2 flex gap-2">
              {(image || product.image) && (
                <Image src={image || product.image} width={70} height={70} alt="preview" loading="lazy"/>
              )}
            </div>
          </div>

          {/* Gallery Images */}
          <div className="col-span-2">
            <input type="file" multiple accept="image/*" onChange={e => uploadGalleryImages(e.target.files)} className="w-full px-4 py-2 border rounded-md bg-[#fcfcfc] mt-2"/>
            <div className="flex gap-2 mt-2 flex-wrap">
              {(galleryImages.length ? galleryImages : product.galleryImages)?.map((img, i) => (
                <Image key={i} src={img} width={60} height={60} alt="g" loading="lazy"/>
              ))}
            </div>
          </div>

          <TextField
            label="Short Description"
            fullWidth
            multiline rows={3}
            className="col-span-2"
            {...register("shortDescription", { required: true })}
          />

          <TextField label="Client Review" fullWidth {...register("clientReview", { required: true })} />

          {/* Rating */}
          <Controller
            name="clientRating"
            control={control}
            render={({ field }) => (
              <Rating {...field} value={field.value || 0} onChange={(_, v) => field.onChange(v)} />
            )}
          />

        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button type="submit" variant="contained">Update</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateProjectModal;
