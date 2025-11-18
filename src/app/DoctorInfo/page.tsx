"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import DoctorInfo from "@/components/DoctorInfoComponents";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import type { RootState } from "@/store/store";

import { getAllProfiles } from "@/feature/auth/authSlice";
import { createPatient } from "@/feature/patient/patientSlice";
import { addReferral } from "@/feature/referral/referralSlice";

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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, userList } = useAppSelector((state: RootState) => state.auth);
  const { loading: bookingLoading, error: bookingError } = useAppSelector((state) => state.patient);

  const [imageSource, setImageSource] = useState<"upload" | "camera">("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/signin");
      } else if (user.role === "professionaldoctor") {
        toast.error("Access denied. This page is only available for admins and clinic doctors.");
        router.push("/");
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    dispatch(getAllProfiles());
  }, [dispatch]);

  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    ReferName: "",
    YourName: user?.fullname || "",
    PatientName: "",
    Age: "",
    Phone: "",
    Problem: "",
    Date: "",
    Image: null,
    Summary: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        YourName: user.fullname || "",
      }));
    }
  }, [user]);

  const openForm = (doctorName: string) => {
    if (!user) {
      toast.error("Please login to book an appointment");
      router.push("/signin");
      return;
    }
    setSelectedDoctor(doctorName);
    setFormData((prev) => ({
      ...prev,
      ReferName: doctorName,
      YourName: user.fullname || "",
    }));
    setShowForm(true);
    setImageSource("upload");
    setPreviewUrl(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedDoctor(null);
    setFormData({
      ReferName: "",
      YourName: user?.fullname || "",
      PatientName: "",
      Age: "",
      Phone: "",
      Problem: "",
      Date: "",
      Image: null,
      Summary: "",
    });
    setImageSource("upload");
    setPreviewUrl(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "Image" && e.target instanceof HTMLInputElement && e.target.files) {
      setFormData({ ...formData, [name]: e.target.files[0] });
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, Image: e.target.files[0] });
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to book an appointment");
      router.push("/signin");
      return;
    }

    if (user.role !== "clinicdoctor") {
      toast.error("Only clinic doctors can book patient appointments");
      return;
    }

    if (!formData.PatientName || !formData.Age || !formData.Problem) {
      toast.error("Please fill in all required fields (Patient Name, Age, and Problem)");
      return;
    }

    try {
      let imageBase64 = "";
      if (formData.Image && formData.Image instanceof File) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            if (typeof reader.result === "string") resolve(reader.result);
            else reject(new Error("Failed to convert image"));
          };
          reader.onerror = reject;
          reader.readAsDataURL(formData.Image as File);
        });
      }

      const requestBody = {
        patientName: formData.PatientName,
        age: Number(formData.Age),
        disease: formData.Problem,
        summary: formData.Summary || "",
        image: imageBase64,
        phone: formData.Phone || "",
        appointmentDate: formData.Date || "",
        referredDoctorName: formData.ReferName || "",
      };

      // Dispatch RTK thunk for creating patient
      const resultAction = await dispatch(createPatient(requestBody));
      if (createPatient.rejected.match(resultAction)) {
        const error = resultAction.payload || "Failed to book appointment";
        toast.error(error as string);
        return;
      }

      const patientData = resultAction.payload;
      console.log("Patient Data:", patientData);
      const patientId = patientData._id || patientData.id || patientData.patientId;

      const professionalDoctor = userList.find(
        (doc) => doc.fullname.trim() === formData.ReferName.trim()
      );
      console.log("Professional Doctor:", professionalDoctor);

      if (!professionalDoctor || !patientId) {
        toast.error("Missing patient or professional doctor ID for referral.");
        return;
      }

      await dispatch(
        addReferral({
          patientId,
          professionalDoctorId: professionalDoctor._id || professionalDoctor.id,
        })
      ).unwrap();

      toast.success(`Patient appointment and referral booked successfully for ${formData.PatientName}`);
      closeForm();
      
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : "Failed to book appointment/referral";
      toast.error(errorMessage);
      console.error("Appointment booking error:", err);
    }
  };

  const professionalDoctors = userList.filter((profile) => profile.role === "professionaldoctor");
  const doctor = professionalDoctors.slice(0, 8);

  if (loading || !user || (user && user.role === "professionaldoctor")) {
    return (
      <div className="flex min-h-screen max-w-full bg-white font-sans flex-col">
        <Header />
        <main className="flex-1 w-full px-2 md:px-0 max-w-2xl mx-auto py-10 flex items-center justify-center mt-20">
          <div className="text-center">
            <p className="text-gray-600">
              {loading ? "Loading..." : !user ? "Redirecting to login..." : "Access denied. Redirecting..."}
            </p>
          </div>
        </main>
      </div>
    );
  }
  const doctors = [
    {
      image: "/images/drRahul.png",
      name: doctor[0]?.fullname || "Dr. Rahul R Gupta",
      age: 45,
      experience: `${doctor[0]?.experience}+`,
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      specialization: doctor[0]?.specialization || "Interventional Cardiologist",
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
      name: doctor[1]?.fullname || "Dr. Shoaib F. Padaria",
      age: 45,
      experience: `${doctor[1]?.experience}+`,
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      specialization: doctor[1]?.specialization || "Cardiologist",
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
      name: doctor[2]?.fullname || "Dr. Manish Sontakke",
      age: 45,
      experience: `${doctor[2]?.experience}+`,
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      specialization: doctor[2]?.specialization || "Spine Surgeon,Orthopedist and Joint Replacement Surgeon",
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
      name: doctor[3]?.fullname || "Dr. Rahul Bhatambare",
      age: 45,
      experience: `${doctor[3]?.experience}+`,
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      specialization: doctor[3]?.specialization || "Psychiatrist & Sexologist",
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
      name: doctor[4]?.fullname || "Dr. Veeral M Aliporewala",
      age: 45,
      experience: `${doctor[4]?.experience}+`,
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      specialization: doctor[4]?.specialization || "Dermatologist",
      description: `Dr. Veeral M. Aliporewala is a highly-regarded dermatologist, 
         pediatric dermatologist, and venereologist in Navi Mumbai, known for his 
         expertise in addressing the root causes of skin and hair issues. With over 
         15 years of experience, he operates the Aliporewala Skin Clinic in Seawoods.
         Noted by patients for his genuine, straightforward approach, focusing on 
         effective treatment rather than unnecessary procedures or costly medications.`
    },
    {
      image: "/images/dipak.jpg",
      name: doctor[5]?.fullname || "Dr. Dipak Bhangale",
      age: 45,
      experience: `${doctor[5]?.experience}+`,
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      specialization: doctor[5]?.specialization || "Gastroenterologist",
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
      name: doctor[6]?.fullname || "Dr. Amit Nagarik",
      age: 45,
      experience: `${doctor[6]?.experience}+`,
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      specialization: doctor[6]?.specialization || "Nephrologist",
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
      name: doctor[7]?.fullname || "Dr. Ashish S Naik",
      age: 45,
      experience: `${doctor[7]?.experience}+`,
      contact: { phone: "+91-9833233174", email: "dineshbhutt2007@gmail.com" },
      specialization: doctor[7]?.specialization || "Spine Surgeon",
      description: `Dr. Ashish S Naik's expertise in treating a wide spectrum of spine conditions 
         ensures that patients receive comprehensive and personalized care. From minimally invasive 
         procedures and endoscopic surgeries to managing complex conditions like spinal tuberculosis, 
         spinal trauma, and ankylosing spondylitis, Dr. Naik offers advanced, evidence-based treatments 
         that prioritize patient safety and recovery. With a commitment to utilizing the latest 
         technologies such as robotic surgery and computer navigation, Dr. Naik provides patients 
         with the most effective and minimally invasive solutions for their spinal conditions, 
         helping them regain mobility and improve their quality of life.`
    },
  ];

  return (
    <div className="flex min-h-screen max-w-full bg-white font-sans flex-col">
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
            specialization={doctor.specialization}
            description={doctor.description}
            buttonLabel="Schedule Appointment"
            onContactClick={() => {
              if (!user) {
                toast.error("Please login to book an appointment");
                router.push("/signin");
                return;
              }
              setFormData((prev) => ({ ...prev, ReferName: doctor.name }));
              setShowForm(true);
            }}
          />
        </div>
      ))}

      {showForm && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-40 flex justify-center 
          items-start pt-16 z-50 overflow-auto overscroll-y-contain"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-2 sm:mx-auto"
          >
            <div className="flex justify-center">
              <h2 className="text-xl font-semibold text-[#09879a] mb-6 text-center">
                Book Appointment
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="hover:bg-gray-100 transition mb-6 ml-auto text-gray-600 font-bold text-xl"
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
                type="text"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09879a]"
                maxLength={10}
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
              <div className="flex gap-3 mt-1 mb-2">
                <button
                  type="button"
                  className={`px-2 py-1 rounded ${
                    imageSource === "upload" ? "bg-[#09879a] text-white" : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setImageSource("upload")}
                >
                  Upload
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 rounded ${
                    imageSource === "camera" ? "bg-[#09879a] text-white" : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setImageSource("camera")}
                >
                  Take Photo
                </button>
              </div>
              {imageSource === "upload" && (
                <input
                  type="file"
                  name="Image"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full"
                />
              )}
              {imageSource === "camera" && (
                <input
                  type="file"
                  name="Image"
                  accept="image/*"
                  onChange={handleCapture}
                  capture="environment"
                  className="block w-full"
                />
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Image preview"
                  className="mt-2 rounded border p-1 object-contain h-28"
                />
              )}
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
                disabled={bookingLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-[#09879a] text-white font-semibold hover:bg-[#066172] transition"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Send"}
              </button>
            </div>
            {bookingError && (
              <p className="text-red-600 mt-2 text-center font-semibold">{bookingError}</p>
            )}
          </form>
        </div>
      )}
      <Footer />
    </div>
  );
}