import { useState } from "react"
import Login from "../pages/Login"
import checkDetails from "../services/user.service";
import Home from "../pages/Home";
import { useNavigate } from "react-router-dom";
import type { LoginDetails } from "../types/user";
const LoginForm = () => {
    const [loginDetails, setLoginDetails] = useState<LoginDetails>({email : "", password : ""});
    const [valid, setValid] = useState<Boolean>(false);
    const navigate = useNavigate();
    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault();
        const response = await checkDetails(loginDetails);
        if(response){
            localStorage.setIem("token", response.token);
            navigate("/");
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