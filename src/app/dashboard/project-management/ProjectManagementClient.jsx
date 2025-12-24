"use client";

import Spinner from "@/components/ui/Spinner";
import ProjectsTableSkeleton from "@/components/UiSkeleton/ProjectsTableSkeleton";
import api from "@/utils/axiosInstance";
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
import { MdAddCircleOutline } from "react-icons/md";
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
    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.user.user);
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user, router]);

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
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [projects, search]);

    const paginatedProjects = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredProjects.slice(start, end);
    }, [filteredProjects, page]);

    /* -------------------------------- Render -------------------------------- */

    // if (isLoading) return <ProjectsTableSkeleton rows={8} />;
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
                            <StyledTableCell>Price</StyledTableCell>
                            <StyledTableCell>Stock</StyledTableCell>
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
                            paginatedProjects.map((product) => (
                                <StyledTableRow key={product._id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={50}
                                            height={50}
                                            className="rounded"
                                        />
                                    </TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>৳ {product.price}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
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
            {/* <UpdateProductModal
                open={open}
                closeModal={() => setOpen(false)}
                product={selectedProduct}
                refetch={() =>
                    queryClient.invalidateQueries({ queryKey: ["projects"] })
                }
            /> */}
        </div>
    );
};

export default ProjectManagementClient;
