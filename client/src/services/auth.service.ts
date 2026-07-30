import { type LoginResponse, type LoginDetails, type RegisterDetails, type RegisterResponse, type ForgotPasswordResponse, type ResetPasswordResponse, type VerificationResponse } from "../types/auth.types";
import api from "./api";


export const login = async (loginDetails : LoginDetails) : Promise<LoginResponse | null> => {
    try{
        const response = await api.post<LoginResponse>("/auth/login", loginDetails);
        return response.data; 
    }catch(error: any){
        return error.response?.data ?? null;
    }
};
export const register = async (registerDetails : RegisterDetails) : Promise<RegisterResponse | null> => {
    try{
        const response = await api.post<RegisterResponse>("/auth/register", registerDetails);
        return response.data;
    }catch{
        return null;
    }
}

export const verifyEmail = async(token : string) => {
    const response  = await api.get(`/auth/verify/${token}`);

    return response.data;
}

export const requestPasswordReset = async (email: string): Promise<ForgotPasswordResponse | null> => {
    try {
        const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", { email });
        return response.data;
    } catch {
        return null;
    }
};

export const resendVerification = async (email: string): Promise<VerificationResponse | null> => {
    try {
        const response = await api.post<VerificationResponse>("/auth/resend-verification", { email });
        return response.data;
    } catch (error: any) {
        return error.response?.data ?? null;
    }
};

export const validatePasswordReset = async (token: string): Promise<ResetPasswordResponse | null> => {
    try {
        const response = await api.get<ResetPasswordResponse>(`/auth/reset-password/${token}`);
        return response.data;
    } catch {
        return null;
    }
};

export const resetPassword = async (token: string, password: string): Promise<ResetPasswordResponse | null> => {
    try {
        const response = await api.post<ResetPasswordResponse>(`/auth/reset-password/${token}`, { password });
        return response.data;
    } catch {
        return null;
    }
};
