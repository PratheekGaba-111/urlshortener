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
    _id : string, 
    name : string, 
    email : string
}
export interface LoginResponse{
    token : string, 
    user : User
}
export interface RegisterResponse{
    message : string,
    token : string, 
    user : User
}