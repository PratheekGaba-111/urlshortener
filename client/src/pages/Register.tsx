import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
  return (
    <main className="auth-page">
      <div className="auth-blob auth-blob--one" />
      <div className="auth-blob auth-blob--two" />
      <section className="auth-shell" aria-labelledby="register-title">
        <div className="auth-copy">
          <span className="auth-kicker">Launch workspace</span>
          <h1 id="register-title">
            Create links that feel <span className="gradient-text">product-grade</span>
          </h1>
          <p>
            Open your Shortify workspace and start turning long URLs into clean, measurable launch assets.
          </p>
          <div className="auth-copy__stats">
            <div className="auth-copy__stat">
              <strong>Fast onboarding</strong>
              <span>Get started in under a minute</span>
            </div>
            <div className="auth-copy__stat">
              <strong>Smart sharing</strong>
              <span>Branded links for every launch</span>
            </div>
            <div className="auth-copy__stat">
              <strong>Built-in trust</strong>
              <span>Verified accounts and recovery</span>
            </div>
          </div>
        </div>
        <RegisterForm />
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
