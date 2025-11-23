import axios from 'axios';

const API_BASIC_URI = '/api/allnotification';

export const getAllNotification = async () => {
    const response = await axios.get(API_BASIC_URI);
    return response.data;
}