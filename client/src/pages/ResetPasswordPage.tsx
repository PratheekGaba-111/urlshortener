import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { resetPassword, validatePasswordReset } from "../services/auth.service";
import "../styles/Auth.css";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "success" | "error">("checking");
  const [message, setMessage] = useState("Checking your reset link...");

  const isValidPassword = useMemo(() => password.length >= 6, [password]);
  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("The reset link is missing.");
        return;
      }

      const response = await validatePasswordReset(token);
      if (response?.success) {
        setStatus("ready");
        setMessage("Choose a new password for your account.");
      } else {
        setStatus("error");
        setMessage(response?.message ?? "The reset link is invalid or has expired.");
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token || !isValidPassword || !passwordsMatch) {
      setStatus("error");
      setMessage("Please make sure your password is at least 6 characters and both fields match.");
      return;
    }

    const response = await resetPassword(token, password);
    if (response?.success) {
      setStatus("success");
      setMessage(response.message);
      window.setTimeout(() => navigate("/login"), 1600);
    } else {
      setStatus("error");
      setMessage(response?.message ?? "Unable to update your password right now.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-blob auth-blob--one" />
      <div className="auth-blob auth-blob--two" />
      <section className="auth-shell auth-shell--compact" aria-labelledby="reset-title">
        <div className="auth-copy">
          <span className="auth-kicker">Password recovery</span>
          <h1 id="reset-title">
            Reset your <span className="gradient-text">access</span>
          </h1>
          <p>Pick a fresh password and return to your dashboard in seconds.</p>
        </div>

        <div className="login-container">
          <form className="login-form auth-card" onSubmit={handleSubmit}>
            <div className="auth-card__header">
              <span className="auth-card__badge">Secure update</span>
              <h2>Set a new password</h2>
              <p>{message}</p>
            </div>

            {status !== "checking" && (
              <>
                <label className="field-group" htmlFor="new-password">
                  <span>New password</span>
                  <div className="input-shell">
                    <Lock size={18} aria-hidden="true" />
                    <input
                      id="new-password"
                      type="password"
                      required
                      placeholder="Enter a new password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>
                </label>

                <label className="field-group" htmlFor="confirm-password">
                  <span>Confirm password</span>
                  <div className="input-shell">
                    <ShieldCheck size={18} aria-hidden="true" />
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </div>
                </label>
              </>
            )}

            {status === "ready" && (
              <button type="submit" className="auth-submit">
                Update password
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            )}

            {status === "success" && (
              <p className="success-message" role="status">
                Password updated successfully. Redirecting to login...
              </p>
            )}

            {status === "error" && (
              <p className="error-message" role="alert">
                {message}
              </p>
            )}

            <p className="auth-switch auth-switch--compact">
              <Link to="/login">Back to sign in</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ResetPasswordPage;
