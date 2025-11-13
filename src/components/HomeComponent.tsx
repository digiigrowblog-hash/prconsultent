"use client";
import { 
    UserCheck, 
    Info, 
    MessageCircle, 
    Settings, 
    Heart, 
    CalendarCheck, 
    UserPlus,
    Star, 
    User, 
    Quote
} from "lucide-react";

import Image from "next/image";

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


export const ExtraSections= ()=> {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16 text-gray-800 font-sans">

      {/* About Us */}
      <section className="max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
      {/* Image on the left (desktop), top (mobile) */}
      <div className="md:w-1/2 w-full flex justify-center">
        <Image
          src="/images/hospital.avif" 
          alt="Doctor consulting patient illustration"
          width={500}
          height={400}
          className="rounded-xl  md:w-[500] md:h-[400] w-[250px] h-[200px]"
          priority
        />
      </div>
      {/* About Us Text Content */}
      <div className="md:w-1/2 w-full">
        <h2 className="text-4xl font-extrabold text-[#09879a] mb-4">About PrConsultant</h2>
        <p className="text-gray-700 text-lg mb-4">
          PrConsultant is dedicated to transforming the way patients access expert medical care. With a network of renowned surgeons and medical specialists, we focus on accurate diagnosis, personalized treatment, and continuous support.
        </p>
        <p className="text-gray-600 text-base mb-4">
          Our mission is to empower patients with knowledge and trusted professionals, ensuring peace of mind and superior health outcomes. Founded on principles of trust and technology, PrConsultant bridges the gap between you and top-tier healthcare, whether it’s in-person or virtual.
        </p>
        <div className="flex gap-6 mt-4 text-[#09879a]">
          {/* Example Lucide icons for extra polish */}
          <span className="flex items-center gap-2"><UserCheck size={28} /> Expert Doctors</span>
          <span className="flex items-center gap-2"><Heart size={28} /> Personalized Care</span>
        </div>
      </div>
    </section>

      {/* How It Works */}
       <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
      {/* Workflow Image (Left) */}
        
      <div className="md:w-1/2 w-full">
        <h2 className="text-4xl font-extrabold text-[#09879a] mb-8">How It Works</h2>
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <CalendarCheck className="text-[#09879a]" size={36} />
            <div>
              <h3 className="font-semibold text-xl">Book Your Appointment</h3>
              <p className="text-gray-700 text-base">Choose a specialist and secure your spot in minutes using our easy online scheduler.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserPlus className="text-[#09879a]" size={36} />
            <div>
              <h3 className="font-semibold text-xl">Create Your Profile</h3>
              <p className="text-gray-700 text-base">Share your health history and preferences to help us personalize your care experience.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Settings className="text-[#09879a]" size={36} />
            <div>
              <h3 className="font-semibold text-xl">Meet Your Doctor</h3>
              <p className="text-gray-700 text-base">Connect via secure video or in-person visit for your initial consultation and assessment.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MessageCircle className="text-[#09879a]" size={36} />
            <div>
              <h3 className="font-semibold text-xl">Get Your Plan & Ongoing Support</h3>
              <p className="text-gray-700 text-base">Receive a detailed care plan and reach out anytime for advice, progress tracking or follow-up consultations.</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-2 text-[#09879a]">
          <Heart size={28} /> <span className="text-md font-medium">Patient-Centric. Confidential. Trusted.</span>
        </div>
      </div>

    {/* Workflow Image (Right) */}
      <div className="md:w-1/2 w-full flex justify-center">
        <Image
          src="/images/image.png" // place your svg here
          alt="Healthcare workflow illustration"
          width={500}
          height={320}
          className="rounded-xl md:w-[500px] md:h-80 w-[250px] h-[220px]"
          priority
        />
      </div>
    </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-6">
      <h2 className="text-4xl font-extrabold text-[#09879a] mb-16 text-center ">Patient Reviews</h2>
      <div className="grid gap-12 md:grid-cols-3">
        {reviews.map(({ text, name, location, rating }, idx) => (
          <blockquote
            key={idx}
            className="bg-cyan-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow relative"
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
          </blockquote>
        ))}
      </div>
    </section>

    </div>
  );
}
