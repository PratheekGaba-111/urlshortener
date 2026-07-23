import { useState } from "react"
import {login} from "../services/auth.service";

import { useNavigate } from "react-router-dom";
import type { LoginDetails } from "../types/auth.types";
const LoginForm = () => {
    const [loginDetails, setLoginDetails] = useState<LoginDetails>({email : "", password : ""});
    const [valid, setValid] = useState<Boolean>(false);
    const navigate = useNavigate();
    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault();
        const response = await login(loginDetails);
        if(response){
            localStorage.setItem("token", response.token);
            navigate("/home");
        }
        else{
            setValid(false);
        }
    }
    return (
        <>  
            {!valid && <p>Invalid Credentials</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    required
                    onChange={(e) => {setLoginDetails((prev) => ({
                        ...prev, email : e.target.value
                    }))}}
                />
                <input 
                    type="password"
                    required
                    onChange={(e) => {setLoginDetails((prev) => ({
                        ...prev, password : e.target.value
                    }))}}
                />

                <button type="submit">
                    Login
                </button>
            </form>
        </>
    )
}
export default LoginForm;