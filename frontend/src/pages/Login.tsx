import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data: LoginResponse = await res.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
        style={{ display: "block", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
        style={{ display: "block", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <button onClick={handleLogin} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
        Login
      </button>
    </div>
  );
}
