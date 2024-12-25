import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { apiErrors } from './common';

class AxiosHelper {
    instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            timeout: 50000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        // Response interceptor
        // this.instance.interceptors.response.use(
        //     (response) => response,
        //     (error: AxiosError) => {
        //         // Handle 401 unauthorized globally
        //         if (error.response?.status === 401) {
        //             const token = Cookies.get('authToken');
        //             // Only handle 401 if user was previously authenticated
        //             if (token) {
        //                 Cookies.remove('authToken');
        //                 window.location.href = '/login';
        //             }
        //         }
        //         return Promise.reject(error);
        //     }
        // );
    }

    async get<T = any>(endpoint: string, params?: any, handleApiErrors: boolean = true): Promise<T> {
        try {
            const response: AxiosResponse<{
                status: number;
                message: string;
                data: T;
            }> = await this.instance.get(endpoint, {
                params,
                headers: this.getAuthHeader(),
            });
            return response?.data?.data;
        } catch (error) {
            if (handleApiErrors && error instanceof AxiosError) {
                apiErrors(error);
            }
            throw error;
        }
    }

    async post<T = any>(endpoint: string, data?: any, handleApiErrors: boolean = true): Promise<T> {
        try {
            let headers: Record<string, string> = this.getAuthHeader();
            let payload: any = data;
    
            if (data instanceof FormData) {
                headers = {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                };
            }
    
            const response: AxiosResponse<T> = await this.instance.post(endpoint, payload, {
                headers
            });
    
            return response?.data;  
        } catch (error) {
            if (handleApiErrors) {
                if (error instanceof AxiosError) {
                    apiErrors(error);
                } else {
                    console.error('Non-Axios error:', error);
                    throw error;
                }
            }
            throw error;
        }
    }

    async put<T = any>(endpoint: string, data?: any, handleApiErrors: boolean = true): Promise<T> {
        try {
            let headers: Record<string, string> = this.getAuthHeader();
            let payload: any = data;

            if (data instanceof FormData) {
                headers = {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                };
            }

            const response: AxiosResponse<T> = await this.instance.put(endpoint, payload, {
                headers
            });
            return response?.data;
        } catch (error) {
            if (handleApiErrors) {
                apiErrors(error);
            }

            throw error;
        }
    }

    async patch<T = any>(endpoint: string, data?: any, handleApiErrors: boolean = true): Promise<T> {
        try {
            let headers: Record<string, string> = this.getAuthHeader();
            let payload: any = data;

            if (data instanceof FormData) {
                headers = {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                };
            }

            const response: AxiosResponse<T> = await this.instance.patch(endpoint, payload, {
                headers
            });
            return response?.data;
        } catch (error) {
            if (handleApiErrors) {
                apiErrors(error);
            }

            throw error;
        }
    }

    async delete<T = any>(endpoint: string, handleApiErrors: boolean = true): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.instance.delete(endpoint, {
                headers: this.getAuthHeader(),
            });
            return response?.data;
        } catch (error) {
            if (handleApiErrors) {
                apiErrors(error);
            }

            throw error;
        }
    }

    private getAuthHeader(): Record<string, string> {
        const headers: Record<string, string> = {};
        const token = Cookies.get('authToken');
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    }
}

const axiosHelper = new AxiosHelper();
export default axiosHelper;
