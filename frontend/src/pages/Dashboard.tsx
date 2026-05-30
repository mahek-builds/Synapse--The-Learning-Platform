import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data: User) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      {user && <p>Welcome {user.email}</p>}
      <button onClick={logout} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
}
