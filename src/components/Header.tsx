"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BellRing, CircleUser, LogOut, User2, Mail, Phone, Briefcase } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Example user data (replace with your real user context)
const user = {
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  experience: 10,
  phone: "+91-9988776655"
};

export default function Header() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  // Close popup on outside click
  useEffect(() => {
    function handleClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [showProfile]);

  return (
    <header className="w-full lg:px-16 md:px-8 px-3 py-4 flex justify-between border-b border-gray-200 h-auto fixed top-0 left-0 right-0 bg-white z-50">
      <h1>
        <Link href="/" className="md:text-2xl text-xl pt-serif-bold font-bold text-[#00a0a8]">
          DocRefer
        </Link>
      </h1>

      <div>
        <nav className="space-x-4 flex justify-between items-center">
            {/* Home */}
          <Link
            href="/"
            className={`${pathname === "/" ? "text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"} hover:text-[#00a0a8] hidden md:block`}
          >
            Home
          </Link>
            {/* DoctorInfo */}
          <Link
            href="/doctorInfo"
            className={`${pathname === "/doctorInfo" ? "text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"} hover:text-[#00a0a8] hidden md:block`}
          >
            DoctorInfo
          </Link>
            {/* Notifications */}
          <Link
            href="/notification"
            className={`${pathname === "/notification" ? "text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"} hover:text-[#00a0a8] hidden md:block`}
          >
            <BellRing className="w-5 h-5" />
          </Link>
          {/* User Icon with Popover */}
          {user ? (
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="relative focus:outline-none"
              aria-label="User menu"
            >
              <CircleUser className={`w-7 h-7 transition ${showProfile ? "text-[#09879a]" 
                : "text-gray-700"}`} />
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    key="userPopup"
                    ref={profileRef}
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 10 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="absolute right-0 top-12 z-50 w-[92vw] max-w-xs
                    bg-white rounded-lg shadow-xl border border-gray-100 py-5 
                    px-6 flex flex-col gap-4"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <User2 className="w-10 h-10 text-[#00a0a8] mb-2" />
                      <span className="text-lg font-semibold text-[#09879a]">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail size={18} className="text-[#09879a]" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Briefcase size={18} className="text-[#09879a]" />
                      <span>{user.experience} yrs experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone size={18} className="text-[#09879a]" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex gap-3 justify-center mt-3">
                      <button className="px-4 py-1 rounded bg-[#09879a] text-white font-semibold hover:bg-[#066172] transition">Edit</button>
                      <button onClick={() => setShowProfile(false)} className="px-4 py-1 rounded border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ) : (
            <Link
              href="/signup"
              className={`${pathname === "/signup"
                ? "text-blue-600 font-semibold" : "text-gray-700"} hover:text-[#00a0a8]  bg-gray-200 px-3 py-1.5 rounded-md text-center hidden md:block text-sm md:text-base`}
            >
              Signup
            </Link>
          )}

          {/* Auth / Logout links */}
          {user ? (
            <Link
              href="/signin"
              className={`${pathname === "/signin"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
                } hover:text-[#00a0a8] bg-gray-200 px-3 py-1.5 rounded-md text-center  text-sm md:text-base`}
            >
              <span className="mt-[-5px]"><LogOut /></span>
            </Link>
          ) : (
            <Link
              href="/signin"
              className={`${pathname === "/signin"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
                } hover:text-[#00a0a8] bg-gray-200 px-3 py-1.5 rounded-md text-center  text-sm md:text-base`}
            >
              <span className="mt-[-5px]">Login </span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
