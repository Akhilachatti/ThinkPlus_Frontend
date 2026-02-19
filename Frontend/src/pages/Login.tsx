import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState<Record<string, string>>({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/users/login", form);
      login(res.data); // ✅ Add this line
      navigate("/home");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-3xl font-bold font-display text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Sign in to continue learning</p>
        </div>

        <div className="space-y-4">
          <input
            className="auth-input"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="btn-primary" onClick={handleLogin}>
            Login
          </button>
        </div>

        <p className="text-center text-muted-foreground mt-6">
          No account?{" "}
          <a href="/signup" className="text-primary font-semibold hover:underline">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;