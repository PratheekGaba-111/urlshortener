import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
const Login = () => {
    return (
        <>
            <div>
                <h1>Login</h1>
                <LoginForm />
            </div>
            <p>
                Don't have an account?{" "}
                <Link to="/register">Register</Link>
            </p>
        </>
    );
};

export default Login;