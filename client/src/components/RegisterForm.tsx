import { useState } from "react";
import type { RegisterDetails } from "../types/auth.types";
import { register } from "../services/auth.service";
import "./RegisterForm.css";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

const RegisterForm = () => {

  const [registerDetails, setRegisterDetails] = useState<RegisterDetails>({
    email: "",
    name: "",
    password: "",
  });

  const [message, setMessage] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await register(registerDetails);

      if (!response) {
        setHasError(true);
        setMessage("Registration failed. Please try again.");
        return;
      }

      setHasError(false);
      setMessage(response.message);
    } catch (error) {
      console.error(error);
      setHasError(true);
      setMessage("Something went wrong. Please try again.");
    }
  };


  return (
    <div className="register-container">
      <form className="register-form auth-card" onSubmit={handleSubmit}>
        <div className="auth-card__header">
          <span className="auth-card__badge">New workspace</span>
          <h2>Create account</h2>
          <p>Set up your Shortify profile in a few seconds.</p>
        </div>

        {message && (
          <p className={hasError ? "error-message" : "success-message"} role="status">
            {message}
          </p>
        )}

        <label className="field-group" htmlFor="register-name">
          <span>Name</span>
          <div className="input-shell">
            <User size={18} aria-hidden="true" />
            <input
              id="register-name"
              type="text"
              required
              placeholder="Your name"
              value={registerDetails.name}
              onChange={(e) => {
                setRegisterDetails((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
          </div>
        </label>

        <label className="field-group" htmlFor="register-email">
          <span>Email</span>
          <div className="input-shell">
            <Mail size={18} aria-hidden="true" />
            <input
              id="register-email"
              type="email"
              required
              placeholder="you@company.com"
              value={registerDetails.email}
              onChange={(e) => {
                setRegisterDetails((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
            />
          </div>
        </label>

        <label className="field-group" htmlFor="register-password">
          <span>Password</span>
          <div className="input-shell">
            <Lock size={18} aria-hidden="true" />
            <input
              id="register-password"
              type="password"
              required
              placeholder="Create a strong password"
              value={registerDetails.password}
              onChange={(e) => {
                setRegisterDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
        </label>

        <button type="submit" className="auth-submit">
          Register
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
