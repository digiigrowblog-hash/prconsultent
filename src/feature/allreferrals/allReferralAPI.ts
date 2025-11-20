import axios from 'axios';
const  API_BASE_URL = 'api/allreferral'

export async function getAllReferrals() {
    const response = await axios.get(API_BASE_URL);
    return response.data;
}