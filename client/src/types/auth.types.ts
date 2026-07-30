export interface LoginDetails{
    email : string, 
    password : string
}
export interface RegisterDetails{
    email : string,
    name : string,
    password : string
}
export interface User{
    id : string, 
    name : string, 
    email : string
}
export interface LoginSuccessResponse{
    success: true;
    message : string,
    token : string, 
    user : User
}

export interface LoginErrorResponse {
    success: false;
    message: string;
    code?: "EMAIL_NOT_VERIFIED" | string;
    email?: string;
    canResendVerification?: boolean;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export interface RegisterResponse{
    success: true;
    message : string
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

export interface VerificationResponse {
    success: boolean;
    message: string;
}
