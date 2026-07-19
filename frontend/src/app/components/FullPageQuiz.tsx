import { useState, useMemo } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

interface ParsedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index in options
}

interface FullPageQuizProps {
  onClose: () => void;
  data?: {
    title?: string;
    content?: string;
  } | null;
}

/**
 * Attempts to parse questions from the backend text.
 * Supports formats like:
 * 1. What is X?
 * A) option
 * B) option
 * C) option  
 * D) option
 * Answer: A
 *
 * Or JSON array of {question, options, correctAnswer}
 */
function parseQuestions(text: string): ParsedQuestion[] {
  if (!text) return [];

  // Try JSON parse first
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed.map((q: any, idx: number) => ({
        id: String(idx),
        question: q.question || q.text || `Question ${idx + 1}`,
        options: q.options || q.choices || [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : (typeof q.correct_answer === 'number' ? q.correct_answer : 0),
      }));
    }
  } catch {
    // Not JSON, try text parsing
  }

  const questions: ParsedQuestion[] = [];
  const questionBlocks = text.split(/(?=\d+[\.\)]\s)/);

  for (const block of questionBlocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const questionMatch = lines[0].match(/^\d+[\.\)]\s*(.*)/);
    const questionText = questionMatch ? questionMatch[1] : lines[0];

    const options: string[] = [];
    let correctIdx = 0;
    let isCoding = true;

    for (let i = 1; i < lines.length; i++) {
      const optMatch = lines[i].match(/^([A-Da-d])[\.\)]\s*(.*)/);
      if (optMatch) {
        options.push(optMatch[2]);
        isCoding = false;
      }

      const answerMatch = lines[i].match(/^(?:Answer|Correct)\s*[:\-]\s*([A-Da-d])/i);
      if (answerMatch) {
        correctIdx = answerMatch[1].toUpperCase().charCodeAt(0) - 65;
        isCoding = false;
      }
    }

    if (isCoding) {
      // Include all remaining lines in the question block as details for the coding task
      const fullQuestionDescription = lines.join('\n');
      questions.push({
        id: String(questions.length),
        question: fullQuestionDescription,
        options: [],
        correctAnswer: -1,
      });
    } else if (options.length >= 2) {
      questions.push({
        id: String(questions.length),
        question: questionText,
        options,
        correctAnswer: correctIdx,
      });
    }
  }

  return questions;
}

