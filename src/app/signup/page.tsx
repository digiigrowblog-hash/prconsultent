"use client"
import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
// import { useAppDispatch } from "@/store/hooks";
// import { signup, clearError } from "@/feature/auth/authSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
// import { RootState } from "@/store/store";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

//   const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = false;

//   const { loading, error, user } = useSelector((state: RootState) => state.auth);

//   useEffect(() => {
//     if (user) {
//       router.push("/");
//     }
//   }, [user, router]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!(username && email && password)) {
//       toast.error("Please fill all the fields");
//       return;
//     }

//     try {
//       await dispatch(signup({ username, email, password })).unwrap();
//       setUsername("");
//       setEmail("");
//       setPassword("");
//       router.push("/login");
//     } catch (err: unknown) {if( typeof err === "string") {
//         toast.error(err);
//       } else {
//         toast.error("Login failed" );
//     }
//     }
//   };
const handleSubmit = () => {
    
}

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
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            UserName
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your UserName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select className="w-full px-3 py-2 border border-gray-300 
                    rounded-md focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent">
            <option>Select your role</option>
            <option value="clinicdocotor">Clinic Doctor</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 
                    rounded-md focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white py-2 px-4 
                  rounded-md hover:bg-blue-700 focus:ring-2
                  focus:ring-blue-500 focus:ring-offset-2 
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  transition-colors"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </motion.button>
      </form>
      <p className="mt-1 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-blue-400 hover:text-blue-500 
                  flex items-center justify-center gap-1"
        >
          Sign In here <ArrowRight className="inline h-4 w-4" />
        </Link>
      </p>
    </motion.div>
  );
};