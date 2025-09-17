import api from "@/common/api/axios";
import useSWR from "swr";
import ApiRoutes from "../api/routes";
import { useSnackbar } from "notistack";
import useProgressBar from "./use-progress-bar";
import { LoginInput, LoginResponse } from "@/types/auth.types";
import { Employee } from "@/types/employee.types";
import { useApi } from "./use-api";
import { ApiOptions } from "../types/api.types";


export function useAuth({autoFetch=true}:{autoFetch?:boolean}) {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const shouldFetch = autoFetch && !!accessToken;
  const { data: user, error, mutate,isLoading } = useSWR<Employee | null>(
    shouldFetch ? ApiRoutes.Employee.Profile : null, // Endpoint to fetch Employee details
    async (url) => {
      if (!url) {
        return null;
        
      }
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

  // const isLoading = !user && !error;

  const login = async (credentials: LoginInput, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      const { message, success, data, error } = await useApi<LoginResponse>(ApiRoutes.Auth.Login, "POST", {}, credentials);
      if (!data)
        throw new Error(error || message || "An unknown error occurred");
      const { access, refresh, requires_2fa } = data;

      // Save token
      if (!requires_2fa) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
      }

      // Update user data in SWR cache
      mutate();
      // Display success message
      if (displaySuccess && success) {
        enqueueSnackbar("Login successful!", { variant: "success" });
      }
      return data;

    } catch (err: any) {
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
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Logout failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  // changePassword
  const changePassword = async (oldPassword: string, newPassword: string, confirmPassword: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      if (!user) {
        throw new Error("User not authenticated");
      }
      if (oldPassword === newPassword) {
        throw new Error("New password must be different from old password");

      }
      if (confirmPassword !== newPassword) {
        throw new Error("New password and confirmation do not match");
      }

      const { message, success, error } = await useApi(ApiRoutes.Auth.ChangePassword, "POST", {}, { old_password: oldPassword, new_password: newPassword });
      if (!success)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess) {
        enqueueSnackbar("Password changed successfully!", { variant: "success" });
      }
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "Change password failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const setup2FA = async (options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { message, success, error, data } = await useApi<{
        secret: string;
        qr_code_base64: string;
      }>(ApiRoutes.Auth.Setup2FA, "POST", {}, {});
      if (!success || !data)
        throw new Error(error || message || "An unknown error occurred");

      // Display success message
      if (displaySuccess) {
        enqueueSnackbar("2FA setup successfully!", { variant: "success" });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "2FA setup failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const enable2FA = async (validation_code: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { message, success, error, data } = await useApi(ApiRoutes.Auth.Enable2FA, "POST", {}, { validation_code });
      if (!success) {
        throw new Error(error || message || "An unknown error occurred");
      }

      // Display success message
      if (displaySuccess) {
        enqueueSnackbar("2FA enabled successfully!", { variant: "success" });
      }
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "2FA enable failed", { variant: "error" });
      throw err;
    } finally {
      if (displayProgress) stopProgress();
    }
  };

  const Verify2FA = async (temp_token: string, validation_code: string, options?: ApiOptions) => {
    const { displayProgress = false, displaySuccess = false } = options || {};
    try {
      // Display progress bar
      if (displayProgress) startProgress();

      const { message, success, error, data } = await useApi<{
        "access": string,
        "refresh": string,
        "requires_2fa": boolean,
        "temp_token": string
      }>(ApiRoutes.Auth.Verify2FA, "POST", {}, { temp_token, validation_code });
      if (!success || !data) {
        throw new Error(error || message || "An unknown error occurred");
      }
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // Display success message
      if (displaySuccess) {
        enqueueSnackbar("2FA verified successfully!", { variant: "success" });
      }
      mutate(user);
      return data;
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.message || "2FA verification failed", { variant: "error" });
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
    changePassword,
    setup2FA,
    enable2FA,
    Verify2FA
  };
}
