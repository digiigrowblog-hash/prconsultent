import React, { useState, useEffect } from "react";
import { ReusableTable } from "./Tables";
import { SearchByName } from "./SearchByName";
import { useAppDispatch, useAppSelector } from "@/store/hooks"; 
import { getPatients } from "@/feature/allpatients/allPatientSlice";

type Patients = {
  name: string;
  age: number;
  disease: string;
  clinicDoctorName: string;
  phone: string;
  isVisited: boolean;
  summary: string;
};

const columns: { key: keyof Patients; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "disease", label: "Disease" },
  { key: "clinicDoctorName", label: "Doctor" },
  { key: "phone", label: "Phone" },
  { key: "isVisited", label: "Visited" },
  { key: "summary", label: "Summary" },
];

export default function PatientsTables() {
  const dispatch = useAppDispatch();
  const { patients, loading } = useAppSelector((state) => state.patients);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input with 500ms delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    // Cleanup if search changes before 500ms
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    dispatch(getPatients());
  }, [dispatch]);

  // Filter patients by debounced search term
  const filteredPatients = debouncedSearch
    ? patients.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : patients;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl text-[#09879a]">Patient Details</h2>
        <SearchByName
          value={search}
          onChange={setSearch}
          placeholder="Search by name..."
        />
      </div>
      <ReusableTable
        columns={columns}
        data={filteredPatients}
        loading={loading}
      />
    </div>
  );
}
