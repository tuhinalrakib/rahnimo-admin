"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { IoIosLogOut } from "react-icons/io";
import { clearAuth } from "@/reduxSlice/authSlice";
import { clearUser } from "@/reduxSlice/userSlice";
import { logout } from "@/services/authService";

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch()
  console.log(token)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return null;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerWidth = 260;

  const handleLogout = async () => {
    try {
      await logout(token);
      dispatch(clearAuth());
      dispatch(clearUser());

    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  const drawer = (
    <Box
      className={`h-full flex flex-col justify-between bg-white text-gray-900" shadow-lg`}
    >
      {/* User Info */}
      <Box className="p-6 border-b flex flex-col items-center gap-2">
        <Image
          src={user?.image}
          width={70}
          height={70}
          alt={user?.name || "User"}
          loading="lazy"
          className="w-20 h-20 rounded-full object-cover"
        />
        <Typography variant="h6" className="font-bold text-center">
          {user?.name}
        </Typography>
      </Box>

      {/* Menu */}
      <List className="flex-1 p-0">

        <ListItemButton
          component={Link}
          href="/dashboard"
          className="hover:bg-blue-300  text-sm py-3 transition-none"
          sx={{ borderBottom: "1px solid #ADADAD" }}
        >
          <DashboardIcon className="mr-3 text-lg" /> Dashboard
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/dashboard/project-management"
          className="hover:bg-blue-300  text-sm py-3 transition-none"
          sx={{ borderBottom: "1px solid #ADADAD" }}
        >
          <span className="mr-3 text-lg">🗑️</span> Projects Management
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/dashboard/reports"
          className="hover:bg-blue-300  text-sm py-3 transition-none"
          sx={{ borderBottom: "1px solid #ADADAD" }}
        >
          <span className="mr-3 text-lg">👥</span> Team Management
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/dashboard/manageUsers"
          className="hover:bg-blue-300  text-sm py-3 transition-none"
          sx={{ borderBottom: "1px solid #ADADAD" }}
        >
          <span className="mr-3 text-lg">🧑‍🤝‍🧑</span> User Management & Roles
        </ListItemButton>
      </List>

      {/* Logout */}
      <Box className="p-4 border-t">
        <Button
          variant="outlined"
          color="error"
          startIcon={<IoIosLogOut />}
          onClick={handleLogout}
          className="w-full rounded-xl"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      className="flex min-h-screen bg-[#3b83f66a]"
    >
      {/* Desktop Sidebar */}
      <Box
        className="hidden md:block"
        sx={{ width: drawerWidth, flexShrink: 0 }}
      >
        {drawer}
      </Box>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box className="flex-1 flex flex-col">
        {/* Mobile Navbar */}
        <Box className="flex items-center justify-between bg-white shadow px-4 py-3 md:hidden">
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="font-bold">
            Dashboard
          </Typography>
        </Box>

        {/* Page Content */}
        <Box className="flex-1 p-6">{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
