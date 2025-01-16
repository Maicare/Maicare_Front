import api from "@/common/api/axios";
import useSWR from "swr";
import ApiRoutes from "../api/routes";
import { useSnackbar } from "notistack";
import useProgressBar from "./use-progress-bar";
import { LoginInput, LoginResponse } from "@/types/auth.types";
import { Employee } from "@/types/employee.types";
import { useApi } from "./use-api";
import { ApiOptions } from "../types/api.types";


export function useAuth() {
  const { data: user, error, mutate, } = useSWR<Employee | null>(
    ApiRoutes.Employee.Profile, // Endpoint to fetch Employee details
    async (url) => {
      const response = await api.get(url);
      if (!response.data.data) {
        return null;
      }
      return response.data.data; // Assuming API returns data inside a "data" field
    },
    { shouldRetryOnError: false }
  );
  const { enqueueSnackbar } = useSnackbar();
  const { start: startProgress, stop: stopProgress } = useProgressBar();

  const isLoading = !user && !error;

  const login = async (credentials: LoginInput, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const {message,success,data,error} = await useApi<LoginResponse>(ApiRoutes.Auth.Login, "POST", {}, credentials);
      if (!data) 
        throw new Error(error || message || "An unknown error occurred");
      const { access, refresh } = data;

      // Save token
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Update user data in SWR cache
      mutate(user);
      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Login successful!", { variant: "success" });
      }
    } catch (err:any) {
      enqueueSnackbar(err?.response?.data?.message || "Login failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const logout = async (options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};

    try {
      // Display progress bar
      if (displayProgress) startProgress();

      // Remove token
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Update SWR cache
      mutate(null);
      // Display success message
      if (displaySuccess) {
        enqueueSnackbar("Logout successful!", { variant: "success" });
      }
    } catch (err:any) {
      enqueueSnackbar(err?.response?.data?.message || "Logout failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };
}
