import { useState } from "react";
import type { RegisterDetails } from "../types/auth.types";
import { register } from "../services/auth.service";
import "./RegisterForm.css";

const RegisterForm = () => {

    const [registerDetails, setRegisterDetails] = useState<RegisterDetails>({
        email: "",
        name: "",
        password: ""
    });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const response = await register(registerDetails);

            if(!response){
                alert("Registration Failed");
                return;
            }

            alert(response.message);

        } catch(error) {
            console.error(error);
        };
    }


    return (
        <div className="register-container">

            <form 
                className="register-form"
                onSubmit={handleSubmit}
            >

                <h2>
                    Create Account
                </h2>


                <input 
                    type="text"
                    required
                    placeholder="Name"
                    onChange={(e) => {
                        setRegisterDetails((prev) => ({
                            ...prev,
                            name: e.target.value
                        }))
                    }}
                />


                <input 
                    type="email"
                    required
                    placeholder="Email"
                    onChange={(e) => {
                        setRegisterDetails((prev) => ({
                            ...prev,
                            email: e.target.value
                        }))
                    }}
                />


                <input 
                    type="password"
                    required
                    placeholder="Password"
                    onChange={(e) => {
                        setRegisterDetails((prev) => ({
                            ...prev,
                            password: e.target.value
                        }))
                    }}
                />


                <button type="submit">
                    Register
                </button>


            </form>

        </div>
    )

}

export default RegisterForm;