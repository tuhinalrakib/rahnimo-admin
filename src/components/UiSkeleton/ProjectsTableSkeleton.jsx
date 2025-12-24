import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton,
} from "@mui/material";

const ProjectsTableSkeleton = ({ rows = 5 }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }}>
                {/* Table Head */}
                <TableHead sx={{ backgroundColor: "#ADADAD" }}>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>

                {/* Table Body Skeleton */}
                <TableBody>
                    {Array.from({ length: rows }).map((_, index) => (
                        <TableRow key={index}>
                            {/* Title */}
                            <TableCell>
                                <Skeleton variant="text" width="80%" height={28} />
                            </TableCell>

                            {/* Image */}
                            <TableCell>
                                <Skeleton variant="rectangular" width={50} height={50} />
                            </TableCell>

                            {/* Category */}
                            <TableCell>
                                <Skeleton variant="text" width="60%" height={28} />
                            </TableCell>

                            {/* Price */}
                            <TableCell>
                                <Skeleton variant="text" width="60%" height={28} />
                            </TableCell>

                            {/* Stock */}
                            <TableCell>
                                <Skeleton variant="text" width="40%" height={28} />
                            </TableCell>

                            {/* Action Buttons */}
                            <TableCell sx={{ display: "flex", gap: 2 }}>
                                <Skeleton variant="rectangular" width={90} height={36} />
                                <Skeleton variant="rectangular" width={90} height={36} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProjectsTableSkeleton;