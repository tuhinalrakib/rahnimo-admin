"use client"
import useAxios from '@/hooks/useAxios';
import useCloudinaryUpload from '@/hooks/useCloudinaryUpload';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaImage, FaLock, FaUser } from 'react-icons/fa';
import { IoMdMail } from "react-icons/io";
import Swal from 'sweetalert2';

const RegisterClientPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const axiosInstance = useAxios()
    const router = useRouter()
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm()

    const { uploadImage, image, uploading } = useCloudinaryUpload()

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        await uploadImage(file)
    }

    const onSubmit = async (data) => {
        try {
            if (!image) {
                Swal.fire({
                    icon: "error",
                    title: "Wait...",
                    text: "Image didn't upload yet!",
                });
                return;
            }
            const userData = {
                ...data,
                image
            };

            const res = await axiosInstance.post('/admin/auth/register', userData);

            if (res.data) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Registration successful! You can now login.",
                    showConfirmButton: false,
                    timer: 1500
                });
                reset()
                router.replace("/login");
            }
        } catch (err) {
            if (err.response) {
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: err.response.data.message || "Something went wrong",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "Unable to connect to server",
                });
            }
            console.error("Registration error:", err);
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#4da3d1]'>
            <div className="bg-[#6db3d6] text-white backdrop-blur-lg p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl text-black/80 font-bold mb-6 text-center">Apply for Admin</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                        <FaUser
                            size={22}
                            className="text-[#4da3d1] absolute left-1.5 top-2.5"
                        />
                        <input
                            type="text"
                            placeholder="User Name"
                            {...register("name", { required: "Name is required" })}
                            className="w-full px-4 pl-10 bg-[#fcfcfc] text-black py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <IoMdMail
                            className="text-[#4da3d1] absolute left-1.5 top-2.5"
                            size={22}
                        />
                        <input
                            type="email"
                            placeholder="example@mail.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            className="w-full px-4 bg-[#fcfcfc] text-black pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Photo */}
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
                            className="w-full px-4 py-2 border rounded-md bg-[#fcfcfc] text-black/70  pl-10"
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                        )}
                        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                        {image && (
                            <Image
                                src={image}
                                width={20}
                                height={20}
                                alt="Preview"
                                loading="lazy"
                                className="w-20 h-20 rounded-full mt-2 object-cover border"
                            />
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <FaLock
                                className="text-[#4da3d1] absolute left-1.5 top-2.5"
                                size={22}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                    validate: {
                                        hasUpperCase: (value) =>
                                            /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                                        hasSpecialChar: (value) =>
                                            /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one special character"
                                    }
                                })}
                                className="w-full px-4 py-2 bg-[#fcfcfc] text-black pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute  right-1.5 top-2"
                            >
                                {showPassword ?
                                    <FaEye size={24} className="text-[#4da3d1]" />
                                    :
                                    <FaEyeSlash size={24} className="text-[#4da3d1]" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2  bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                    >
                        {isSubmitting ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterClientPage;