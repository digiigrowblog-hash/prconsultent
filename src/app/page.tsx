"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Lock } from "lucide-react"; // Lucide icons
import { ExtraSections } from "@/components/HomeComponent";
import { motion } from "framer-motion";

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen max-w-full bg-white font-sans flex-col ">
      <Header />

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
            <h1 className="md:text-4xl sm:text-3xl text-2xl  font-bold text-[#09879a] mt-12 mb-4 text-left">
              Expert Care from Leading Doctors 
            </h1>
            <h3 className="md:text-sm text-xs text-gray-600 text-justify">
              Welcome to DocRefer, where patients find trusted health
              professionals specializing in surgery, general medicine, and
              a variety of healthcare services. Our platform connects you
              with highly qualified doctors and surgeons who are dedicated
              to providing expert care and personalized treatment plans.
            </h3>

            {/* Sign-In Form START */}
            <form className="w-full max-w-md   px-8 py-8 rounded-lg  mt-8 flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-[#09879a] w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#09879a] w-full transition"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-[#09879a] w-5 h-5" />
                <input
                  type="password"
                  placeholder="Password"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#09879a] w-full transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#09879a] text-white font-bold py-2 rounded hover:bg-[#066172] transition"
              >
                Sign In
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Don&apos;t have an account? <Link href="/signup" className="text-[#09879a] underline">Sign Up</Link>
              </p>
            </form>
            {/* Sign-In Form END */}
          </div>
        </div>

        <div className=" md:w-[40%] w-full">
          <Image
            src="/images/doctorImg.webp"
            alt="Doctor Image"
            width={500}
            height={500}
            className=" mx-auto md:w-[500px] md:h-[500px] sm:w-[450px] sm-h-[300px] w-[290px] h-[300px] object-cover"
          />
        </div>
      </motion.section>

      <ExtraSections />
      <Footer />
    </div>
  );
}
