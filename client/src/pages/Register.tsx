import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
const Register = () => {
    return (
        <>
            <div>
                <h1>Register</h1>
                <RegisterForm />
            </div>
            <p>
                Already have an account?{" "}
                <Link to="/login">Login</Link>
            </p>
        </>
    );
};

export default Register;