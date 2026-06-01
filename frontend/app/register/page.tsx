import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const siteKey = (import.meta as any).env.VITE_RECAPTCHA_SITE_KEY;

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!captchaToken) {
      alert("Please complete the CAPTCHA");
      return;
    }

    await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        captchaToken,
      }),
    });

    alert("Registered Successfully");
    navigate("/login");
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <ReCAPTCHA
        sitekey={siteKey}
        onChange={(token) => setCaptchaToken(token)}
      />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}