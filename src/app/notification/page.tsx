"use client";

import { motion } from "framer-motion";
import { Bell, CheckCircle2, X, AlertTriangle, Info } from "lucide-react";
import Header from "@/components/Header";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { RootState } from "@/store/store";
import { fetchNotifications, markReadNotification } from "../../feature/notification/notificationSlice";
import { updateReferral } from "@/feature/referral/referralSlice";


export default function NotificationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const { notifications, loading: notifsLoading } = useAppSelector((state: RootState) => state.notification);

  
  const [selectedNotif, setSelectedNotif] = useState<any | null>(null);
  const [actionDone, setActionDone] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
    }
  }, [user, dispatch]);

   useEffect(() => {
    setActionDone(false);
  }, [selectedNotif]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <Header />
        <main className="flex-1 w-full px-4 max-w-2xl mx-auto py-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </main>
      </div>
    );
  }

  const handleDismiss = (id: string) => {
    dispatch(markReadNotification(id));
  };

  const handleAccept = async () => {
    if (!selectedNotif) return;
    try {
      // Call your updateReferral API with status 'passed' or 'confirmed'
      await dispatch(updateReferral({ referralId: selectedNotif.referral, status: 'passed' })).unwrap();

      // Update notification read status via API (example PATCH)
      await dispatch(markReadNotification(selectedNotif._id)).unwrap();

      // Update local UI disabled state
      setActionDone(true);
    } catch (error) {
      console.error("Accept referral error:", error);
    }
  };

  const handleCancel = async () => {
    if (!selectedNotif) return;
    try {
      // Call your updateReferral API with status 'cancelled'
      await dispatch(updateReferral({ referralId: selectedNotif.referral, status: 'cancelled' })).unwrap();

      // Update notification read status via API
      await dispatch(markReadNotification(selectedNotif._id)).unwrap();

      setActionDone(true);
    } catch (error) {
      console.error("Cancel referral error:", error);
    }
  };


  const iconMap = {
    referral: <Bell size={24} className="text-cyan-600" />,
    "referral-response": <CheckCircle2 size={24} className="text-green-600" />,
    info: <Info size={24} className="text-blue-600" />,
    warning: <AlertTriangle size={24} className="text-yellow-600" />,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Header />
      <main className="flex-1 w-full px-4 max-w-2xl mx-auto py-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 text-2xl font-bold text-[#09879a] mb-8 mt-10 md:mt-20"
        >
          <Bell size={32} className="text-cyan-500" />
          Notifications
        </motion.h1>

        <div className="space-y-5">
          {notifsLoading ? (
            Array(3).fill(0).map((_, idx) => (
              <div
                key={idx}
                className="w-full rounded-lg shadow bg-gray-100 flex items-center gap-4 px-4 py-5 border-l-4 border-gray-300 animate-pulse h-20"
              />
            ))
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-10">No notifications</p>
          ) : (
            notifications.map((notif, idx) => {
              const icon = iconMap[notif.type] || <Info size={24} className="text-gray-600" />;
              const notifTime = new Date(notif.createdAt).toLocaleString();

              return (
                <motion.div
                  key={notif._id}
                  initial={{ opacity: 0, translateY: 15 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`w-full rounded-lg shadow bg-white flex items-start gap-4 px-4 py-5 border-l-4 cursor-pointer ${notif.type === "referral-response"
                      ? "border-green-400 shadow-green-100"
                      : notif.type === "referral"
                        ? "border-cyan-400 shadow-cyan-100"
                        : notif.type === "info"
                          ? "border-blue-400 shadow-blue-100"
                          : notif.type === "warning"
                            ? "border-yellow-300 shadow-yellow-100"
                            : "border-gray-200"
                    }`}
                  onClick={() => setSelectedNotif(notif)}
                >
                  <div className="shrink-0">{icon}</div>
                  <div className="flex-1">
                    <div className="text-base font-semibold text-gray-800">{notif.message || "Notification"}</div>
                    <div className="text-xs text-gray-400 mt-1">{notifTime}</div>
                  </div>
                  <button
                    title="Dismiss"
                    className="ml-2 text-gray-400 hover:text-gray-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismiss(notif._id);
                    }}
                  >
                    <X size={20} />
                  </button>
                </motion.div>
              );
            })
          )}
        </div>

        {selectedNotif && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-start pt-16 px-4 z-50 overflow-auto overscroll-y-contain">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
            >
              <button
                onClick={() => setSelectedNotif(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition font-bold text-2xl"
                aria-label="Close popup"
              >
                ⛌
              </button>

              <h2 className="text-lg font-semibold text-[#09879a] mb-4">Patient Referral Details</h2>

              {selectedNotif.patientInfo ? (
                <div className="space-y-2 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <p><strong>Name:</strong> {selectedNotif.patientInfo.name || "N/A"}</p>
                  <p><strong>Age:</strong> {selectedNotif.patientInfo.age || "N/A"}</p>
                  <p><strong>Problem/Condition:</strong> {selectedNotif.patientInfo.disease || "N/A"}</p>
                  <p><strong>Phone:</strong> {selectedNotif.patientInfo.phone || "N/A"}</p>
                </div>
              ) : (
                <p className="text-gray-500">Patient details not available.</p>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  disabled={actionDone}
                  className={`px-5 py-2 rounded border border-gray-400 hover:bg-gray-100 transition w-full sm:w-auto ${actionDone ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
                  disabled={actionDone}
                  className={`px-5 py-2 rounded bg-[#09879a] text-white font-semibold hover:bg-[#066172] transition w-full sm:w-auto ${actionDone ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  Accept
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