export function FullPageQuiz({ onClose, data }: FullPageQuizProps) {
  const title = data?.title?.replace(/^Quiz:\s*/i, '') || 'Quiz';
  const content = data?.content || '';

  const questions = useMemo(() => parseQuestions(content), [content]);
  const hasQuestions = questions.length > 0;

  // --- Structured quiz state ---
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<(number | null)[]>(Array(Math.max(questions.length, 1)).fill(null));
  const [showResults, setShowResults] = useState(false);

  // --- Plain text quiz state ---
  const [showAnswers, setShowAnswers] = useState(false);

  // If we couldn't parse structured questions, show the raw text beautifully
  if (!hasQuestions) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <div className="border-b border-black/10 px-6 py-4">
          <div className="mx-auto flex max-w-[720px] items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#EC4899]">
              <span className="text-xs font-bold text-white">🧠</span>
            </div>
            <h1 className="font-serif text-lg font-semibold text-[#1A1A1A]">{title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-12">
          <div className="mx-auto w-full max-w-[720px]">
            {content ? (
              <>
                <div className="whitespace-pre-wrap rounded-2xl border border-black/10 bg-[#FAFAF8] p-8 text-sm leading-relaxed text-[#1A1A1A]">
                  {content}
                </div>
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="mt-6 flex items-center gap-2 rounded-xl border border-black/10 px-6 py-3 text-sm font-medium text-[#1A1A1A] transition-all hover:bg-[#FAFAF8]"
                >
                  {showAnswers ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  {showAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-[#6B6B6B]">No quiz content available.</p>
                <p className="mt-2 text-sm text-[#999]">Ask Synapse AI a question to generate a quiz.</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-black/10 px-6 py-6">
          <div className="mx-auto flex max-w-[720px] items-center justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#EC4899] px-8 py-3 font-medium text-white shadow-lg transition-all hover:opacity-90"
            >
              Back to Chat
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Structured Quiz UI ---
  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const isCodingQuestion = currentQuestion.options.length === 0;

  const codeAnswerForStep = codeAnswers[currentQuestion.id] || '';
  const isAnswered = isCodingQuestion ? !!codeAnswerForStep.trim() : selectedAnswer !== null;

  const handleNext = () => {
    if (!isAnswered) return;

    if (isCodingQuestion) {
      if (isLastQuestion) {
        setShowResults(true);
      } else {
        setCurrentStep(currentStep + 1);
        setSelectedAnswer(null);
      }
    } else {
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
    }
  };

  if (showResults) {
    const mcqQuestions = questions.filter(q => q.options.length > 0);
    const score = answers.reduce<number>((acc, answer, idx) => {
      const q = questions[idx];
      return q && q.options.length > 0 && answer === q.correctAnswer ? acc + 1 : acc;
    }, 0);
    const percentage = mcqQuestions.length > 0 ? Math.round((score / mcqQuestions.length) * 100) : 100;

    return (
      <div className="flex min-h-screen flex-col bg-white overflow-auto px-6 py-12">
        <div className="mx-auto w-full max-w-[720px] text-center">
          <div className="mb-6 text-6xl">🎉</div>
          <h1 className="mb-4 font-serif text-4xl text-[#1A1A1A]">Quiz Complete!</h1>
          
          {mcqQuestions.length > 0 && (
            <p className="mb-8 text-lg text-[#6B6B6B]">
              You scored{' '}
              <span className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text font-semibold text-transparent">
                {score}
              </span>{' '}
              out of {mcqQuestions.length} MCQs
            </p>
          )}

          <div className="mb-8 rounded-2xl border border-black/10 bg-[#FAFAF8] p-8">
            <div className="mb-4 bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-7xl font-bold text-transparent">
              {percentage}%
            </div>
            <p className="text-[#6B6B6B]">
              {percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
            </p>
          </div>

          {/* Coding solutions summary */}
          {questions.some(q => q.options.length === 0) && (
            <div className="mb-8 text-left">
              <h3 className="mb-4 font-serif text-xl text-[#1A1A1A]">Coding Solutions Summary</h3>
              <div className="space-y-4">
                {questions.filter(q => q.options.length === 0).map((q) => (
                  <div key={q.id} className="rounded-xl border border-black/10 bg-[#FAFAF8] p-5">
                    <h4 className="mb-3 font-mono text-sm font-semibold text-[#1A1A1A] whitespace-pre-wrap">{q.question}</h4>
                    <pre className="overflow-x-auto rounded-lg bg-[#1E1E1E] p-4 font-mono text-xs text-[#D4D4D4] leading-relaxed">
                      {codeAnswers[q.id] || '// No solution submitted'}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

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
      <div className="flex flex-1 items-center justify-center px-6 py-12 overflow-auto">
        <div className="w-full max-w-[720px]">
          {isCodingQuestion ? (
            <div className="space-y-5">
              <h3 className="text-center font-serif text-lg font-semibold uppercase tracking-wider text-[#6B6B6B]">
                Coding Challenge
              </h3>
              <div className="whitespace-pre-wrap rounded-xl border border-black/10 bg-[#FAFAF8] p-5 font-mono text-sm leading-relaxed text-[#1A1A1A]">
                {currentQuestion.question}
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
                  Your Code Solution
                </label>
                <textarea
                  value={codeAnswerForStep}
                  onChange={(e) => setCodeAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                  placeholder="// Write your code solution here..."
                  rows={10}
                  className="w-full rounded-xl border border-black/10 bg-[#1E1E1E] p-5 font-mono text-sm text-[#D4D4D4] outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="mb-8 text-center font-serif text-2xl text-[#1A1A1A]">{currentQuestion.question}</h2>
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
                        {selectedAnswer === idx && <div className="size-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[#1A1A1A]">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-black/10 px-6 py-6">
        <div className="mx-auto flex max-w-[720px] items-center justify-end">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
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
