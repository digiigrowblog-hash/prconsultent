"use client";

import { useState } from "react";
import { Users, Bell, FileText, Users2Icon } from "lucide-react";
import Header from "@/components/Header";

const panels = [
  {
    label: "User Management",
    icon: <Users className="w-6 h-6 " />,
    text: "Shows the users table. Here, admin can manage users."
  },
  {
    label: "Patient",
    icon: <Users2Icon className="w-6 h-6 " />,
    text: "Shows appointment management. View and manage patient appointments."
  },
  {
    label: "Referrals",
    icon: <FileText className="w-6 h-6 " />,
    text: "Shows referral management. View and manage patient referrals."
  },
  {
    label: "Notifications",
    icon: <Bell className="w-6 h-6 " />,
    text: "Shows system notifications for the admin."
  }
  // Add more panels as needed
];

export default function Dashboard() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="min-h-screen  bg-[#e6f7fa] p-0 font-sans max-w-full">
      <Header/>
      <div>
        <div className="w-full   rounded-xl py-10 px-6 relative mt-16">
          {/* Decorative ellipse */}
          {/* <div className="absolute top-0 right-0 w-24 h-24 bg-[#00a0a8] opacity-30 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" /> */}

          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-[#00a0a8]" />
            <h1 className="text-lg md:text-3xl font-bold text-[#09879a]">Welcome to Admin Dashboard</h1>
          </div>

          {/* Tabs/Buttons */}
          <div className="overflow-x-auto">
            <div className="flex gap-4 mb-8 flex-nowrap min-w-max">
              {panels.map((panel, idx) => (
                <button
                  key={panel.label}
                  onClick={() => setSelected(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${selected === idx
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

          {/* Details panel */}
          <div className="bg-[#f4fafc] p-6 rounded-lg border border-[#e0eaf1] text-base text-gray-700 min-h-full">
            {panels[selected].text}
          </div>
        </div>

      </div>

    </div>
  );
}
