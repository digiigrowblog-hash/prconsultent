import React, { useState } from "react";
import { ReusableTable } from "./Tables";
import { SearchByName } from "./SearchByName";

type Notification = {
  type: string;
  message: string;
};

  const notificationData: Notification[] = [
    { type: "Appointment", message: "meassge send to the patient",}
  ];

  const columns: { key: keyof Notification; label: string }[] = [
  { key: "type", label: "Type" },
  { key: "message", label: "Message" },
];


const Notifications = () => {
   const [search, setSearch] = useState("");
     const filtered = notificationData.filter((d) =>
       d.type.toLowerCase().includes(search.toLowerCase())
     );
  
     return (
       <div><SearchByName value={search} onChange={setSearch} />
         <ReusableTable columns={columns} data={filtered} /></div>
     )
}

export default Notifications