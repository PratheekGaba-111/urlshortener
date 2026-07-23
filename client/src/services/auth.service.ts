import axios  from "axios";

import { type LoginResponse, type LoginDetails, type RegisterDetails, type RegisterResponse } from "../types/auth.types";

const api = axios.create({
    baseURL: "http://localhost:3333/api",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const login = async (loginDetails : LoginDetails) : Promise<LoginResponse | null> => {
    try{
        const response = await api.post<LoginResponse>("/auth/login", loginDetails);
        return response.data; 
    }catch(error){
        return null;
    }
};
export const register = async (registerDetails : RegisterDetails) : Promise<RegisterResponse | null> => {
    try{
        const response = await api.post<RegisterResponse>("/auth/register", registerDetails);
        return response.data;
    }catch(error){
        return null;
    }
}
