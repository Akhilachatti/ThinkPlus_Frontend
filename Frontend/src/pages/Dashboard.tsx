import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch Recommendation
        const rec = await API.get("/recommendation");
        setData(rec.data);

        // Fetch progress for chart
        const prog = await API.get("/progress");
        setProgress(prog.data.attempts || []);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };

    fetchData();
  }, [user]);

  // Loading UI
  if (!data)
    return (
      <div className="page-container flex items-center justify-center">
        <div className="section-card text-center">
          <div className="animate-pulse text-4xl mb-3">📊</div>
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold font-display text-foreground mb-8">
        📊 Overall Analysis
      </h2>

      {/* Level + Difficulty cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground uppercase mb-1">Level</p>
          <p className="text-3xl font-bold text-primary">{data.currentLevel}</p>
        </div>

        <div className="stat-card">
          <p className="text-sm text-muted-foreground uppercase mb-1">Difficulty</p>
          <p className="text-3xl font-bold text-secondary">
            {data.difficultyAdjustment}
          </p>
        </div>
      </div>



      {/* Weak Topics */}
      <div className="section-card">
        <h3 className="text-xl font-bold mb-4">⚠️ Weak Topics</h3>

        {data?.overallAnalysis?.weakTopics?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.overallAnalysis.weakTopics.map((t: string) => (
              <span key={t} className="badge-warning">
                {t}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No weak topics</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
