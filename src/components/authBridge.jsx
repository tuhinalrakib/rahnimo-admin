"use client";
import { setAccessToken, setAuthStatus } from "@/reduxSlice/authSlice";
import { setUser } from "@/reduxSlice/userSlice";
import { refresh } from "@/services/authService";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AuthBridge({ onAuth }) {
  const dispatch = useDispatch();
  const initializedRef = useRef(false);
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const bootstrapAuth = async () => {
      dispatch(setAuthStatus("loading"))
      try {
        const refreshRes = await refresh().catch(err => {
          console.error("Refresh failed", err);
          return null;
        });

        const accessToken = refreshRes?.accessToken
        const user = refreshRes?.user

        if (accessToken && user) {
          dispatch(setAccessToken(accessToken))
          dispatch(setUser(user))

          onAuth?.()
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (error) {
        console.warn("Auth bootstrap failed:", error);
        dispatch(clearAuth())
        dispatch(clearUser())
      }
    }
    // Only bootstrap when app starts or auth is idle
    if (authStatus === "idle") {
      bootstrapAuth();
    }
  }, [dispatch, onAuth, authStatus])

  return null;
}
