import axios  from "axios";

import { type LoginResponse, type LoginDetails } from "../types/user";


const checkDetails = async (loginDetails : LoginDetails) => {
    try{
        const response = await axios.post<LoginResponse>("http://localhost:3333/api/auth/login", loginDetails);
        return response.data; 
    }catch(error){
        return null;
    }
};
export default checkDetails;