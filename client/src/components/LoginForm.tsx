import { useState } from "react";
import { login } from "../services/auth.service";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import type { LoginDetails } from "../types/auth.types";
import { ArrowRight, Lock, Mail } from "lucide-react";

const LoginForm = () => {

  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const [valid, setValid] = useState<boolean>(true);

  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await login(loginDetails);

    if (response) {
      localStorage.setItem("token", response.token);
      navigate("/home");
    } else {
      setValid(false);
    }
  };


  return (
    <div className="login-container">
      <form className="login-form auth-card" onSubmit={handleSubmit}>
        <div className="auth-card__header">
          <span className="auth-card__badge">Secure access</span>
          <h2>Sign in</h2>
          <p>Enter your credentials to continue to Shortify.</p>
        </div>

        {!valid && (
          <p className="error-message" role="alert">
            Invalid credentials. Please check your email and password.
          </p>
        )}

        <label className="field-group" htmlFor="login-email">
          <span>Email</span>
          <div className="input-shell">
            <Mail size={18} aria-hidden="true" />
            <input
              id="login-email"
              type="email"
              placeholder="you@company.com"
              required
              value={loginDetails.email}
              onChange={(e) => {
                setLoginDetails((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
            />
          </div>
        </label>

        <label className="field-group" htmlFor="login-password">
          <span>Password</span>
          <div className="input-shell">
            <Lock size={18} aria-hidden="true" />
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              required
              value={loginDetails.password}
              onChange={(e) => {
                setLoginDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
        </label>

        <button type="submit" className="auth-submit">
          Login
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
