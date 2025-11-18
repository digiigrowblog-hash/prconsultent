export interface User {
  _id: string;
  fullname: string;
  email: string;
  role: 'clinicdoctor' | 'professionaldoctor' | 'admin' | string;
  phone?: string;
  specialization?: string;
  experience?: number;
}

export interface Patient {
  _id: string;
  clinicDoctorId: string;
  clinicDoctorName: string;
  name: string;
  age: number;
  disease: string;
  summary?: string;
  image?: string;
  isVisited: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Referral {
  _id: string;
  clinicDoctor: string | User;
  clinicDoctorName: string;
  professionalDoctor: string | User;
  patient: string | Patient;
  status: 'pending' | 'passed' | 'cancelled' | 'confirmed';
  respondedBy?: string | User;
  respondedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  to: string | User;
  from?: string | User;
  referral?: string | Referral;
  type: 'referral' | 'referral-response' | 'info';
  message?: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}
