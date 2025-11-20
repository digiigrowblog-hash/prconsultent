"use client";

import { BellRing, CircleUser, LogOut, User2, Mail, Phone, Briefcase, Save, X, Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, updateProfile } from "@/feature/auth/authSlice";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { RootState } from "@/store/store";
import { fetchNotifications } from "@/feature/notification/notificationSlice";

interface HeaderProps {
  user?: any | null;
}

interface EditFormData {
  fullname: string;
  phone: string ;
  specialization: string;
  experience: number | null;
}

export default function Header({ user: userProp }: HeaderProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const reduxUser = useAppSelector((state: RootState) => state.auth.user);
  const user = reduxUser || userProp;
  const { loading: authLoading , isInitialized  } = useAppSelector((state: RootState) => state.auth);
  const showAuthButtons = isInitialized;

  // Get unread notification count
  const { notifications } = useAppSelector((state: RootState) => state.notification);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [formData, setFormData] = useState<EditFormData>({
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    specialization: user?.specialization || "",
    experience: user?.experience ?? null,
  });

  useEffect(() => {
  if (user) {
    dispatch(fetchNotifications());
  }
}, [user, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        phone: user.phone || "",
        specialization: user.specialization || "",
        experience: user.experience ?? null,
      });
    }
  }, [user]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        if (!isEditMode) {
          setShowProfile(false);
        }
      }
    }
    if (showProfile && !isEditMode) {
      window.addEventListener("mousedown", handleClick);
      return () => {
        window.removeEventListener("mousedown", handleClick);
      };
    }
  }, [showProfile, isEditMode]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditMode(true);
    setShowProfile(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditMode(false);
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        phone: user.phone || "",
        specialization: user.specialization || "",
        experience: user.experience ?? null,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" ? (value ? parseInt(value) || null : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    setIsSubmitting(true);
    try {
      const updateData: Partial<EditFormData> = {};
      if (formData.fullname !== user.fullname) updateData.fullname = formData.fullname;
      if (formData.phone !== (user.phone || "")) updateData.phone = formData.phone || undefined;
      if (formData.specialization !== (user.specialization || "")) updateData.specialization = formData.specialization || undefined;
      if (formData.experience !== (user.experience ?? null)) updateData.experience = formData.experience;

      await dispatch(updateProfile(updateData)).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditMode(false);
    } catch (err: unknown) {
      const errorMessage = typeof err === "string" ? err : err instanceof Error ? err.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleDelete() {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Try again.");
    }
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const menuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <header className="w-full lg:px-16 md:px-8 px-3 py-4 flex justify-between border-b border-gray-200 h-auto fixed top-0 left-0 right-0 bg-white z-50">
      <h1>
        <Link href="/" className="md:text-2xl text-xl pt-serif-bold font-bold text-[#00a0a8]">
          DocRefer
        </Link>
      </h1>

      <nav className="space-x-4 flex md:justify-between justify-end items-center w-full md:w-auto">
        {/* Desktop nav links */}
        <Link
          href="/"
          className={`${pathname === "/" ? "text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"} hover:text-[#00a0a8] hidden md:block`}
        >
          Home
        </Link>

        {showAuthButtons && user && (user.role === "admin" || user.role === "clinicdoctor") && (
          <Link
            href="/doctorinfo"
            className={`${pathname === "/doctorinfo" ? "text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"} hover:text-[#00a0a8] hidden md:block`}
          >
            DoctorInfo
          </Link>
        )}

         {showAuthButtons && user && user.role=== "admin" ?(
          <Link href="/dashboard"
            className={`${pathname === "/dashboard" ? "text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"} hover:text-[#00a0a8] hidden md:block relative`}
          >Dashboard
          </Link>
        ): (
          <Link
            href="/notification"
            className={`${pathname === "/notification" ? "text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"} hover:text-[#00a0a8] hidden md:block relative`}
          >
            <BellRing className="w-5 h-5" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 min-w-[22px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1 shadow-md">
                {unreadCount}
              </div>
            )}
          </Link>
        )}

        {/* User Icon with Popover */}
        {showAuthButtons && user ? (
          <button
            onClick={() => setShowProfile((prev) => !prev)}
            className="relative focus:outline-none"
            aria-label="User menu"
          >
            <CircleUser className={`w-7 h-7 transition ${showProfile ? "text-[#09879a]" : "text-gray-700"}  `} />
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  key="userPopup"
                  ref={profileRef}
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className={
                    isMobile
                      ? "fixed z-50 top-1/2 left-1/2 max-w-xs w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl overflow-auto"
                      : "absolute right-0 top-12 z-50 w-[92vw] max-w-xs bg-white rounded-lg shadow-xl border border-gray-100 py-5 px-6 flex flex-col gap-4"
                  }
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {!isEditMode ? (
                    <>
                      <div className="flex flex-col items-center gap-1">
                        <User2 className="w-10 h-10 text-[#00a0a8] mb-2" />
                        <span className="text-lg font-semibold text-[#09879a]">{user?.fullname}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={18} className="text-[#0997ad]" />
                        <span>{user?.email}</span>
                      </div>
                      {user?.specialization && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Briefcase size={18} className="text-[#09879a]" />
                          <span>{user.specialization}</span>
                        </div>
                      )}
                      {user?.experience !== null && user?.experience !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Briefcase size={18} className="text-[#09879a]" />
                          <span>{user.experience} yrs experience</span>
                        </div>
                      )}
                      {user?.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone size={18} className="text-[#09879a]" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className={`flex gap-3 justify-center mt-3 ${isMobile ? 'flex-col gap-4' : ''}`}>
                        <button
                          className="px-4 py-1 rounded bg-[#09879a] text-white font-semibold hover:bg-[#066172] transition flex items-center gap-2"
                          onClick={handleEditClick}
                        >
                          <User2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowProfile(false);
                          }}
                          className="px-4 py-1 rounded border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col items-center gap-1 mb-2">
                        <User2 className="w-10 h-10 text-[#00a0a8] mb-2" />
                        <span className="text-lg font-semibold text-[#09879a]">Edit Profile</span>
                      </div>

                      <div className="flex flex-col items-start">
                        <label htmlFor="fullname" className="block text-xs font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          id="fullname"
                          name="fullname"
                          type="text"
                          value={formData.fullname}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#09879a] focus:border-transparent text-sm"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {(user?.role === "clinicdoctor" || user?.role === "professionaldoctor") && (
                        <>
                          <div className="flex flex-col items-start">
                            <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                              Phone
                            </label>
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#09879a] focus:border-transparent text-sm"
                              disabled={isSubmitting}
                              maxLength={10}
                            />
                          </div>

                          <div className="flex flex-col items-start">
                            <label htmlFor="specialization" className="block text-xs font-medium text-gray-700 mb-1">
                              Specialization
                            </label>
                            <input
                              id="specialization"
                              name="specialization"
                              type="text"
                              value={formData.specialization}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#09879a] focus:border-transparent text-sm"
                              disabled={isSubmitting}
                            />
                          </div>

                          <div className="flex flex-col items-start">
                            <label htmlFor="experience" className="block text-xs font-medium text-gray-700 mb-1">
                              Experience (years)
                            </label>
                            <input
                              id="experience"
                              name="experience"
                              type="number"
                              min="0"
                              value={formData.experience ?? ""}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#09879a] focus:border-transparent text-sm"
                              disabled={isSubmitting}
                            />
                          </div>
                        </>
                      )}

                      <div className="flex gap-3 justify-center mt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting || authLoading}
                          className="px-4 py-1.5 rounded bg-[#09879a] text-white font-semibold hover:bg-[#066172] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save size={16} />
                          {isSubmitting ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={isSubmitting}
                          className="px-4 py-1.5 rounded border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ) : (
          <Link
            href="/signup"
            className={`${pathname === "/signup" ? "text-blue-600 font-semibold" : "text-gray-700"} hover:text-[#00a0a8]  bg-gray-200 px-3 py-1.5 rounded-md text-center hidden md:block text-sm md:text-base`}
          >
            Signup
          </Link>
        )}

        {/* Auth / Logout links */}
         {showAuthButtons && user ? (
          <button
            onClick={handleDelete}
            className={`${pathname === "/signin" ? "text-blue-600 font-semibold" : "text-gray-700"}
             hover:text-[#00a0a8] bg-gray-200 px-3 py-1.5 rounded-md text-center  text-sm md:text-base md:block hidden`}
          >
            <span className="mt-[-5px]"><LogOut /></span>
          </button>
        ) : (
          <Link
            href="/signin"
            className={`${pathname === "/signin" ? "text-blue-600 font-semibold" : "text-gray-700"}
             hover:text-[#00a0a8] bg-gray-200 px-3 py-1.5 rounded-md text-center  text-sm md:text-base  md:block hidden`}
          >
            <span className="mt-[-5px]">Login </span>
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex items-center justify-end p-2 rounded-md text-gray-700
           hover:text-[#00a0a8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00a0a8] "
        >
          <motion.div
            key={mobileMenuOpen ? "close" : "menu"}
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: mobileMenuOpen ? 90 : 0, scale: mobileMenuOpen ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } },
                visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
              }}
              className="absolute top-full right-3 left-3 bg-white rounded-md shadow-lg border border-gray-200 flex flex-col gap-3 p-4 md:hidden z-40"
            >
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md font-semibold ${pathname === "/" ? "text-[#00a0a8]" : "text-gray-700"
                  } hover:text-[#00a0a8]`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {user && (user.role === "admin" || user.role === "clinicdoctor") && (
                <Link
                  href="/doctorinfo"
                  className={`block px-3 py-2 rounded-md font-semibold ${pathname === "/doctorInfo" ? "text-[#00a0a8]" : "text-gray-700"
                    } hover:text-[#00a0a8]`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  DoctorInfo
                </Link>
              )}
              {
                user && user.role === "admin" &&(
                  <Link
                  href="/dashboard"
                  className={`block px-3 py-2 rounded-md font-semibold ${pathname === "/dahsboard" ? "text-[#00a0a8]" : "text-gray-700"
                    } hover:text-[#00a0a8] relative`}
                  onClick={() => setMobileMenuOpen(false)}
                >Dashboard</Link>

                )
              }

              {user && (user.role === "professionaldoctor" || user.role === "clinicdoctor") && (
                <Link
                  href="/notification"
                  className={`block px-3 py-2 rounded-md font-semibold ${pathname === "/notification" ? "text-[#00a0a8]" : "text-gray-700"
                    } hover:text-[#00a0a8] relative`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notification
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {!user && (
                <>
                  <Link
                    href="/signin"
                    className={`block px-3 py-2 rounded-md font-semibold ${pathname === "/signin" ? "text-[#00a0a8]" : "text-gray-700"
                      } hover:text-[#00a0a8]`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={`block px-3 py-2 rounded-md font-semibold ${pathname === "/signup" ? "text-[#00a0a8]" : "text-gray-700"
                      } hover:text-[#00a0a8]`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </>
              )}

              {user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDelete();
                  }}
                  className="block text-left px-3 py-2 rounded-md font-semibold text-gray-700 hover:text-[#00a0a8]"
                >
                  Logout
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
