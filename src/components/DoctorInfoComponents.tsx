

"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail, User2, GraduationCap} from "lucide-react"; // Lucide icons
import PropTypes from "prop-types";


interface DoctorInfoProps {
  image: string;
  name: string;
    experience: number | string;
    contact: {
    phone: string;
    email: string;
    
  };
  specialization?: string;
  onContactClick: () => void;
  buttonLabel?: string;
  description: string;
}

DoctorInfo.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  experience: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  contact: PropTypes.shape({
    phone: PropTypes.string,
    email: PropTypes.string,
    }).isRequired,
    onContactClick: PropTypes.func,
    buttonLabel: PropTypes.string,
    description: PropTypes.string.isRequired,

  };
export default function DoctorInfo({
  image,
  name,
  experience,
  contact,
  specialization,
  onContactClick,
  buttonLabel = "Contact",
  description,
} : DoctorInfoProps)  {
  return (
      <>
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto rounded-xl  mb-5
       bg-white/95 p-6 flex flex-col md:flex-row gap-6 mt-20"
    >
      {/* Left Side: Image + Info */}
      <div className="flex flex-col items-left md:w-[45%] w-full gap-4 ">
        <Image
          src={image}
          alt={`${name} photo`}
          width={180}
          height={180}
          loading="eager"
          className="rounded-lg object-cover shadow-md w-44 h-44 "
        />
        <div className="w-full mt-2 space-y-2">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#09879a]">
            <User2 size={20} />
            <span>{name}</span>
          </div>
          <div className="flex gap-3 text-gray-600">
            {/* <span className="px-2 py-0.5 bg-cyan-50 rounded text-xs">Age: {age}</span> */}
            <span className="px-2 py-0.5 bg-green-50 rounded text-xs">Exp: {experience} yrs</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-[#09879a]" />
            <span className="text-sm">{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[#09879a]" />
            <span className="text-sm">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-[#09879a]" />
            <span className="text-sm">{specialization}</span>
          </div>

          <button
            onClick={onContactClick}
            className="mt-3 w-full py-2 px-4 bg-[#09879a] text-white font-bold rounded hover:bg-[#066172] transition-all"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
      {/* Right Side: Description */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
        className="flex-1 w-full flex flex-col justify-center"
      >
        <div className="text-xl font-bold text-[#09879a] mb-2">About</div>
        <div className="text-gray-700 text-base text-justify leading-relaxed">{description}</div>
      </motion.div>

      
    </motion.div>
    <hr className="mt-4 border-gray-100 border-t-2 w-full max-w-4xl mx-auto" />
  </>
  );
}

DoctorInfo.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  experience: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  contact: PropTypes.shape({
    phone: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  onContactClick: PropTypes.func,
  buttonLabel: PropTypes.string,
  description: PropTypes.string.isRequired,
};
