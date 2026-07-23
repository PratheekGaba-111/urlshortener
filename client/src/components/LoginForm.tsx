import { useState } from "react";
import { login, requestPasswordReset } from "../services/auth.service";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import type { LoginDetails } from "../types/auth.types";
import { ArrowRight, Lock, Mail, Send } from "lucide-react";

const LoginForm = () => {

  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const [valid, setValid] = useState<boolean>(true);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackTone, setFeedbackTone] = useState<"success" | "error">("success");

  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "forgot") {
      const response = await requestPasswordReset(resetEmail);
      if (response?.success) {
        setFeedbackTone("success");
        setFeedback(response.message);
      } else {
        setFeedbackTone("error");
        setFeedback("Unable to send a reset email right now.");
      }
      return;
    }

    const response = await login(loginDetails);

    if (response) {
      localStorage.setItem("token", response.token);
      navigate("/home");
    } else {
      setValid(false);
      setFeedbackTone("error");
      setFeedback("Invalid credentials. Please check your email and password.");
    }
  };


  return (
    <div className="login-container">
      <form className="login-form auth-card" onSubmit={handleSubmit}>
        <div className="auth-card__header">
          <span className="auth-card__badge">Secure access</span>
          <h2>{mode === "login" ? "Sign in" : "Recover access"}</h2>
          <p>{mode === "login" ? "Enter your credentials to continue to Shortify." : "We’ll send a reset link to the email on your account."}</p>
        </div>

        {feedback && (
          <p className={feedbackTone === "error" ? "error-message" : "success-message"} role="status">
            {feedback}
          </p>
        )}

        {!valid && mode === "login" && (
          <p className="error-message" role="alert">
            Invalid credentials. Please check your email and password.
          </p>
        )}

        {mode === "login" ? (
          <>
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
          </>
        ) : (
          <label className="field-group" htmlFor="reset-email">
            <span>Email</span>
            <div className="input-shell">
              <Mail size={18} aria-hidden="true" />
              <input
                id="reset-email"
                type="email"
                placeholder="you@company.com"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
          </label>
        )}

        <button type="submit" className="auth-submit">
          {mode === "login" ? "Login" : "Send reset link"}
          {mode === "login" ? <ArrowRight size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
        </button>

        <button type="button" className="text-link" onClick={() => {
          setMode((current) => (current === "login" ? "forgot" : "login"));
          setFeedback("");
          setFeedbackTone("success");
        }}>
          {mode === "login" ? "Forgot password?" : "Back to sign in"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
