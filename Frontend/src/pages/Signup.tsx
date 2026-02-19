import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/users/register", form);
      alert("Registration successful");
      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h2 className="text-3xl font-bold font-display text-foreground">Create Account</h2>
          <p className="text-muted-foreground mt-2">Start your learning journey</p>
        </div>

        <div className="space-y-4">
          <input
            className="auth-input"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <button className="btn-primary" onClick={handleSignup}>
            Signup
          </button>
        </div>

        <p className="text-center text-muted-foreground mt-6">
          Already have account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;