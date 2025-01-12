import axios from 'axios';
import {  RefreshResponse } from '@/types/auth.types';
import ApiRoutes from './routes';
import { useApi } from '../hooks/use-api';

let isRefreshing = false;

function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // window.location.href = '/signin'; // Redirect to login page
}

const api = axios.create({
    baseURL: 'https://maicare-go.onrender.com', // Adjust to your API's base URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log({error:error.response});
        if (error.response?.status === 401 && error.response?.data?.message !== "authorization header is not provided" && !originalRequest._retry) {
            originalRequest._retry = true;
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const { message,success,data,error } = await useApi<RefreshResponse>(ApiRoutes.Auth.Refresh,"POST",{}, {
                        token: localStorage.getItem('refreshToken'),
                    });
                    if (!data || !success) {
                        throw new Error(message || "An unknown error occurred");
                    }

                    const newToken = data.access;
                    localStorage.setItem('accessToken', newToken);

                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    isRefreshing = false;

                    // Retry the original request with the new token
                    return api(originalRequest);
                } catch (refreshError) {
                    isRefreshing = false;
                    console.error('Refresh token expired or invalid', refreshError);
                    // Optionally handle logout or token reset here
                    handleLogout();
                    return Promise.reject(refreshError);
                }
            }

            // While refreshing, reject other requests to prevent conflicts
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
