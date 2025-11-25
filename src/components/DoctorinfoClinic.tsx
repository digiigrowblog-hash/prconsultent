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
import { staticDoctorMeta } from "@/data/doctorStatic";


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


export default function DoctorinfoClinic() {
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
        if (!loading && !user) {
            router.push("/signin");
            return;
        }

        if (!loading && user?.role === "professionaldoctor") {
            toast.error("Access denied. This page is only available for admins and clinic doctors.");
            router.push("/");
            return;
        }

        if (!loading && user) {
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
            name: serverDoctor?.fullname ?? meta.fallbackName,
            experience: serverDoctor?.experience
                ? `${serverDoctor.experience}+`
                : "10+",
            contact: {
                phone: "+91-9833233174",
                email: "dineshbhatt2007@gmail.com",
            },
            specialization: serverDoctor?.specialization || meta.fallbackSpecialization,
            description: meta?.description,
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

            // Assign patientData correctly from the resultAction payload
            const patientData = resultAction.payload;
            const patientId = patientData._id || patientData.id || patientData.patientId;

            const professionalDoctor = userList.find(
                (doc) => doc.fullname.trim().toLowerCase() === formData.ReferName.trim().toLowerCase()
            );

            const professionalDoctorId = professionalDoctor?._id;         

            if (!professionalDoctorId || !patientId) {
                toast.error("Missing patient or professional doctor ID for referral.");
                return;
            }
            
            await dispatch(
                addReferral({
                    patientId,
                    professionalDoctorId: professionalDoctorId,
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

    const isAuthChecking = loading || !user;
    const isForbidden = user?.role === "professionaldoctor";

    if (isAuthChecking) {
        return (
            <div className="flex min-h-screen max-w-full bg-white font-sans flex-col">
                <Header />
                <main className="flex-1 w-full px-2 md:px-0 max-w-2xl mx-auto py-10 flex items-center justify-center mt-20">
                    <p>Checking access...</p>
                </main>
            </div>
        );
    }

    if (isForbidden) {
        return (
            <div className="flex min-h-screen max-w-full bg-white font-sans flex-col">
                <Header />
                <main className="flex-1 w-full px-2 md:px-0 max-w-2xl mx-auto py-10 flex items-center justify-center mt-20">
                    <p>Access denied. Redirecting...</p>
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
                                    className={`px-2 py-1 rounded ${imageSource === "upload"
                                        ? "bg-[#09879a] text-white"
                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                    onClick={() => setImageSource("upload")}
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    className={`px-2 py-1 rounded ${imageSource === "camera"
                                        ? "bg-[#09879a] text-white"
                                        : "bg-gray-100 text-gray-700"
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
                            <p className="text-red-600 mt-2 text-center font-semibold">
                                {bookingError}
                            </p>
                        )}
                    </form>
                </div>
            )}
            <Footer />
        </div>
    );
}
