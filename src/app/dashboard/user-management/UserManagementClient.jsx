"use client"
import Spinner from '@/components/ui/Spinner';
import CardSkeleton from '@/components/UiSkeleton/CardSkeleton';
import api from '@/utils/axiosInstance';
import { Button } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const UserManagementClient = () => {
    const loginUser = useSelector((state) => state.user.user)
    const router = useRouter()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!loginUser) router.replace("/login")
    }, [router, loginUser])

    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await api.get("/admin/users");
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    // const users = usersDate.filter(item => item.email !== loginUser?.email)

    const restrictMutation = useMutation({
        mutationFn: async ({ userId, date }) =>
            await api.post(`/admin/users/${userId}/restrict`, { restrictedUntil: date }),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            Swal.fire("Success", "User restricted successfully", "success");
            setRestrictDate("");
            setSelectedUserId(null);
        },
        onError: (err) => Swal.fire("Error", err?.response?.data?.message || "Failed to restrict user", "error"),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await api.delete(`/admin/users/${id}`),
        onSuccess: () => queryClient.invalidateQueries(["users"]),
        onError: (err) => Swal.fire("Error", err?.response?.data?.message || "Failed to delete user")
    })

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Delete this user?",
            text: "This will remove the user from DB.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete!",
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(id);
        });
    }

    const handleRestrict = (userId) => {
        setSelectedUserId(userId);
        Swal.fire({
            title: "Restrict User",
            html: `<input type="date" id="swal-input" class="swal2-input" max="${new Date().toISOString().split("T")[0]}">`,
            showCancelButton: true,
            confirmButtonText: "Restrict",
            preConfirm: () => {
                const date = document.getElementById("swal-input").value;
                if (!date) {
                    Swal.showValidationMessage("Please select a valid date");
                }
                return date;
            },
        }).then((result) => {
            if (result.isConfirmed) {
                restrictMutation.mutate({ userId, date: result.value });
            }
        });
    };

    if (isError) return <p className="text-red-500">Failed to load users.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 py-5">
            {
                isLoading &&
                [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
            }
            {!isLoading && users.map(user => (
                <div
                    key={user._id}
                    className="
                        bg-white/80 backdrop-blur-lg border border-gray-200
                        rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300
                        overflow-hidden group
                    "
                >
                    {/* Cover Image */}
                    <div className="w-full h-75 overflow-hidden">
                        <Image
                            src={user.image}
                            alt="User Image"
                            width={500}
                            height={500}
                            loading='lazy'
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {user.name}
                        </h2>

                        <p className="text-gray-600 mb-2">
                            <span className="font-medium">Email:</span> {user.email}
                        </p>

                        <p className="mb-4">
                            <span className="font-medium">Role:</span>
                            <span className="ml-2 px-4 py-1 rounded-full text-sm bg-purple-100 text-purple-600 font-semibold">
                                {user.role}
                            </span>
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-6">
                            <Button
                                variant="contained"
                                disabled={loginUser?.email === user?.email || user?.role === "admin"}
                                sx={{
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    paddingX: 3,
                                    paddingY: 1.2
                                }}
                            >
                                Promote to Admin
                            </Button>

                            <Button
                                variant="contained"
                                color="warning"
                                disabled={loginUser.email === user.email}
                                sx={{ borderRadius: "12px", textTransform: "none", px: 3, py: 1.2 }}
                                onClick={() => handleRestrict(user._id)}
                            >
                                Restrict
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                disabled={loginUser?.email === user?.email}
                                sx={{
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    paddingX: 3,
                                    paddingY: 1.2
                                }}
                                onClick={() => handleDelete(user._id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
            {/* Empty State */}
            {!isLoading && users.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                    <Image
                        src="/empty-user.svg"
                        alt="No Users"
                        width={200}
                        height={200}
                        priority
                        className="opacity-70"
                    />
                    <h3 className="mt-6 text-2xl font-semibold text-gray-700">
                        No Users Found
                    </h3>
                    <p className="text-gray-500 mt-2 max-w-md">
                        There are currently no users available in the system.
                        Once users register, they will appear here.
                    </p>
                </div>
            )}

        </div>
    );
};

export default UserManagementClient;