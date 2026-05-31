import { useState } from 'react';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  explanation: string;
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the primary purpose of the Planner Agent in LangGraph?',
    options: [
      'To execute API calls',
      'To decide the workflow path and what needs to be generated',
      'To store user data',
      'To render the UI',
    ],
    correctAnswer: 1,
    difficulty: 'Beginner',
    explanation: 'The Planner Agent analyzes user queries and determines which agents should be invoked and in what order.',
  },
  {
    id: '2',
    question: 'Which database is used in the Synapse AI platform?',
    options: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQLite'],
    correctAnswer: 2,
    difficulty: 'Beginner',
    explanation: 'PostgreSQL is chosen for its robustness, ACID compliance, and excellent support for relational data.',
  },
  {
    id: '3',
    question: 'What happens in the adaptive quiz engine when a user answers correctly?',
    options: [
      'Difficulty decreases by 1',
      'Difficulty stays the same',
      'Difficulty increases by 1',
      'Quiz ends immediately',
    ],
    correctAnswer: 2,
    difficulty: 'Intermediate',
    explanation: 'The adaptive engine increases difficulty after correct answers to progressively challenge the learner.',
  },
];

export function QuizInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = sampleQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }

    if (!showResult) {
      setShowResult(true);
      return;
    }

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  const difficultyColors: any = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700',
  };

  if (completed) {
    const percentage = Math.round((score / sampleQuestions.length) * 100);
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 p-8">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-12 text-center shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
              <Trophy className="size-12 text-white" />
            </div>
          </div>
          <h2 className="mb-3 text-3xl font-bold text-slate-800">Quiz Completed! 🎉</h2>
          <p className="mb-8 text-slate-600">Great job on completing the assessment</p>

          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-indigo-50 p-6">
              <p className="mb-1 text-sm text-slate-600">Score</p>
              <p className="text-3xl font-bold text-indigo-600">
                {score}/{sampleQuestions.length}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-6">
              <p className="mb-1 text-sm text-slate-600">Percentage</p>
              <p className="text-3xl font-bold text-purple-600">{percentage}%</p>
            </div>
            <div className="rounded-xl bg-pink-50 p-6">
              <p className="mb-1 text-sm text-slate-600">Next Level</p>
              <p className="text-3xl font-bold text-pink-600">
                {percentage >= 80 ? 'Advanced' : percentage >= 60 ? 'Intermediate' : 'Practice'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-white shadow-lg transition-all hover:shadow-xl mx-auto"
          >
            <RotateCcw className="size-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 to-purple-50 p-8">
      <div className="mx-auto w-full max-w-4xl flex-1">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-800">Adaptive Quiz</h1>
            <p className="text-slate-600">Test your knowledge with AI-generated questions</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`rounded-full px-4 py-2 text-sm font-medium ${difficultyColors[question.difficulty]}`}>
              {question.difficulty}
            </span>
            <div className="rounded-xl bg-white px-6 py-3 shadow-md">
              <p className="text-sm text-slate-600">Progress</p>
              <p className="text-xl font-bold text-slate-800">
                {currentQuestion + 1}/{sampleQuestions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold text-slate-800">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showWrong
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`${showCorrect || showWrong ? 'font-medium' : ''}`}>{option}</span>
                    {showCorrect && <CheckCircle2 className="size-6 text-green-600" />}
                    {showWrong && <XCircle className="size-6 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="mt-6 rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-5">
              <p className="mb-1 text-sm font-medium text-indigo-900">Explanation</p>
              <p className="text-slate-700">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showResult ? (currentQuestion < sampleQuestions.length - 1 ? 'Next Question' : 'View Results') : 'Submit Answer'}
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
