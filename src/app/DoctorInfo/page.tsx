"use client";

import React, { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import DoctorInfo from "@/components/DoctorInfoComponents";

interface FormData {
  ReferName: string;
  YourName: string;
  PatientName: string;
  Age: string | number;
  Phone: string;
  Problem: string;
  Date: string;
  Image: File | null;
  Summary: string;
}

export default function DoctorInfoPage() {

  const yourNameFromAuth = "John Doe";

  const doctors = [
    {
      image: "/images/drRahul.png",
      name: "Dr. Rahul Gupta",
      age: 45,
      experience: "15+ ",
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      description: `Dr Rahul R Gupta founder surgeon of Cardium is a renowned interventional 
         cardiologist who has been practising in Mumbai for over 19 years. Dr Gupta has ensured
          that the most advanced treatment and techniques from all over the world are made available 
          to his fellow citizens in India.- If you want to find the Best Cardiologist in Navi Mumbai, 
          many people suggest only one name - Dr. Rahul Gupta. He is known as a renowned cardiologist 
          because of his vast study and knowledge in this field. He has immense experience of working 
          for many years in Navi Mumbai and also abroad.. 
          - Dr. Rahul Gupta is not only a Famous Heart Specialist in Navi Mumbai but also he is the
           best teacher as well as the best mentor.`,
    },
    {
      image: "/images/shoaib.jpg",
      name: "Dr. Shoaib F. Padaria",
      age: 45,
      experience: "15+ ",
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      description:
        `Dr Shoaib Padaria graduated from the Seth G S Medical College in Mumbai 
         completing his MD and DM in Cardiology. He was further trained in Interventional Cardiac 
         and Peripheral Vascular procedures at the Guys Hospital and Brook General Hospitals in 
         London. He participated in multiple International trials including the pathbreaking 
         RITA Study. He was part of the 3 member team which performed the first catheter closure 
         of post infarction Ventricular Septal Defect in London, UK.  He joined Jaslok Hospital in 
         1991 as Consultant Cardiologist, and currently is also the Director, Department of Vascular 
         Science. Apart from Coronary Interventions, Dr Padaria speciality is Peripheral Arterial 
         Angioplasty and Angiography, including Diabetic Foot.`
    },
    {
      image: "/images/manish.jpeg",
      name: "Dr. Manish Sontakke",
      age: 45,
      experience: "15+ ",
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      description: `Dr. Manish Sontakke is a Spine Surgeon,Orthopedist and Joint 
         Replacement Surgeon in Fortis Hiranandani hospital vashi and has an experience 
         of 12 years in these fields. He completed MBBS from Mahatma Gandhi Institute of
          Medical Sciences, Sewagram (MGIMS) in 2000,DNB – Orthopaedics /Orthopedic Surgery 
          from University of Pune in 2009 and MS - Orthopaedics from University of Pune in 2010.
          He is a member of Aspin international board. Some of the services provided by the doctor 
          are: Spine Mobilization, Limb Deformities, Foot Care, Ligament and Tendon Repair and 
          Ligament Reconstruction etc.`
    },
    {
      image: "/images/rahulbhat.jpg",
      name: "Dr. Rahul Bhatambare",
      age: 45,
      experience: "15+ ",
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      description: `"Dr. Rahul Bhatambre is a highly experienced and renowned psychiatrist 
        in Navi Mumbai and a leading sexologist in Navi Mumbai, offering expert care for 
        a wide range of psychiatric disorders, sexual dysfunction treatments, and mental
         health conditions. Currently practicing at MPCT Hospital, Sanpada, Dr. Bhatambre 
         has helped thousands of patients regain their emotional and mental well-being 
         through personalized treatment plans. With a compassionate approach and a commitment 
         to staying updated with the latest advancements in psychiatry and sexology, 
         Dr. Bhatambre provides comprehensive care to individuals facing challenges 
         such as depression, anxiety, relationship issues, and sexual health concerns.`
    },
    {
      image: "/images/alipurwala.jpeg",
      name: "Dr. Veeral M Aliporewala",
      age: 45,
      experience: "15+ ",
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      description: `Dr. Veeral M. Aliporewala is a highly-regarded dermatologist, 
        pediatric dermatologist, and venereologist in Navi Mumbai, known for his 
        expertise in addressing the root causes of skin and hair issues. With over 
        15 years of experience, he operates the Aliporewala Skin Clinic in Seawoods.
        Noted by patients for his genuine, straightforward approach, focusing on 
        effective treatment rather than unnecessary procedures or costly medications.`
    },
    {
      image: "/images/dipak.jpg",
      name: "Dr. Dipak Bhangale",
      age: 45,
      experience: "15+ ",
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      description: `Dipak Bhangale - Best Gastroenterologist in Navi Mumbai - Kokilaben Hospital 
        Dr. Dipak Bhangale Consultant Gastroenterology, Hepatology, Interventional Endoscopy, 
        Liver Transplantation M.B.B.S., MD, Dr. NB SS (Medical Gastroenterology and Hepatology), 
        ESEGH (UK) Department: Gastroenterology YEARS OF PRACTICE: 8+ Years GENDER: Male
        LANGUAGES SPOKEN: Marathi, English, Hindi Make an Appointment Biography
        Dr. Dipak Dilip Bhangale is an esteemed Medical Gastroenterologist, Hepatologist, 
        and Interventional Endoscopist with practice in Navi Mumbai. His journey includes 
        comprehensive superspeciality training at Aster Medcity, Kochi, a renowned center 
        of excellence in gastroenterology and hepatology in South India. Post his superspeciality 
        training.`
    },
    {
      image: "/images/nagarik.webp",
      name: "Dr. Amit Nagarik",
      age: 45,
      experience: "15+ ",
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      description: `Dr. Amit Nagarik is a highly accomplished medical professional with a 
        focus on Nephrology, he has more than 18 years of experience in the field of Nephrology. 
        Holding the prestigious degrees of M.D and DNB (Medicine) along with a specialization 
        in Nephrology through DNB, Dr. Nagarik has demonstrated exceptional expertise in the 
        field of internal medicine and kidney-related disorders. His commitment to advancing 
        his knowledge and skills is evident through his fellowships, notably from the International 
        Society for Peritoneal Dialysis (ISPD) in Hong Kong and the International Society of 
        Nephrology (ISN) in the United Kingdom.`
    },
    {
      image: "/images/aashish.jpeg",
      name: "Dr. Ashish S Naik",
      age: 45,
      experience: "15+ ",
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      description: `Dr. Ashish S Naik’s expertise in treating a wide spectrum of spine conditions 
        ensures that patients receive comprehensive and personalized care. From minimally invasive 
        procedures and endoscopic surgeries to managing complex conditions like spinal tuberculosis, 
        spinal trauma, and ankylosing spondylitis, Dr. Naik offers advanced, evidence-based treatments 
        that prioritize patient safety and recovery. With a commitment to utilizing the latest 
        technologies such as robotic surgery and computer navigation, Dr. Naik provides patients 
        with the most effective and minimally invasive solutions for their spinal conditions, 
        helping them regain mobility and improve their quality of life.`
    },


  ];

  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    ReferName: "",
    YourName: yourNameFromAuth,
    PatientName: "",
    Age: "",
    Phone: "",
    Problem: "",
    Date: "",
    Image: null,
    Summary: "",
  });

  const openForm = (doctorName: string) => {
    setSelectedDoctor(doctorName);
    setFormData({ ...formData, ReferName: doctorName, YourName: yourNameFromAuth });
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setSelectedDoctor(null);
    setFormData({
      ReferName: "",
      YourName: yourNameFromAuth,
      PatientName: "",
      Age: "",
      Phone: "",
      Problem: "",
      Date: "",
      Image: null,
      Summary: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const target = e.target;
  const { name, value } = target;

  if (name === "Image" && target instanceof HTMLInputElement && target.files) {
    setFormData({ ...formData, [name]: target.files[0] });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};


  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your save/api logic here
    alert(`Appointment form submitted for ${formData.ReferName}`);
    closeForm();
  };

  return (
    <div className="flex min-h-screen max-w-full bg-white font-sans flex-col ">
      <Header />
      <div className="mt-20" />
      {doctors.map((doctor) => (
        <div key={doctor.name} onClick={() => openForm(doctor.name)} className="cursor-pointer">
          <DoctorInfo
            image={doctor.image}
            name={doctor.name}
            age={doctor.age}
            experience={doctor.experience}
            contact={doctor.contact}
            description={doctor.description}
            buttonLabel="Schedule Appointment"
            onContactClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              setFormData({ ...formData, ReferName: doctor.name });
              setShowForm(true);
              e.stopPropagation();
            }}
          />
        </div>
      ))}

      {showForm && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex justify-center 
        items-start pt-16 z-50  overflow-auto overscroll-y-contain">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-2 sm:mx-auto"
          >

            <div className="flex justify-center" >
              <h2 className="text-xl font-semibold text-[#09879a] mb-6 text-center">
                Book Appointment
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="  hover:bg-gray-100 transition mb-6 ml-auto text-gray-600 font-bold text-xl"
              >
                ⛌
              </button>
            </div>


            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Refer Name</span>
              <input
                type="text"
                name="ReferName"
                value={formData.ReferName}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Your Name</span>
              <input
                type="text"
                name="YourName"
                value={formData.YourName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09879a]"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Patient Name</span>
              <input
                type="text"
                name="PatientName"
                value={formData.PatientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09879a]"
                required
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Age</span>
              <input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                placeholder="Enter age"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09879a]"
                min={0}
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Phone</span>
              <input
                type="tel"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09879a]"
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Problem</span>
              <textarea
                name="Problem"
                value={formData.Problem}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the problem"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09879a]"
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Date</span>
              <input
                type="date"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09879a]"
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Image</span>
              <input
                type="file"
                name="Image"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold">Summary</span>
              <textarea
                name="Summary"
                value={formData.Summary}
                onChange={handleChange}
                rows={3}
                placeholder="Additional summary"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09879a]"
              />
            </label>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2 rounded border border-gray-400 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-[#09879a] text-white font-semibold hover:bg-[#066172] transition"
              >
                Send
              </button>
            </div>

          </form>
        </div>
      )}



      <Footer />
    </div>
  );
}


