import axios from "axios";

const API_URL = "/api/searchreferralsbyname"; // adjust path to your route

export const searchReferralsByNameAPI = async (name: string) => {
  const response = await axios.get(`${API_URL}?name=${encodeURIComponent(name)}`);
  return response.data; // assuming your route returns referral array directly
};
