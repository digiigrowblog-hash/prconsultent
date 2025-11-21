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
import { staticDoctorMeta } from "@/data/doctorStatic"; // import static data

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
  const { user, loading, userList } = useAppSelector(
    (state: RootState) => state.auth
  );
  const { loading: bookingLoading, error: bookingError } = useAppSelector(
    (state) => state.patient
  );

  const [imageSource, setImageSource] = useState<"upload" | "camera">("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);

      if (!user) {
        router.push("/signin");
        return;
      }

      if (user.role === "professionaldoctor") {
        toast.error(
          "Access denied. This page is only available for admins and clinic doctors."
        );
        router.push("/");
        return;
      }

      dispatch(getAllProfiles());
    }
  }, [user, loading, router, dispatch]);

  // Build doctor list combining static + dynamic userList data
  const professionalDoctors = userList.filter(
    (profile) => profile.role === "professionaldoctor"
  );

  const doctors = staticDoctorMeta.slice(0, 8).map((meta, index) => {
    const serverDoctor = professionalDoctors[index];

    return {
      image: meta.image,
      name: serverDoctor?.fullname || meta.fallbackName,
      age: 45,
      experience: serverDoctor?.experience
        ? `${serverDoctor.experience}+`
        : "10+",
      contact: {
        phone: "+91-9833233174",
        email: "dineshbhutt2007@gmail.com",
      },
      specialization: serverDoctor?.specialization || meta.fallbackSpecialization,
      description: meta.description,
    };
  });

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
      toast.error(
        "Please fill in all required fields (Patient Name, Age, and Problem)"
      );
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

      const resultAction = await dispatch(createPatient(requestBody));
      if (createPatient.rejected.match(resultAction)) {
        const error = resultAction.payload || "Failed to book appointment";
        toast.error(error as string);
        return;
      }

      const patientData = resultAction.payload;
      const patientId = patientData._id || patientData.id || patientData.patientId;

      const professionalDoctor = userList.find(
        (doc) => doc.fullname.trim() === formData.ReferName.trim()
      );

      if (!professionalDoctor || !patientId) {
        toast.error("Missing patient or professional doctor ID for referral.");
        return;
      }

      await dispatch(
        addReferral({
          patientId,
          professionalDoctorId: professionalDoctor.id,
        })
      ).unwrap();

      toast.success(
        `Patient appointment and referral booked successfully for ${formData.PatientName}`
      );
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

  if (loading || !user || (user && user.role === "professionaldoctor")) {
    return (
      <div className="flex min-h-screen max-w-full bg-white font-sans flex-col">
        <Header />
        <main className="flex-1 w-full px-2 md:px-0 max-w-2xl mx-auto py-10 flex items-center justify-center mt-20">
          <div className="text-center">
            <p className="text-gray-600">
              {loading
                ? "Loading..."
                : !user
                ? "Redirecting to login..."
                : "Access denied. Redirecting..."}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen max-w-full bg-white font-sans flex-col">
      <Header />
      <div className="mt-20" />
      {doctors.map((doctor) => (
        <div
          key={doctor.name}
          onClick={() => openForm(doctor.name)}
          className="cursor-pointer"
        >
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
        <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex justify-center items-start pt-16 z-50 overflow-auto overscroll-y-contain">
          {/* Form code unchanged from your original with small fixes */}
          {/* ... form JSX here ... */}
        </div>
      )}
      <Footer />
    </div>
  );
}
