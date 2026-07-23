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
            Sign in to create polished short links, monitor traction, and keep your campaigns moving.
          </p>
          <div className="auth-copy__stats">
            <div className="auth-copy__stat">
              <strong>4x faster</strong>
              <span>Launch links in seconds</span>
            </div>
            <div className="auth-copy__stat">
              <strong>Live signal</strong>
              <span>Watch clicks roll in</span>
            </div>
            <div className="auth-copy__stat">
              <strong>Secure by design</strong>
              <span>Protected accounts and recovery</span>
            </div>
          </div>
        </div>
        <LoginForm />
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </section>
      <section className="auth-showcase" aria-label="Why teams use Shortify">
        <div className="auth-showcase__card">
          <span>⚡</span>
          <h3>Launch faster</h3>
          <p>Turn long campaigns into polished links in seconds.</p>
        </div>
        <div className="auth-showcase__card">
          <span>📈</span>
          <h3>Track momentum</h3>
          <p>See click trends and know what is resonating.</p>
        </div>
        <div className="auth-showcase__card">
          <span>🔐</span>
          <h3>Stay secure</h3>
          <p>Email verification and password recovery keep your workspace protected.</p>
        </div>
      </section>
    </main>
  );
};

export default Login;
