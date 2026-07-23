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
            Open your Shortify workspace and start turning long URLs into clean,
            measurable launch assets.
          </p>
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
