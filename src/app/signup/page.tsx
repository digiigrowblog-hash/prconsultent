"use client";
import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "@/feature/auth/authSlice"; // Adjust path
import type { RootState , AppDispatch} from "@/store/store"; // Adjust path
import type { TypedUseSelectorHook } from 'react-redux'
type RoleType = "admin" | "clinicdoctor" | "professionaldoctor" | "";

const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleType>("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState<number | "">("");

  const router = useRouter();
 const dispatch = useAppDispatch()

  // Get auth state from Redux
  const { loading, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/signin");
      }, 1000);
    }
  }, [user, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!(username && email && password && role)) {
    toast.error("Please fill all the mandatory fields");
    return;
  }

  try {
    await dispatch(
      signup({
        fullname: username,
        email,
        password,
        role,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        ...(specialization.trim() ? { specialization: specialization.trim() } : {}),
        ...(experience !== "" && experience >= 0 ? { experience } : {}),
      })
    ).unwrap();

    // Clear fields on success
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("");
    setPhone("");
    setSpecialization("");
    setExperience("");

    router.push("/signin");
  } catch (err: unknown) {
    if (typeof err === "string") {
      toast.error(err);
    } else {
      toast.error("Signup failed");
    }
  }
};




  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 md:mt-16 mt-12"
    >
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <span className="text-blue-600 font-bold text-xl">🔐</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
        <p className="text-gray-600 mt-2">Sign up to get started</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            FullName*
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your FullName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email*
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password*
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role*
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          >
            <option value="">Select your role</option>
            <option value="clinicdoctor">Clinic Doctor</option>
            <option value="professionaldoctor">Professional Doctor</option>
          </select>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="text"
            maxLength={10}
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
            Specialization (optional)
          </label>
          <input
            id="specialization"
            type="text"
            placeholder="Enter your specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
            Experience (years) (optional)
          </label>
          <input
            id="experience"
            type="number"
            min={0}
            placeholder="Enter experience in years"
            value={experience}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setExperience("");
              } else {
                const num = Number(val);
                if (!isNaN(num) && num >= 0) {
                  setExperience(num);
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </motion.button>
      </form>

      <p className="mt-1 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-blue-400 hover:text-blue-500 flex items-center justify-center gap-1">
          Sign In here <ArrowRight className="inline h-4 w-4" />
        </Link>
      </p>
    </motion.div>
  );
}
