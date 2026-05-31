import { ArrowRight } from 'lucide-react';

export function FullPageDiagram({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Progress Dots */}
      <div className="border-b border-black/10 px-6 py-4">
        <div className="mx-auto flex max-w-[720px] items-center justify-center gap-2">
          <div className="size-2 rounded-full bg-[#C4593A]" />
          <div className="size-2 rounded-full bg-[#C4593A]" />
          <div className="size-2 rounded-full bg-black/10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[720px]">
          <h1 className="mb-8 text-center font-serif text-3xl text-[#1A1A1A]">
            LangGraph Multi-Agent Workflow
          </h1>

          {/* Diagram */}
          <div className="rounded-2xl border border-black/10 bg-[#FAFAF8] p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Frontend */}
              <div className="w-full max-w-xs rounded-xl border-2 border-[#6366F1] bg-white p-4 text-center shadow-sm">
                <p className="font-semibold text-[#1A1A1A]">Frontend</p>
                <p className="text-sm text-[#6B6B6B]">User Interface</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-[#6366F1]" />
                <div className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent">↓</div>
              </div>

              {/* POST /learn */}
              <div className="w-full max-w-xs rounded-xl border border-black/20 bg-white p-4 text-center">
                <p className="font-semibold text-[#1A1A1A]">POST /learn</p>
                <p className="text-sm text-[#6B6B6B]">API Endpoint</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-[#6366F1]" />
                <div className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent">↓</div>
              </div>

              {/* LangGraph */}
              <div className="w-full max-w-xs rounded-xl border-2 border-[#6366F1] bg-gradient-to-r from-[#6366F1] to-[#EC4899] p-4 text-center text-white shadow-lg">
                <p className="font-semibold">LangGraph Engine</p>
                <p className="text-sm opacity-90">Multi-Agent Orchestration</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-4 w-px bg-[#6366F1]" />
              </div>

              {/* Agents */}
              <div className="grid w-full grid-cols-3 gap-4">
                <div className="rounded-lg border border-black/10 bg-white p-3 text-center">
                  <div className="mb-1 text-2xl">🎯</div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Planner</p>
                </div>
                <div className="rounded-lg border border-black/10 bg-white p-3 text-center">
                  <div className="mb-1 text-2xl">👨‍🏫</div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Teacher</p>
                </div>
                <div className="rounded-lg border border-black/10 bg-white p-3 text-center">
                  <div className="mb-1 text-2xl">🔍</div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Research</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-4 w-px bg-[#6366F1]" />
              </div>

              <div className="grid w-full grid-cols-2 gap-4">
                <div className="rounded-lg border border-black/10 bg-white p-3 text-center">
                  <div className="mb-1 text-2xl">📊</div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Evaluator</p>
                </div>
                <div className="rounded-lg border border-black/10 bg-white p-3 text-center">
                  <div className="mb-1 text-2xl">📝</div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Quiz Agent</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-[#6366F1]" />
                <div className="bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent">↓</div>
              </div>

              {/* Response */}
              <div className="w-full max-w-xs rounded-xl border-2 border-green-500 bg-green-50 p-4 text-center">
                <p className="font-semibold text-green-900">Response Generated</p>
                <p className="text-sm text-green-700">Delivered to Frontend</p>
              </div>
            </div>
          </div>
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
