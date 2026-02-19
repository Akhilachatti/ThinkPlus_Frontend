import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    API.get("/progress").then((res) => setProgress(res.data));
    API.get("/recommendation").then((res) => setRecommendation(res.data));
  }, []);

  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold font-display text-foreground">
        Welcome, {user?.name} 👋
      </h2>

      {/* Quick Stats */}
      {progress && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Total Attempts</p>
            <p className="text-4xl font-bold font-display text-foreground">{progress.totalAttempts}</p>
          </div>

          <div className="stat-card">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Average Score</p>
            <p className="text-4xl font-bold font-display text-primary">{progress.averageScore.toFixed(2)}%</p>
          </div>

          {recommendation && (
            <div className="stat-card">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Current Level</p>
              <p className="text-4xl font-bold font-display text-secondary">{recommendation.currentLevel}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-10 flex flex-wrap gap-4">
        <button className="btn-primary w-auto" onClick={() => navigate("/quiz")}>
          🧠 Attempt Quiz
        </button>
        <button className="btn-outline w-auto" onClick={() => navigate("/dashboard")}>
          📊 Dashboard
        </button>
        <button className="btn-secondary w-auto" onClick={() => navigate("/recommendation")}>
          💡 Recommendation
        </button>
      </div>
    </div>
  );
};

export default Home;
