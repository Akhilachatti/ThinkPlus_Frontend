import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function RecommendationPage() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
  
    const fetchRecommendation = async () => {
      try {
        const res = await API.get("/recommendation"); // 🔥 no userId
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchRecommendation();
  }, [user]);
  

  const fetchRecommendation = async () => {
    try {
      const response = await API.get("/recommendation");
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  

  if (!data)
    return (
      <div className="page-container flex items-center justify-center">
        <div className="section-card text-center">
          <div className="animate-pulse text-4xl mb-3">💡</div>
          <p className="text-muted-foreground font-medium">Loading recommendation...</p>
        </div>
      </div>
    );

  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold font-display text-foreground mb-2">💡 Learning Recommendation</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 mb-8">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Current Level</p>
          <p className="text-3xl font-bold font-display text-primary">{data.currentLevel}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Difficulty Adjustment</p>
          <p className="text-3xl font-bold font-display text-secondary">{data.difficultyAdjustment}</p>
        </div>
      </div>

      <div className="divider" />

      {/* Current Topic Feedback */}
      <div className="section-card mb-6">
        <h3 className="text-xl font-bold font-display text-foreground mb-3">📌 Current Topic Feedback</h3>
        <p className="text-muted-foreground">{data.currentTopicRecommendation.message}</p>

        {data.currentTopicRecommendation.weakAreas.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-destructive uppercase tracking-wide mb-2">Weak Areas</h4>
            {data.currentTopicRecommendation.weakAreas.map((area: any, index: number) => (
              <p key={index} className="text-muted-foreground ml-2">• {area.questionText}</p>
            ))}
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Overall Analysis */}
      <div className="section-card">
        <h3 className="text-xl font-bold font-display text-foreground mb-4">📊 Overall Analysis</h3>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-success uppercase tracking-wide mb-2">Strong Topics</h4>
          {data.overallAnalysis.strongTopics.length === 0 ? (
            <p className="text-muted-foreground ml-2">No strong topics yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.overallAnalysis.strongTopics.map((topic: string, index: number) => (
                <span key={index} className="badge-success">{topic}</span>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-destructive uppercase tracking-wide mb-2">Weak Topics</h4>
          {data.overallAnalysis.weakTopics.length === 0 ? (
            <p className="text-muted-foreground ml-2">No weak topics</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.overallAnalysis.weakTopics.map((topic: string, index: number) => (
                <span key={index} className="badge-warning">{topic}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecommendationPage;
