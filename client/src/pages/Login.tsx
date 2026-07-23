import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import "../styles/Auth.css";
const Login = () => {
  return (
    <main className="auth-page">
      <div className="auth-blob auth-blob--one" />
      <div className="auth-blob auth-blob--two" />
      <section className="auth-shell" aria-labelledby="login-title">
        <div className="auth-copy">
          <span className="auth-kicker">Shortify cloud</span>
          <h1 id="login-title">
            Welcome back to your <span className="gradient-text">link hub</span>
          </h1>
          <p>
            Sign in to create polished short links, monitor traction, and keep
            your campaigns moving.
          </p>
        </div>
        <LoginForm />
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
