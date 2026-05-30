import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Register</h2>
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
      <button onClick={handleRegister} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
        Register
      </button>
    </div>
  );
}
