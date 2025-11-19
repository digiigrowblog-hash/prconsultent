import React, { useState } from "react";
import { ReusableTable } from "./Tables";
import { SearchByName } from "./SearchByName";

type Referrences = {
  clinicDoctor: string;
  professionalDoctor: string;
  patientName: string;
  status: string;
};


  const referrenceData: Referrences[] = [
    { clinicDoctor: "Dr. Raj Singh", professionalDoctor: "Cardiology", patientName: "raj@clinic.com", status: "1234567890", },

  ];

  const columns: { key: keyof Referrences; label: string }[] = [
  { key: "clinicDoctor", label: "Clinic Doctor" },
  { key: "professionalDoctor", label: "Professional Doctor" },
  { key: "patientName", label: "Patient Name" },
  { key: "status", label: "Status" },
];

const Referrence = () => {
 const [search, setSearch] = useState("");
   const filtered = referrenceData.filter((d) =>
     d.patientName.toLowerCase().includes(search.toLowerCase())
   );

   return (
     <div><SearchByName value={search} onChange={setSearch} />
       <ReusableTable columns={columns} data={filtered} /></div>
   )
}

export default Referrence