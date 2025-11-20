"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { ExtraSections } from "@/components/HomeComponent";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { fetchProfile, login, clearError } from "@/feature/auth/authSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingOverlay from "@/components/Loading"; // ADD THIS IMPORT


export default function Home() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, loading, error, isInitialized } = useAppSelector((state: RootState) => state.auth); // ADD isInitialized
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);


  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (!(email && password)) {
      toast.error("Please enter both email and password");
      return;
    }


    try {
      await dispatch(login({ email, password })).unwrap();
      setEmail("");
      setPassword("");
      toast.success("Login successful!");
      dispatch(fetchProfile());
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "string" ? err : err instanceof Error ? err.message : "Login failed";
      toast.error(errorMessage);
    }
  };


  return (
    <div className="flex min-h-screen max-w-full bg-white font-sans flex-col ">
      <Header user={user ?? null} />

      <motion.section
        className="relative flex md:flex-row flex-col max-w-full text-center pt-16
        bg-linear-to-tr from-white via-cyan-50 to-white overflow-hidden px-2 md:px-4 "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#d7f6fc] 
          rounded-full filter blur-2xl opacity-70 -z-10"
          style={{
            transform: 'translate(30%, -30%)'
          }}
        />
        <div className="md:flex md:w-[60%] w-full">
          <div className="flex flex-col">
            <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold text-[#09879a] mt-12 mb-4 text-left">
              Expert Care from Leading Doctors 
            </h1>
            <h3 className="md:text-sm text-xs text-gray-600 text-justify">
              Welcome to DocRefer, where patients find trusted health
              professionals specializing in surgery, general medicine, and
              a variety of healthcare services. Our platform connects you
              with highly qualified doctors and surgeons who are dedicated
              to providing expert care and personalized treatment plans.
            </h3>

            {/* THREE-STATE LOGIC: Loading → Form → Image */}
            {!isInitialized ? (
              // STATE 1: Loading (checking authentication)
              <div className="w-full max-w-md px-8 py-20 rounded-lg mt-8 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                    <div className="w-14 h-14 border-4 border-gray-200 border-t-[#09879a] rounded-full animate-spin"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[#09879a] font-bold text-lg">Please wait</p>
                  <p className="text-gray-500 text-sm mt-1">Loading...</p>
                </div>
              </div>
            ) : !user ? (
              // STATE 2: Not authenticated → Show sign-in form
              <form onSubmit={handleSubmit} className="w-full max-w-md px-8 py-8 rounded-lg mt-8 flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-[#09879a] w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#09879a] w-full transition"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-[#09879a] w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#09879a] w-full transition"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#09879a] text-white font-bold py-2 rounded hover:bg-[#066172] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Don&apos;t have an account? <Link href="/signup" className="text-[#09879a] underline">Sign Up</Link>
                </p>
              </form>
            ) : (
              // STATE 3: Authenticated → Show welcome image
              <div className="w-full max-w-md mt-8">
                <Image
                  src="/images/main3.png"
                  alt="Main Image"
                  width={500}
                  height={500}
                  className="h-auto object-cover mx-auto md:w-[500px] md:h-auto sm:w-[450px] w-[290px]"
                  priority
                />
              </div>
            )}
          </div>
        </div>

        <div className="md:w-[40%] w-full">
          <Image
            src="/images/doctorImg.webp"
            alt="Doctor Image"
            width={500}
            height={500}
            className="mx-auto md:w-[500px] md:h-[500px] sm:w-[450px] sm-h-[300px] w-[290px] h-[300px] object-cover"
          />
        </div>
      </motion.section>

      <ExtraSections />
      <Footer />
    </div>
  );
}
