"use client";

import { useState } from "react";
import { Users, Bell, FileText, Users2Icon } from "lucide-react";
import Header from "@/components/Header";
import DoctorsTables from "./(dashboardComponents)/DoctorsTables";
import PatientsTables from "./(dashboardComponents)/PatientsTables";
import ReferralsTables from "./(dashboardComponents)/Referrence";
import NotificationsTables from "./(dashboardComponents)/Notifications";

const panels = [
  {
    label: "Doctor Profiles",
    icon: <Users className="w-6 h-6 " />,   
  },
  {
    label: "Patient",
    icon: <Users2Icon className="w-6 h-6 " />,  
  },
  {
    label: "Referrals",
    icon: <FileText className="w-6 h-6 " />,   
  },
  {
    label: "Notifications",
    icon: <Bell className="w-6 h-6 " />,
  },
 
];

export default function Dashboard() {
  const [selected, setSelected] = useState(0);

  // Function or a constant to render the correct table component
  const renderTable = () => {
    switch (selected) {
      case 0:
        return <DoctorsTables />;
      case 1:
        return <PatientsTables />;
      case 2:
        return <ReferralsTables />;
      case 3:
        return <NotificationsTables />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen  bg-[#e6f7fa] p-0 font-sans max-w-full">
      <Header />
      {/* Dashboard */}
      <div className="w-full   rounded-xl py-10 px-6 relative mt-16">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-[#00a0a8]" />
          <h1 className="text-lg md:text-3xl font-bold text-[#09879a]">
            Welcome to Admin Dashboard
          </h1>
        </div>

        {/* Tabs/Buttons */}
        <div className="overflow-x-auto">
          <div className="flex gap-4 mb-8 flex-nowrap min-w-max">
            {panels.map((panel, idx) => (
              <button
                key={panel.label}
                onClick={() => setSelected(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                  selected === idx
                    ? "bg-[#00a0a8] text-white shadow "
                    : "bg-gray-100 text-[#09879a] hover:bg-[#e6f7fa]"
                } transition`}
              >
                {panel.icon}
                {panel.label}
              </button>
            ))}
            {/* Add more buttons as you wish */}
          </div>
        </div>

        {/* Conditional table rendering */}
        <div className="mt-6">{renderTable()}</div>
      </div>
    </div>
  );
}
