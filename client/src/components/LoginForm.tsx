import { useState } from "react";
import { login } from "../services/auth.service";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import type { LoginDetails } from "../types/auth.types";

const LoginForm = () => {

    const [loginDetails, setLoginDetails] = useState<LoginDetails>({
        email: "",
        password: ""
    });

    const [valid, setValid] = useState<boolean>(true);

    const navigate = useNavigate();


    const handleSubmit = async(e: React.FormEvent) => {
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
        <div className="login-container">

            {!valid && (
                <p className="error-message">
                    Invalid Credentials
                </p>
            )}


            <form 
                className="login-form"
                onSubmit={handleSubmit}
            >

                <h2>
                    Login
                </h2>


                <input
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(e) => {
                        setLoginDetails((prev) => ({
                            ...prev,
                            email: e.target.value
                        }))
                    }}
                />


                <input 
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => {
                        setLoginDetails((prev) => ({
                            ...prev,
                            password: e.target.value
                        }))
                    }}
                />


                <button type="submit">
                    Login
                </button>


            </form>

        </div>
    )
}

export default LoginForm;