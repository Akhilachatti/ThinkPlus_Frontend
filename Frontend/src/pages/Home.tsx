import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  // Calculate stats from progress data
  const getTotalAttempts = () => progress?.attempts?.length || 0;
  
  const getAverageScore = () => {
    if (!progress?.attempts || progress.attempts.length === 0) return 0;
    const total = progress.attempts.reduce((sum: number, attempt: any) => sum + attempt.score, 0);
    return (total / progress.attempts.length).toFixed(2);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, recommendationRes] = await Promise.all([
          API.get("/progress"),
          API.get("/recommendation")
        ]);
        setProgress(progressRes.data);
        setRecommendation(recommendationRes.data);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };
    fetchData();
  }, []);

  // Log data for debugging
  useEffect(() => {
    if (progress || recommendation) {
      console.log("Progress:", progress);
      console.log("Recommendation:", recommendation);
    }
  }, [progress, recommendation]);

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
            <p className="text-4xl font-bold font-display text-foreground">{getTotalAttempts()}</p>
          </div>

          <div className="stat-card">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Average Score</p>
            <p className="text-4xl font-bold font-display text-primary">{getAverageScore()}%</p>
          </div>

          {recommendation && (
            <div className="stat-card">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Current Level</p>
              <p className="text-4xl font-bold font-display text-secondary">{recommendation?.currentLevel}</p>
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