import axios from "axios";

const API_BASE_URL = '/api/allpatients';

export  async function fetchPatients () {
    const response = await axios.get(API_BASE_URL); 
  return response.data;
};
    
