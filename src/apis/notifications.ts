import { axiosInstance } from "@/lib/axiosInstance";

export const getUnreadNotification = async () => {
  try {
    let response = axiosInstance.get("notification/get-unread-notifications/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsRead = async () => {
  try {
    let response = axiosInstance.post(
      `notification/mark-notification-as-read/`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
