import React, { useState } from "react";
import { ReusableTable } from "./Tables";
import { SearchByName } from "./SearchByName";

type Patient = {
  name: string;
  age: string;
  image: string;
  disease: string;
  summary: string;
  phone: string;
  isVisited: boolean;
};


  const patientData: Patient[] = [
    { name: "Dr. Raj Singh", age: "30", image: "", disease: "leg injury", summary:"", phone: "" , isVisited: false },

  ];
  
const columns :{ key: keyof Patient; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "image", label: "Image" },
  { key: "disease", label: "Disease" },
  { key: "summary", label: "Summary" },
  { key: "phone", label: "Phone" },
  { key: "isVisited", label: "Is Visited" },
];

const PatientsTables = () => { const [search, setSearch] = useState("");
  const filtered = patientData.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div><SearchByName value={search} onChange={setSearch} />
      <ReusableTable columns={columns} data={filtered} /></div>
  )
}

export default PatientsTables