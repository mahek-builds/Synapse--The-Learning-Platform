import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaSiteKey = (import.meta as ImportMeta & {
  env: { VITE_RECAPTCHA_SITE_KEY: string };
}).env.VITE_RECAPTCHA_SITE_KEY;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!captchaToken) {
      alert("Please complete the CAPTCHA");
      return;
    }

    // login code
    console.log("Login successful");
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ReCAPTCHA
          sitekey={recaptchaSiteKey}
          onChange={(token) => setCaptchaToken(token)}
        />

        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <hr />

      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (!captchaToken) {
            alert("Please complete the CAPTCHA first");
            return;
          }

          console.log("Google Login Success", credentialResponse);
          navigate("/dashboard");
        }}
        onError={() => {
          console.log("Google Login Failed");
        }}
      />
    </div>
  );
}
