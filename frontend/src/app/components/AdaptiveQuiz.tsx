import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;
}

const questionBank: Record<number, Question[]> = {
  1: [
    {
      id: 'easy-1',
      question: 'What does API stand for?',
      options: ['Application Programming Interface', 'Advanced Programming Integration', 'Automated Process Interface', 'Application Process Integration'],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 'easy-2',
      question: 'What is the main purpose of LangGraph?',
      options: ['Building conversational AI', 'Creating graphs', 'Data visualization', 'Image processing'],
      correctAnswer: 0,
      difficulty: 1,
    },
  ],
  2: [
    {
      id: 'medium-1',
      question: 'In LangGraph, what does the Planner Agent do?',
      options: ['Executes code', 'Decides workflow path and agent coordination', 'Stores data', 'Renders UI'],
      correctAnswer: 1,
      difficulty: 2,
    },
    {
      id: 'medium-2',
      question: 'Which database is best suited for handling structured relational data?',
      options: ['MongoDB', 'Redis', 'PostgreSQL', 'Cassandra'],
      correctAnswer: 2,
      difficulty: 2,
    },
  ],
  3: [
    {
      id: 'hard-1',
      question: 'In a multi-agent system, how do agents communicate state changes?',
      options: ['Direct function calls', 'Shared state management and message passing', 'Global variables', 'Database queries'],
      correctAnswer: 1,
      difficulty: 3,
    },
    {
      id: 'hard-2',
      question: 'What is the primary advantage of using Celery with FastAPI?',
      options: ['Faster database queries', 'Asynchronous task processing and background jobs', 'Better UI rendering', 'Enhanced security'],
      correctAnswer: 1,
      difficulty: 3,
    },
  ],
};

export function AdaptiveQuiz({ topic, onClose }: { topic: string; onClose: () => void }) {
  const [currentDifficulty, setCurrentDifficulty] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const questions = questionBank[currentDifficulty];
  const currentQuestion = questions[currentQuestionIndex % questions.length];

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (!showFeedback) {
      setShowFeedback(true);
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

      if (isCorrect) {
        setScore(score + 1);
        // Increase difficulty if correct
        if (currentDifficulty < 3) {
          setCurrentDifficulty(currentDifficulty + 1);
        }
      } else {
        // Decrease difficulty if wrong
        if (currentDifficulty > 1) {
          setCurrentDifficulty(currentDifficulty - 1);
        }
      }

      setAnsweredQuestions(answeredQuestions + 1);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-green-100 text-green-700';
      case 2:
        return 'bg-yellow-100 text-yellow-700';
      case 3:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Intermediate';
      case 3:
        return 'Advanced';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative h-full w-full bg-white">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Adaptive Quiz: {topic}</h2>
              <p className="text-sm text-slate-600">Questions adapt based on your performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`rounded-full px-4 py-2 text-sm font-medium ${getDifficultyColor(currentDifficulty)}`}>
                {getDifficultyLabel(currentDifficulty)}
              </div>
              <div className="rounded-lg bg-slate-100 px-4 py-2">
                <p className="text-sm text-slate-600">Score</p>
                <p className="text-xl font-bold text-slate-800">
                  {score}/{answeredQuestions}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
              >
                <X className="size-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="flex h-[calc(100%-80px)] items-center justify-center p-8">
          <div className="w-full max-w-3xl">
            {/* Progress */}
            <div className="mb-8 text-center">
              <p className="text-sm font-medium text-slate-600">Question {answeredQuestions + 1}</p>
              <div className="mx-auto mt-2 h-1 w-32 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${((answeredQuestions % 10) / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <h3 className="mb-8 text-center text-2xl font-semibold text-slate-800">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="mb-8 space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showCorrect = showFeedback && isCorrect;
                const showWrong = showFeedback && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback}
                    className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showWrong
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 items-center justify-center rounded-full border-2 font-semibold ${
                          showCorrect
                            ? 'border-green-500 bg-green-500 text-white'
                            : showWrong
                            ? 'border-red-500 bg-red-500 text-white'
                            : isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-slate-800">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`mb-6 rounded-xl p-5 ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                <p className="font-semibold">
                  {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="mt-1 text-sm">
                  {selectedAnswer === currentQuestion.correctAnswer
                    ? 'Great job! Moving to a harder question.'
                    : currentDifficulty > 1
                    ? 'No problem! Adjusting to an easier difficulty.'
                    : 'Keep trying! The difficulty will stay the same.'}
                </p>
              </div>
            )}

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedAnswer === null && !showFeedback}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showFeedback ? 'Next Question' : 'Submit'}
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
