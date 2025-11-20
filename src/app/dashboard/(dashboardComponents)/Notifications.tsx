"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks"; // Adjust path
import { fetchNotifications } from "@/feature/allnotifications/allNotificationSlice";
import { ReusableTable } from "./Tables";
import { SearchByName } from "./SearchByName";
import { Notification as ApiNotification } from "@/feature/allnotifications/allNotificationSlice";

type Notification = ApiNotification & {
  createdAt: string;
};

type Column<T> = {
  key: keyof T; // Remove | "createdAt"
  label: string;
};


const columns: Column<ApiNotification>[] = [
  { key: "type", label: "Type" },
  { key: "message", label: "Message" },
];

export default function Notifications() {
  const dispatch = useAppDispatch();
  const { notifications, loading } = useAppSelector((state) => state.notifications);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filtered = search
    ? notifications.filter((n) => n.type.toLowerCase().includes(search.toLowerCase()))
    : notifications;

  return (
    <div>
      {/* <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-xl text-[#09879a]">Notifications</h2>
        <SearchByName value={search} onChange={setSearch} placeholder="Search by type..." />
      </div> */}
     <ReusableTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
}