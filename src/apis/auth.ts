import { axiosInstance } from "@/lib/axiosInstance";

export const handleLoginApi = async (email: string, password: string) => {
  try {
    let response = await axiosInstance.post("/account/login/", {
      email,
      password,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const handleLogoutApi = async () => {
  try {
    let response = await axiosInstance.post("/account/logout/");
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkLoggedinStatusApi = async () => {
  try {
    let response = await axiosInstance.get("/account/check-loggedin-status/");
    return response;
  } catch (error: any) {
    console.log("🚀 ~ checkLoggedinStatusApi ~ error:", error.response);
    throw error;
  }
};
