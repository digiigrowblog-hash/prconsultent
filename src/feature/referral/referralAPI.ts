import axios from 'axios';
import type { Referral } from '@/type';

const API_BASE_URL = '/api/referral';

export interface CreateReferralPayload {
  patientId: string;
  professionalDoctorId: string;
}

export async function createReferral(data: CreateReferralPayload): Promise<Referral> {
  const response = await axios.post(`${API_BASE_URL}`, data, { withCredentials: true });
  return response.data.referral;
}

export async function getReferrals(): Promise<Referral[]> {
  const response = await axios.get(`${API_BASE_URL}`, { withCredentials: true });
  return response.data.referrals || response.data.referrals || [];
}

export interface UpdateReferralStatusPayload {
  referralId: string;
  status: 'passed' | 'cancelled' | 'confirmed';
  message?: string;
}

export async function updateReferralStatus(data: UpdateReferralStatusPayload): Promise<Referral> {
  const response = await axios.patch(`${API_BASE_URL}`, data, { withCredentials: true });
  return response.data.referral;
}
