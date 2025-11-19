import axios from 'axios';
import type { Notification } from '@/type';

const API_BASE_URL = '/api/notification';

export async function getNotifications(): Promise<Notification[]> {
  const response = await axios.get(`${API_BASE_URL}`, { withCredentials: true });
  return response.data.notifications || [];
}

export async function markNotificationRead(notificationId: string): Promise<Notification> {
  const response = await axios.patch(`${API_BASE_URL}`, { notificationId }, { withCredentials: true });
  return response.data.notification;
}

export async function clearAllNotificationsAPI(): Promise<void> {
  await axios.post(`${API_BASE_URL}`, null, { withCredentials: true });
}