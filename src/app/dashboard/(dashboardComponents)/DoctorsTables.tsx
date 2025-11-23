"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllProfiles } from "@/feature/auth/authSlice";
import { ReusableTable } from "./Tables";
import { SearchByName } from "./SearchByName";

type Doctor = {
  fullname: string;
  specialization: string;
  email: string;
  phone: string;
  experience: number;
  role: string;
};

const columns: { key: keyof Doctor; label: string }[] = [
  { key: "fullname", label: "Name" },
  { key: "specialization", label: "Specialization" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "experience", label: "Experience" },
  { key: "role", label: "Role" },
];

export default function DoctorsTables() {
  const dispatch = useAppDispatch();
  const { userList, loadingProfiles } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Handle user input with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500 milliseconds debounce delay

    // Cleanup timeout if user types again
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fetch profiles on component mount
  useEffect(() => {
    dispatch(getAllProfiles());
  }, [dispatch]);

  // Filter doctors by debounced search
  const filteredDoctors =
    debouncedSearch
      ? userList.filter((doc) =>
          doc.fullname.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : userList;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl text-[#09879a]">Doctor Profiles</h2>
        <SearchByName
          value={search}
          onChange={setSearch}
          placeholder="Search by name..."
        />
      </div>
      <ReusableTable
        columns={columns}
        data={filteredDoctors}
        loading={loadingProfiles}
      />
    </div>
  );
}
