import { type LoginResponse, type LoginDetails, type RegisterDetails, type RegisterResponse } from "../types/auth.types";
import api from "./api";


export const login = async (loginDetails : LoginDetails) : Promise<LoginResponse | null> => {
    try{
        const response = await api.post<LoginResponse>("/auth/login", loginDetails);
        return response.data; 
    }catch{
        return null;
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
