import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: '1',
    question: 'What is the primary purpose of React hooks?',
    options: [
      'To manage state and side effects in functional components',
      'To replace class components entirely',
      'To improve application performance',
      'To handle routing in React applications',
    ],
    correctAnswer: 0,
  },
  {
    id: '2',
    question: 'Which hook is used to perform side effects in React?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 1,
  },
  {
    id: '3',
    question: 'What does the dependency array in useEffect control?',
    options: [
      'The order of effect execution',
      'When the effect should re-run',
      'Which components can use the effect',
      'The cleanup function timing',
    ],
    correctAnswer: 1,
  },
  {
    id: '4',
    question: 'What is the purpose of useState hook?',
    options: [
      'To fetch data from APIs',
      'To add state to functional components',
      'To optimize rendering performance',
      'To manage global application state',
    ],
    correctAnswer: 1,
  },
  {
    id: '5',
    question: 'When should you use useCallback hook?',
    options: [
      'To memoize expensive calculations',
      'To prevent unnecessary re-renders of child components',
      'To manage component lifecycle',
      'To handle asynchronous operations',
    ],
    correctAnswer: 1,
  },
];

export function FullPageQuiz({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentStep] = selectedAnswer;
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
    }
  };

  if (showResults) {
    const score = answers.reduce((acc, answer, idx) => {
      return answer === questions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <div className="w-full max-w-[720px] text-center">
          <div className="mb-6 text-6xl">🎉</div>
          <h1 className="mb-4 font-serif text-4xl text-[#1A1A1A]">Quiz Complete!</h1>
          <p className="mb-8 text-lg text-[#6B6B6B]">
            You scored <span className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text font-semibold text-transparent">{score}</span> out of {questions.length}
          </p>

          <div className="mb-8 rounded-2xl border border-black/10 bg-[#FAFAF8] p-8">
            <div className="mb-4 bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-7xl font-bold text-transparent">{percentage}%</div>
            <p className="text-[#6B6B6B]">
              {percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-[#6366F1] to-[#EC4899] px-8 py-3 font-medium text-white shadow-lg transition-all hover:opacity-90"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Progress Indicator */}
      <div className="border-b border-black/10 px-6 py-4">
        <div className="mx-auto flex max-w-[720px] items-center justify-center gap-2">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx <= currentStep ? 'bg-gradient-to-r from-[#6366F1] to-[#EC4899]' : 'bg-black/10'
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-sm text-[#6B6B6B]">
          Step {currentStep + 1} of {questions.length}
        </p>
      </div>

      {/* Question Area */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[720px]">
          <h2 className="mb-8 text-center font-serif text-2xl text-[#1A1A1A]">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                  selectedAnswer === idx
                    ? 'border-[#6366F1] bg-[#6366F1]/5'
                    : 'border-black/10 hover:border-black/20 hover:bg-[#FAFAF8]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      selectedAnswer === idx
                        ? 'border-[#6366F1] bg-gradient-to-br from-[#6366F1] to-[#EC4899]'
                        : 'border-black/20'
                    }`}
                  >
                    {selectedAnswer === idx && (
                      <div className="size-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-[#1A1A1A]">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-black/10 px-6 py-6">
        <div className="mx-auto flex max-w-[720px] items-center justify-end">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#EC4899] px-8 py-3 font-medium text-white shadow-lg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLastQuestion ? 'Submit' : 'Next'}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
