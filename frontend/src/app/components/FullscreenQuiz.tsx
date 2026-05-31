import { useState, useEffect } from 'react';
import { ArrowRight, Clock, Trophy, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;
}

const questionBank: Record<number, Question[]> = {
  1: [
    { id: 'easy-1', question: 'What does API stand for?', options: ['Application Programming Interface', 'Advanced Programming Integration', 'Automated Process Interface', 'Application Process Integration'], correctAnswer: 0, difficulty: 1 },
    { id: 'easy-2', question: 'What is the main purpose of React?', options: ['Backend development', 'Building user interfaces', 'Database management', 'Server hosting'], correctAnswer: 1, difficulty: 1 },
  ],
  2: [
    { id: 'medium-1', question: 'What is the purpose of useEffect() in React?', options: ['Handle side effects', 'Create components', 'Manage routing', 'Style elements'], correctAnswer: 0, difficulty: 2 },
    { id: 'medium-2', question: 'Which HTTP method is used to update a resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctAnswer: 2, difficulty: 2 },
  ],
  3: [
    { id: 'hard-1', question: 'What is the time complexity of Quick Sort in average case?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctAnswer: 1, difficulty: 3 },
    { id: 'hard-2', question: 'In React, what is the Virtual DOM?', options: ['A real DOM element', 'A lightweight copy of the actual DOM', 'A database', 'A CSS framework'], correctAnswer: 1, difficulty: 3 },
  ],
};

export function FullscreenQuiz({ topic, onClose }: { topic: string; onClose: () => void }) {
  const [currentDifficulty, setCurrentDifficulty] = useState(2);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [showResults, setShowResults] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<boolean[]>([]);

  const totalQuestions = 15;
  const questions = questionBank[currentDifficulty];
  const currentQuestion = questions[currentQuestionIndex % questions.length];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswerHistory([...answerHistory, isCorrect]);

    if (isCorrect) {
      setScore(score + 1);
      if (currentDifficulty < 3) setCurrentDifficulty(currentDifficulty + 1);
    } else {
      if (currentDifficulty > 1) setCurrentDifficulty(currentDifficulty - 1);
    }

    setAnsweredQuestions(answeredQuestions + 1);
    setIsAnswerLocked(true);

    if (answeredQuestions + 1 >= totalQuestions) {
      setTimeout(() => setShowResults(true), 1500);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswerLocked(false);
      }, 1500);
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'from-[#22C55E] to-[#16A34A]';
      case 2: return 'from-[#F59E0B] to-[#D97706]';
      case 3: return 'from-[#EF4444] to-[#DC2626]';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  if (showResults) {
    const percentage = Math.round((score / answeredQuestions) * 100);
    const strengths = ['React Hooks', 'API Design', 'State Management'];
    const weaknesses = ['Performance Optimization', 'Advanced Patterns'];

    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-[#0F172A]">
        <div className="min-h-screen px-8 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706]">
                  <Trophy className="size-10 text-white" />
                </div>
              </div>
              <h1 className="mb-2 text-4xl font-bold text-[#F8FAFC]">Assessment Complete!</h1>
              <p className="text-slate-400">Great job completing the {topic} assessment</p>
            </div>

            {/* Score Cards */}
            <div className="mb-8 grid grid-cols-4 gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 text-center backdrop-blur-xl">
                <p className="mb-2 text-sm text-slate-400">Overall Score</p>
                <p className="text-4xl font-bold text-[#F8FAFC]">{percentage}%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 text-center backdrop-blur-xl">
                <p className="mb-2 text-sm text-slate-400">Correct Answers</p>
                <p className="text-4xl font-bold text-[#22C55E]">{score}/{answeredQuestions}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 text-center backdrop-blur-xl">
                <p className="mb-2 text-sm text-slate-400">Time Taken</p>
                <p className="text-4xl font-bold text-[#7C3AED]">{formatTime(600 - timeRemaining)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 text-center backdrop-blur-xl">
                <p className="mb-2 text-sm text-slate-400">Rank</p>
                <p className="text-4xl font-bold text-[#F59E0B]">Top 15%</p>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="mb-8 grid grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 backdrop-blur-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#F8FAFC]">
                  <TrendingUp className="size-5 text-[#22C55E]" />
                  Strengths
                </h3>
                <div className="space-y-2">
                  {strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="size-1.5 rounded-full bg-[#22C55E]" />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Areas */}
              <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 backdrop-blur-xl">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#F8FAFC]">
                  <TrendingDown className="size-5 text-[#EF4444]" />
                  Areas to Improve
                </h3>
                <div className="space-y-2">
                  {weaknesses.map((weakness, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="size-1.5 rounded-full bg-[#EF4444]" />
                      {weakness}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 backdrop-blur-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#F8FAFC]">
                <Target className="size-5 text-[#7C3AED]" />
                Recommended Learning Path
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {['Advanced Hooks', 'Performance', 'Testing', 'Best Practices'].map((item, idx) => (
                  <div key={idx} className="rounded-lg bg-[#0F172A]/50 p-3 text-center">
                    <p className="text-sm text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="rounded-xl border border-white/20 bg-[#1E293B] px-8 py-3 font-medium text-[#F8FAFC] transition-colors hover:bg-[#334155]"
              >
                Back to Chat
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-8 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-[#4F46E5]/20"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0F172A] px-8 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#F8FAFC]">{topic} Assessment</h1>
            <p className="text-sm text-slate-400">
              Question {answeredQuestions + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`rounded-xl bg-gradient-to-r ${getDifficultyColor(currentDifficulty)} px-4 py-2`}>
              <p className="text-sm font-medium text-white">{getDifficultyLabel(currentDifficulty)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1E293B] px-4 py-2">
              <Clock className="size-4 text-slate-400" />
              <span className="font-mono text-sm text-[#F8FAFC]">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-[#1E293B]">
        <div
          className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300"
          style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Area */}
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-[#F8FAFC]">{currentQuestion.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showFeedback = isAnswerLocked;

              return (
                <button
                  key={index}
                  onClick={() => !isAnswerLocked && setSelectedAnswer(index)}
                  disabled={isAnswerLocked}
                  className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                    showFeedback && isCorrect
                      ? 'border-[#22C55E] bg-[#22C55E]/10'
                      : showFeedback && isSelected && !isCorrect
                      ? 'border-[#EF4444] bg-[#EF4444]/10'
                      : isSelected
                      ? 'border-[#4F46E5] bg-[#4F46E5]/10'
                      : 'border-white/10 bg-[#1E293B]/50 hover:border-white/20 hover:bg-[#1E293B]'
                  } ${isAnswerLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl border-2 font-semibold ${
                        showFeedback && isCorrect
                          ? 'border-[#22C55E] bg-[#22C55E] text-white'
                          : showFeedback && isSelected && !isCorrect
                          ? 'border-[#EF4444] bg-[#EF4444] text-white'
                          : isSelected
                          ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                          : 'border-white/20 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-[#F8FAFC]">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Answer Locked Message */}
          {isAnswerLocked && (
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-[#22C55E]">Answer Locked ✓</p>
            </div>
          )}

          {/* Next Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null || isAnswerLocked}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:shadow-[#4F46E5]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {answeredQuestions + 1 >= totalQuestions ? 'Submit' : 'Next Question'}
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
