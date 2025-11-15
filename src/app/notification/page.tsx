"use client";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, X, AlertTriangle, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { RootState } from "@/store/store";

// Demo notification data
const notifications = [
  {
    id: 1,
    type: "success",
    icon: <CheckCircle2 className="text-green-600" size={24} />,
    title: "Appointment Confirmed",
    message: "Your appointment with Dr. Priya Sharma is confirmed for 5:00 PM today.",
    time: "2 hours ago"
  },
  {
    id: 2,
    type: "info",
    icon: <Info className="text-cyan-600" size={24} />,
    title: "Profile Updated",
    message: "Your medical profile information has been updated.",
    time: "3 hours ago"
  },
  {
    id: 3,
    type: "warning",
    icon: <AlertTriangle className="text-yellow-600" size={24} />,
    title: "Incomplete Profile",
    message: "Please complete your profile for better recommendations.",
    time: "Yesterday"
  }
];

export default function NotificationPage() {
  const router = useRouter();
  const { user, loading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Wait for auth state to load, then check if user is authenticated
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  // Show nothing while checking auth or redirecting
  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <Header />
        <main className="flex-1 w-full px-2 md:px-0 max-w-2xl mx-auto py-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />
      <main className="flex-1 w-full px-2 md:px-0 max-w-2xl mx-auto py-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 text-2xl font-bold text-[#09879a] mb-8 mt-8 md:mt-16"
        >
          <Bell size={32} className="text-cyan-500" />
          Notifications
        </motion.h1>
        <div className="space-y-5">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.4, delay: notif.id * 0.09 }}
              className={`w-full rounded-lg shadow bg-white flex items-start gap-4 px-4 py-5 border-l-4 ${
                notif.type === "success"
                  ? "border-green-400 shadow-green-100"
                  : notif.type === "info"
                  ? "border-cyan-400 shadow-cyan-100"
                  : notif.type === "warning"
                  ? "border-yellow-300 shadow-yellow-100"
                  : "border-gray-200"
              }`}
            >
              <div className="shrink-0">{notif.icon}</div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-800">
                  {notif.title}
                </div>
                <div className="text-sm text-gray-600 mt-0.5">{notif.message}</div>
                <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
              </div>
              <button title="Dismiss" className="ml-2 text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
