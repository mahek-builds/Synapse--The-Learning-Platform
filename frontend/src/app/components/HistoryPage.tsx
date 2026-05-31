import { Clock, MessageSquare, Trophy, Calendar } from 'lucide-react';

const sessions = [
  {
    id: '1',
    topic: 'Introduction to LangGraph',
    date: '2026-05-30',
    duration: '45 min',
    score: 85,
    questions: 12,
  },
  {
    id: '2',
    topic: 'FastAPI Basics',
    date: '2026-05-29',
    duration: '38 min',
    score: 92,
    questions: 10,
  },
  {
    id: '3',
    topic: 'PostgreSQL Advanced Queries',
    date: '2026-05-28',
    duration: '52 min',
    score: 78,
    questions: 15,
  },
  {
    id: '4',
    topic: 'React Hooks Deep Dive',
    date: '2026-05-27',
    duration: '61 min',
    score: 95,
    questions: 18,
  },
  {
    id: '5',
    topic: 'Multi-Agent Systems',
    date: '2026-05-26',
    duration: '43 min',
    score: 88,
    questions: 11,
  },
];

export function HistoryPage() {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">Learning History</h1>
          <p className="text-slate-600">Track your progress and review past sessions</p>
        </div>

        {/* Stats Summary */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            icon={MessageSquare}
            label="Total Sessions"
            value={sessions.length.toString()}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={Trophy}
            label="Average Score"
            value={`${Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length)}%`}
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={Clock}
            label="Total Time"
            value="239 min"
            gradient="from-orange-500 to-red-500"
          />
          <StatCard
            icon={Calendar}
            label="This Week"
            value="5 sessions"
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="cursor-pointer rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-slate-800">{session.topic}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" />
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="size-4" />
                      <span>{session.questions} questions</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-end gap-2">
                  <div
                    className={`rounded-full px-4 py-2 text-lg font-bold ${
                      session.score >= 90
                        ? 'bg-green-100 text-green-700'
                        : session.score >= 75
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {session.score}%
                  </div>
                  <span className="text-xs text-slate-500">
                    {session.score >= 90 ? 'Excellent' : session.score >= 75 ? 'Good' : 'Needs Practice'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, gradient }: any) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className={`mb-3 flex size-12 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}>
        <Icon className="size-6 text-white" />
      </div>
      <p className="mb-1 text-sm text-slate-600">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
