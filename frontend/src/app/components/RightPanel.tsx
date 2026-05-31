import { Clock, Target, TrendingUp, Award, Flame, CheckCircle2 } from 'lucide-react';

interface Topic {
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  prerequisites: string[];
  objectives: string[];
}

export function RightPanel({ currentTopic, agentWorkflow }: {
  currentTopic?: Topic;
  agentWorkflow: { agent: string; status: 'waiting' | 'running' | 'completed' | 'failed' }[];
}) {
  const defaultTopic: Topic = {
    name: 'Getting Started',
    difficulty: 'Beginner',
    estimatedTime: '5 min',
    prerequisites: [],
    objectives: ['Ask any question to start learning'],
  };

  const topic = currentTopic || defaultTopic;

  const difficultyColors = {
    Beginner: 'text-[#22C55E] bg-[#22C55E]/10',
    Intermediate: 'text-[#F59E0B] bg-[#F59E0B]/10',
    Advanced: 'text-[#EF4444] bg-[#EF4444]/10',
  };

  const statusColors = {
    waiting: 'bg-slate-600',
    running: 'bg-[#4F46E5]',
    completed: 'bg-[#22C55E]',
    failed: 'bg-[#EF4444]',
  };

  return (
    <div className="flex h-full w-96 flex-col gap-4 overflow-auto bg-[#0F172A] p-4">
      {/* Explanation Card */}
      <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-lg font-bold text-[#F8FAFC]">{topic.name}</h3>

        <div className="mb-4 flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyColors[topic.difficulty]}`}>
            {topic.difficulty}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="size-3" />
            <span>{topic.estimatedTime}</span>
          </div>
        </div>

        {topic.prerequisites.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold text-slate-300">Prerequisites</h4>
            <div className="space-y-1">
              {topic.prerequisites.map((prereq, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="size-1.5 rounded-full bg-[#4F46E5]" />
                  <span>{prereq}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-300">Learning Objectives</h4>
          <div className="space-y-2">
            {topic.objectives.map((objective, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                <Target className="mt-0.5 size-3 shrink-0 text-[#7C3AED]" />
                <span>{objective}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Visualization */}
      <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold text-slate-300">Agent Workflow</h3>
        <div className="space-y-3">
          {agentWorkflow.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3">
                <div className={`size-2 rounded-full ${statusColors[item.status]} ${item.status === 'running' ? 'animate-pulse' : ''}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F8FAFC]">{item.agent}</p>
                  <p className="text-xs capitalize text-slate-400">{item.status}</p>
                </div>
                {item.status === 'completed' && (
                  <CheckCircle2 className="size-4 text-[#22C55E]" />
                )}
              </div>
              {idx < agentWorkflow.length - 1 && (
                <div className="ml-1 mt-2 h-6 w-px bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Learning Insights */}
      <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold text-slate-300">Learning Insights</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#0F172A]/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Flame className="size-4 text-[#F97316]" />
              <span className="text-xs text-slate-400">Streak</span>
            </div>
            <p className="text-xl font-bold text-[#F8FAFC]">12 days</p>
          </div>

          <div className="rounded-lg bg-[#0F172A]/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Award className="size-4 text-[#F59E0B]" />
              <span className="text-xs text-slate-400">Topics</span>
            </div>
            <p className="text-xl font-bold text-[#F8FAFC]">24</p>
          </div>

          <div className="rounded-lg bg-[#0F172A]/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp className="size-4 text-[#22C55E]" />
              <span className="text-xs text-slate-400">Accuracy</span>
            </div>
            <p className="text-xl font-bold text-[#F8FAFC]">87%</p>
          </div>

          <div className="rounded-lg bg-[#0F172A]/50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <Clock className="size-4 text-[#7C3AED]" />
              <span className="text-xs text-slate-400">Time</span>
            </div>
            <p className="text-xl font-bold text-[#F8FAFC]">32h</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">Weekly Progress</span>
            <span className="text-[#F8FAFC]">68%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#0F172A]/50">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]" />
          </div>
        </div>
      </div>
    </div>
  );
}
