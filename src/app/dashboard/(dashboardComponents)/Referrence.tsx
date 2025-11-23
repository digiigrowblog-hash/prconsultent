"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchReferrals } from "@/feature/allreferrals/allReferralSlice";
import { ReusableTable } from "./Tables";
import { SearchByName } from "./SearchByName";

type ReferralType = {
  _id: string;
  clinicDoctor: string;
  professionalDoctor: string;
  patient: string;
  status: string;
};

const columns: { key: keyof ReferralType; label: string }[] = [
  { key: "clinicDoctor", label: "Clinic Doctor" },
  { key: "professionalDoctor", label: "Professional Doctor" },
  { key: "patient", label: "Patient Name" },
  { key: "status", label: "Status" },
];

export default function Referrence() {
  const dispatch = useAppDispatch();
  const { referrals, loading } = useAppSelector((state) => state.referrals);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input with 500ms delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    dispatch(fetchReferrals());
  }, [dispatch]);

  // Filter referrals using debouncedSearch
  const filtered = debouncedSearch
    ? referrals.filter((r) =>
        r.patient.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : referrals;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl text-[#09879a]">Referrals</h2>
        <SearchByName
          value={search}
          onChange={setSearch}
          placeholder="Search by patient name..."
        />
      </div>
      <ReusableTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
}
