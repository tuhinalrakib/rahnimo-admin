"use client";
import TeamFormModal from "@/components/dashboard/TeamFormModal";
import { deleteMember, getTeamMembers } from "@/services/teamService";
import { initSocket } from "@/utils/socket";
import withAuth from "@/wrapper/withAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";

const TeamManagementClient = () => {
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const queryClient = useQueryClient();
    const token = useSelector((state) => state.auth.accessToken)

    const { data: members = [] } = useQuery({
        queryKey: ["team"],
        queryFn: getTeamMembers
    });

    // DELETE API (socket will update UI)
    const { mutate: remove } = useMutation({
        mutationFn: deleteMember
    });

    // SOCKET LISTENERS
    useEffect(() => {
        if (!token) return;
        const socket = initSocket(token);

        socket.on("team:created", (member) => {
            queryClient.setQueryData(["team"], (old = []) => [member, ...old]);
        });

        socket.on("team:updated", (updated) => {
            queryClient.setQueryData(["team"], (old = []) =>
                old.map((m) => (m._id === updated._id ? updated : m))
            );
        });

        socket.on("team:deleted", (id) => {
            queryClient.setQueryData(["team"], (old = []) =>
                old.filter((m) => m._id !== id)
            );
        });

        return () => {
            socket.off("team:created");
            socket.off("team:updated");
            socket.off("team:deleted");
        };
    }, [queryClient, token]);

    return (
        <div className="p-6 bg-white rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Team Members</h2>
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    <FiPlus /> Add Member
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Description</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {members.map((m) => (
                            <tr key={m._id} className="border-b">
                                <td className="py-2">{m.name}</td>
                                <td>{m.designation}</td>
                                <td className="max-w-xs truncate">{m.description}</td>
                                <td className="flex justify-end gap-2">
                                    <button
                                        className=""
                                        onClick={() => { setEditData(m); setOpen(true); }}
                                    >
                                        <FiEdit className="text-blue-500" size={25}/>
                                    </button>
                                    <button
                                        className=""
                                        onClick={() => remove(m._id)}
                                    >
                                        <FiTrash2 className="text-red-500" size={25}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <TeamFormModal open={open} setOpen={setOpen} editData={editData} setEditData={setEditData} />
        </div>
    );
};

export default withAuth(TeamManagementClient);