"use client"
import Spinner from '@/components/ui/Spinner';
import { setAccessToken, setAuthStatus } from '@/reduxSlice/authSlice';
import { setUser } from '@/reduxSlice/userSlice';
import { Button } from '@mui/material';
import axios from 'axios';
import { SaveIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const LoginClientPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const user = useSelector((state) => state.user.user)
    const router = useRouter()
    const dispatch = useDispatch()
    const status = useSelector((state)=> state.auth.status)
    console.log(status)

    const {
        handleSubmit,
        register,
        formState: { errors, isLoading, isSubmitting }
    } = useForm()

    useEffect(() => {
        if (user) router.replace("/dashboard")
    }, [user, router])

    if ( status === "loading" || isLoading) return <Spinner />

    const onSubmit = async (data) => {
        dispatch(setAuthStatus("loading"))
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/auth/login`, data, {
                withCredentials: true
            })
            if (res.data) {
                const { user, accessToken } = res.data;
                dispatch(setAccessToken(accessToken))
                dispatch(setUser(user))

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Login successful!!",
                    showConfirmButton: false,
                    timer: 1500,
                });

                router.replace("/dashboard")
            }
        } catch (err) {
            let msg = "Something went wrong";

            // Backend থেকে specific error message handle করতে চাইলে
            const errorMsg = err?.response?.data?.message;

            if (errorMsg) {
                switch (errorMsg) {
                    case "Invalid credentials":
                        msg = "Email / Password didn't match!";
                        break;
                    case "User not found":
                        msg = "User not found!";
                        break;
                    case "Email verification did not complete yet":
                        msg = "You didn't verify your email, Please verify your Email!";
                        break;
                    case "Only admin can allow for login":
                        msg = "Only admin can allow for login";
                        break;
                    case "Need to admin aprroval":
                        msg = "Admin didn't approved for Admin Login!";
                        break;
                    case "Account locked. Try later or reset password.":
                        msg = "Your account is temporarily locked!";
                        break;
                }
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-bl from-purple-700 to-purple-200">
            <div className="bg-purple-400 p-8 backdrop-blur-lg rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Well Come Back Admin</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                className="absolute cursor-pointer right-1.5 top-2"
                            >
                                {showPassword ?
                                    <FaEye size={24} className="text-fuchsia-700" />
                                    :
                                    <FaEyeSlash size={24} className="text-fuchsia-700" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        fullWidth
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                    >
                        {isSubmitting ? "Login..." : "Login"}
                    </Button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Don&apos;t have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginClientPage;