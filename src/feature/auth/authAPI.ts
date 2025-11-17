import axios from 'axios';

const API_BASE_URL = '/api/auth';

export interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
  phone?: string | null;
  specialization?: string | null;
  experience?: number | null;
}

export async function signupAPI(data: {
  fullname: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  specialization?: string;
  experience?: number;
}): Promise<User> {
  const response = await axios.post(`${API_BASE_URL}/signup`, data, { withCredentials: true });
  return response.data.profile;
}

export async function loginAPI(data: { email: string; password: string }): Promise<User> {
  const response = await axios.post(`${API_BASE_URL}/signin`, data, { withCredentials: true });
  return response.data.profile;
}

export async function logoutAPI(): Promise<void> {
 await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
}

export async function fetchProfileAPI(): Promise<User> {
  const response = await axios.get(`${API_BASE_URL}/getprofile`, { withCredentials: true }); 
  console.log(response.data.profile)
  return  response.data.profile
}

export async function updateProfileAPI(data: Partial<Omit<User, 'id' | 'email'>>): Promise<User> {
  const response = await axios.patch(`${API_BASE_URL}/updateprofile`, data, { withCredentials: true });
  return response.data.profile;
}

export async function getAllProfilesAPI(): Promise<User[]> {
  console.log("Fetching all profiles from API");
  const response = await axios.get(`${API_BASE_URL}/getallprofiles`, { withCredentials: true });
  console.log("All Profiles Response:", response);
  return response.data.profiles;
}
