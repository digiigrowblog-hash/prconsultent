import axios from 'axios';
const  API_URL = '/api/searchpatientbyname'

export const searchByPatientAPI = async (name: string) => {
    const response = await axios.get(API_URL);
    return response.data.patients
}