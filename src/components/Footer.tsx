"use client";
import { Home, List, MessageCircle, Award, Info, Phone, Mail, Smartphone, Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white px-8 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-20">

        {/* Navigation Links */}
        <div className="flex flex-col gap-4 min-w-[150px]">
          <h3 className="font-semibold text-lg mb-2 text-[#09879a]">Navigation</h3>
          <Link href="/" className="flex items-center gap-2 hover:text-[#66c2d7] transition-colors">
            <Home size={18} /> Home
          </Link>
          <Link href="#how-it-works" className="flex items-center gap-2 hover:text-[#66c2d7] transition-colors">
            <List size={18} /> How It Works
          </Link>
          <Link href="#reviews" className="flex items-center gap-2 hover:text-[#66c2d7] transition-colors">
            <MessageCircle size={18} /> Review
          </Link>
          <Link href="#hero" className="flex items-center gap-2 hover:text-[#66c2d7] transition-colors">
            <Award size={18} /> Hero
          </Link>
          <Link href="#about-us" className="flex items-center gap-2 hover:text-[#66c2d7] transition-colors">
            <Info size={18} /> About Us
          </Link>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col gap-4 min-w-[200px]">
          <h3 className="font-semibold text-lg mb-2 text-[#09879a]">Contact Us</h3>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-[#66c2d7] transition-colors"
          >
            <Smartphone size={18} /> WhatsApp: +1 234 567 890
          </a>
          <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-[#66c2d7] transition-colors">
            <Phone size={18} /> Phone: +1 234 567 890
          </a>
          <a href="mailto:info@prconsultant.com" className="flex items-center gap-2 hover:text-[#66c2d7] transition-colors">
            <Mail size={18} /> Email: info@prconsultant.com
          </a>
        </div>

        {/* Additional Content */}
        <div className="flex flex-col gap-6 min-w-[250px]">
          <h3 className="font-semibold text-lg mb-2 text-[#09879a]">Connect With Us</h3>
          <p className="text-gray-300">
            Delivering expert healthcare consultations with care and trust. Your health is our priority.
          </p>
          <div className="flex gap-6">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#66c2d7] transition-colors">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#66c2d7] transition-colors">
              <Twitter size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#66c2d7] transition-colors">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-gray-400 mt-12 text-sm">
        &copy; {new Date().getFullYear()} PrConsultant. All rights reserved.
      </p>
    </footer>
  );
}
