import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Quiz = () => {
  const { user } = useContext(AuthContext);

  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    API.get("/topics").then((res) => setTopics(res.data));
  }, []);

  const fetchQuestions = async (topicId: string) => {
    setSelectedTopic(topicId);
    setAnswers({});
    setResult(null);

    const res = await API.get(`/quiz/${topicId}`);
    setQuestions(res.data);
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedTopic) {
      alert("Please select a topic");
      return;
    }

    const formattedAnswers = Object.keys(answers).map((qId) => ({
      questionId: qId,
      selectedOption: answers[qId],
    }));

    const res = await API.post("/quiz/submit", {
      topicId: selectedTopic,
      answers: formattedAnswers,
    });
    

    setResult(res.data);
  };

  return (
    <div className="page-container">
      <h2 className="text-3xl font-bold font-display text-foreground mb-6">🧠 Attempt Quiz</h2>

      <div className="section-card mb-8">
        <label className="block text-sm font-medium text-muted-foreground mb-2">Select a Topic</label>
        <select
          className="auth-input"
          onChange={(e) => fetchQuestions(e.target.value)}
        >
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic._id} value={topic._id}>
              {topic.topicName}
            </option>
          ))}
        </select>
      </div>

      {questions.map((q, index) => (
        <div key={q._id} className="section-card mb-4">
          <h4 className="text-lg font-semibold text-foreground mb-4">
            {index + 1}. {q.questionText}
          </h4>

          <div className="space-y-2">
            {q.options.map((opt: string) => (
              <label
                key={opt}
                className={`quiz-option ${answers[q._id] === opt ? "quiz-option-selected" : ""}`}
              >
                <input
                  type="radio"
                  name={q._id}
                  value={opt}
                  checked={answers[q._id] === opt}
                  onChange={() => handleOptionSelect(q._id, opt)}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-foreground">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {questions.length > 0 && (
        <button className="btn-primary w-auto mt-4" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}

      {result && (
        <div className="section-card mt-8 border-l-4 border-l-primary">
          <h3 className="text-2xl font-bold font-display text-foreground">
            Score: {result.score}%
          </h3>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="badge-info">Level: {result.currentLevel}</span>
            <span className="badge-warning">Difficulty: {result.difficultyAdjustment}</span>
          </div>
          <p className="text-muted-foreground mt-4">{result.currentTopicRecommendation?.message}</p>

          {result.currentTopicRecommendation?.weakAreas?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-destructive uppercase tracking-wide mb-2">Weak Areas</h4>
              {result.currentTopicRecommendation.weakAreas.map((area: any, i: number) => (
                <p key={i} className="text-muted-foreground ml-2">• {area.questionText}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
