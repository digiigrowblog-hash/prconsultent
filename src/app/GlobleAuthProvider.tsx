"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchProfile } from "@/feature/auth/authSlice";

export default function GlobalAuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return <>{children}</>;
}