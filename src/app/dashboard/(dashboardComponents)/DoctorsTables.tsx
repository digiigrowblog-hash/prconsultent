import React, { useState } from "react";
import { ReusableTable } from "./Tables";
import { SearchByName } from "./SearchByName";

type Doctor = {
  name: string;
  specialization: string;
  email: string;
  phone: string;
  experience: number;
};


  const doctorsData: Doctor[] = [
    { name: "Dr. Raj Singh", specialization: "Cardiology", email: "raj@clinic.com", phone: "1234567890", experience: 10 },

  ];

  const columns: { key: keyof Doctor; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "specialization", label: "Specialization" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "experience", label: "Experience" },
];


const DoctorsTables = () => {
  const [search, setSearch] = useState("");
  const filtered = doctorsData.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div><SearchByName value={search} onChange={setSearch} />
      <ReusableTable columns={columns} data={filtered} /></div>
  )
}

export default DoctorsTables