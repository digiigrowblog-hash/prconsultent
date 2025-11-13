"use client";
import { 
  UserCheck, 
  Heart, 
  CalendarCheck, 
  UserPlus,
  Settings, 
  MessageCircle,
  Star,
  User,
  Quote
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const hoverTransition = { type: "spring", stiffness: 300 } as any;

const reviews = [
  {
    text: "PrConsultant took the fear out of my surgery experience. The specialists are truly world-class and attentive.",
    name: "Anjali S.",
    location: "Mumbai",
    rating: 5,
  },
  {
    text: "Easy to use platform and compassionate doctors who explained every step clearly. Highly recommend!",
    name: "Rajesh K.",
    location: "Delhi",
    rating: 4,
  },
  {
    text: "The personalized treatment plan made all the difference in my recovery. Thank you PrConsultant!",
    name: "Meera P.",
    location: "Bangalore",
    rating: 5,
  },
];

export const ExtraSections = () => (
  <motion.div 
    className="max-w-7xl mx-auto md:px-5 px-3 md:py-8 py-6 text-gray-800 font-sans" 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {/* About Us */}
    <section className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
      <motion.div 
        className="md:w-1/2 w-full flex justify-center"
        whileHover={{ scale: 1.05 }}
        transition={hoverTransition}
      >
        <Image
          src="/images/hospital.png"
          alt="Doctor consulting patient illustration"
          width={500}
          height={400}
          className="rounded-xl md:w-[400px] md:h-80 w-[250px] h-[200px]"
          priority
        />
      </motion.div>

      <div className="md:w-1/2 w-full">
        <h2 className="text-4xl font-extrabold text-[#09879a] mb-4">
          About DocRefer
        </h2>
        <p className="text-gray-700 text-lg mb-4">
          DocRefer is dedicated to transforming the way patients access expert medical care. With a network of renowned surgeons and medical specialists, we focus on accurate diagnosis, personalized treatment, and continuous support.
        </p>
        <p className="text-gray-600 text-base mb-4">
          Our mission is to empower patients with knowledge and trusted professionals, ensuring peace of mind and superior health outcomes. Founded on principles of trust and technology, PrConsultant bridges the gap between you and top-tier healthcare, whether it’s in-person or virtual.
        </p>
        <div className="flex gap-6 mt-4 text-[#09879a]">
          <motion.span
            className="flex items-center gap-2 cursor-pointer text-[#09879a] group"
            whileHover={{ scale: 1.2 }}
            transition={hoverTransition}
          >
            <UserCheck 
              size={28} 
              className="transition-colors duration-300 group-hover:text-[#066172]" 
            />
            Expert Doctors
          </motion.span>
          <motion.span
            className="flex items-center gap-2 cursor-pointer text-[#09879a] group"
            whileHover={{ scale: 1.2 }}
            transition={hoverTransition}
          >
            <Heart
              size={28}
              className="transition-colors duration-300 group-hover:text-[#066172]" 
            />
            Personalized Care
          </motion.span>
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
      <div className="md:w-1/2 w-full">
        <h2 className="text-4xl font-extrabold text-[#09879a] mb-8">How It Works</h2>
        <div className="space-y-8">
          {[
            { icon: CalendarCheck, title: "Book Your Appointment", desc: "Choose a specialist and secure your spot in minutes using our easy online scheduler." },
            { icon: UserPlus, title: "Create Your Profile", desc: "Share your health history and preferences to help us personalize your care experience." },
            { icon: Settings, title: "Meet Your Doctor", desc: "Connect via secure video or in-person visit for your initial consultation and assessment." },
            { icon: MessageCircle, title: "Get Your Plan & Ongoing Support", desc: "Receive a detailed care plan and reach out anytime for advice, progress tracking or follow-up consultations." }
          ].map(({ icon: IconComp, title, desc }, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-4 cursor-pointer text-[#09879a] group"
              whileHover={{ scale: 1.2 }}
              transition={hoverTransition}
            >
              <IconComp 
                size={36}
                className="transition-colors duration-300 group-hover:text-[#066172]"
              />
              <div>
                <h3 className="font-semibold text-xl">{title}</h3>
                <p className="text-gray-700 text-base">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-8 flex items-center gap-2 text-[#09879a]"
          whileHover={{ scale: 1.1 }}
          transition={hoverTransition}
        >
          <Heart size={28} /> <span className="text-md font-medium">Patient-Centric. Confidential. Trusted.</span>
        </motion.div>
      </div>

      <motion.div 
        className="md:w-1/2 w-full flex justify-center"
        whileHover={{ scale: 1.05 }}
        transition={hoverTransition}
      >
        <Image
          src="/images/image.png"
          alt="Healthcare workflow illustration"
          width={500}
          height={320}
          className="rounded-xl md:w-[500px] md:h-80 w-[250px] h-[220px]"
          priority
        />
      </motion.div>
    </section>

    {/* Reviews */}
    <section className="max-w-6xl mx-auto px-6">
      <h2 className="text-4xl font-extrabold text-[#09879a] mb-16 text-center">
        Patient Reviews
      </h2>
      <div className="grid gap-12 md:grid-cols-3">
        {reviews.map(({ text, name, location, rating }, idx) => (
          <motion.blockquote
            key={idx}
            className="bg-cyan-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow relative cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.3, duration: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: "0 12px 20px rgba(9,135,154,0.4)" }}
          >
            <Quote className="absolute top-5 left-10 text-[#09879a] opacity-20 w-10 h-10" />
            <p className="italic text-gray-800 mb-6 relative z-10">{`"${text}"`}</p>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="text-yellow-400" size={20} />
              ))}
              {[...Array(5 - rating)].map((_, i) => (
                <Star key={i} className="text-gray-300" size={20} />
              ))}
            </div>
            <footer className="flex items-center gap-3 relative z-10">
              <User className="text-[#09879a]" size={24} />
              <span className="font-semibold text-[#09879a]">{name}</span>
              <span className="text-gray-500">({location})</span>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  </motion.div>
);
