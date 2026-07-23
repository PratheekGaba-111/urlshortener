import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { verifyEmail } from "../services/auth.service";

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setLoading(false);
                setSuccess(false);
                setMessage("Invalid verification link.");
                return;
            }

            try {
                const response = await verifyEmail(token);

                setSuccess(true);
                setMessage(response.message);
            } catch (error: any) {
                setSuccess(false);
                setMessage(
                    error.response?.data?.message ??
                    "Email verification failed."
                );
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token]);

    if (loading) {
        return (
            <div className="verify-email-page">
                <h1>🔄 Verifying your email...</h1>
                <p>Please wait while we verify your account.</p>
            </div>
        );
    }

    return (
        <div className="verify-email-page">
            <h1>
                {success
                    ? "✅ Email Verified Successfully!"
                    : "❌ Verification Failed"}
            </h1>

            <p>{message}</p>

            <button onClick={() => navigate("/login")}>
                Go to Login
            </button>
        </div>
    );
};

export default VerifyEmail;