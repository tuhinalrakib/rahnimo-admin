"use client";

import UpdateProjectModal from "@/components/dashboard/UpdateProjectModal";
import Spinner from "@/components/ui/Spinner";
import ProjectsTableSkeleton from "@/components/UiSkeleton/ProjectsTableSkeleton";
import api from "@/utils/axiosInstance";
import { initSocket } from "@/utils/socket";
import withAuth from "@/wrapper/withAuth";
import {
    Button,
    Pagination,
    Paper,
    Stack,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { MdAddCircleOutline, MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

/* -------------------------------- Styles -------------------------------- */

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.grey[200],
        fontWeight: 600,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
}));

/* -------------------------------- Component -------------------------------- */

const ProjectManagementClient = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const token = useSelector((state) => state.auth.accessToken)

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    /* ----------------------------- Fetch Projects ---------------------------- */
    const { data: projects = [], isLoading, isError } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await api.get("/admin/projects");
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });
    console.log(projects)
    useEffect(() => {
        if (!token) return;
        const socket = initSocket(token);

        // Add new project
        socket.on("project:created", (project) => {
            queryClient.setQueryData(["projects"], (old = []) => [project, ...old]);
        });

        // Update project
        socket.on("project:updated", (updated) => {
            queryClient.setQueryData(["projects"], (old = []) =>
                old.map((p) => (p._id === updated._id ? updated : p))
            );
        });

        // Delete project
        socket.on("project:deleted", (id) => {
            queryClient.setQueryData(["projects"], (old = []) =>
                old.filter((p) => p._id !== id)
            );
        });

        return () => {
            socket.off("project:created");
            socket.off("project:updated");
            socket.off("project:deleted");
        };
    }, [queryClient, token]);


    /* ----------------------------- Delete Projects ---------------------------- */
    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/projects/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            Swal.fire("Deleted!", "Product has been removed.", "success");
        },
        onError: () => {
            Swal.fire("Error!", "Failed to delete product.", "error");
        },
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    /* ----------------------------- Search & Pagination ------------------------ */
    const filteredProjects = useMemo(() => {
        return projects.filter((p) =>
            p.projectTitle.toLowerCase().includes(search.toLowerCase())
        );
    }, [projects, search]);

    const paginatedProjects = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredProjects.slice(start, end);
    }, [filteredProjects, page]);

    /* ----------------------------- Delete Gallery Images ---------------------------- */
    const handleDeleteGalleryImage = (projectId, imageUrl) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await api.patch(`/admin/projects/${projectId}/remove-gallery-image`, imageUrl)
                if (res.data) {
                    Swal.fire("Deleted!", "Gallery image removed.", "success");

                    queryClient.invalidateQueries({ queryKey: ["projects"] });
                }
            }
        });
    }

    /* -------------------------------- Render -------------------------------- */

    if (isLoading) return <ProjectsTableSkeleton rows={8} />;
    if (isError) return <p className="text-red-500">Failed to load projects</p>;

    return (
        <div className="space-y-6 mt-10">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                    href="/dashboard/project-management/addProjects"
                    className="flex items-center gap-2 bg-fuchsia-600 text-white px-5 py-3 rounded-lg shadow hover:scale-105 transition"
                >
                    <MdAddCircleOutline size={22} />
                    Add Product
                </Link>

                <TextField
                    label="Search projects"
                    size="small"
                    value={search}
                    onChange={handleSearch}
                    sx={{ backgroundColor: "#fff", minWidth: 240 }}
                />
            </div>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Title</StyledTableCell>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell>Category</StyledTableCell>
                            <StyledTableCell>Location</StyledTableCell>
                            <StyledTableCell>Area Size</StyledTableCell>
                            <StyledTableCell>Gallery Images</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedProjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" className="py-6">
                                    {search
                                        ? "No projects match your search."
                                        : "No projects available."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProjects.map((project) => (
                                <StyledTableRow key={project._id}>
                                    <TableCell>{project.projectTitle}</TableCell>
                                    <TableCell>
                                        <Image
                                            src={project.image}
                                            alt={project.name || "logo"}
                                            width={50}
                                            height={50}
                                            className="rounded"
                                            loading="lazy"
                                        />
                                    </TableCell>
                                    <TableCell>{project.category}</TableCell>
                                    <TableCell>{project.location}</TableCell>
                                    <TableCell>{project.areaSize}</TableCell>
                                    <TableCell>
                                        <div className="flex ">
                                            {project?.galleryImages?.map((img, i) =>
                                                <div key={i} className="flex flex-col items-center">
                                                    <Image
                                                        
                                                        src={img}
                                                        width={30}
                                                        height={30}
                                                        alt="gallery"
                                                        className="rounded w-10 h-10"
                                                        loading="lazy"
                                                    />
                                                    <Button
                                                        color="error"
                                                        onClick={()=>handleDeleteGalleryImage(project._id,img)}
                                                    >
                                                        <MdDelete size={20} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className="flex justify-center gap-3">
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setOpen(true);
                                                }}
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </StyledTableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredProjects.length > 0 && (
                <Stack alignItems="center" sx={{ my: 2 }}>
                    <Pagination
                        count={Math.ceil(filteredProjects.length / rowsPerPage)}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                </Stack>
            )}

            {/* Update Modal (Uncomment if using) */}
            <UpdateProjectModal
                open={open}
                closeModal={() => setOpen(false)}
                product={selectedProduct}
                refetch={() =>
                    queryClient.invalidateQueries({ queryKey: ["projects"] })
                }
            />
        </div>
    );
};

export default withAuth(ProjectManagementClient);
