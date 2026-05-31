import { Award, BookOpen, Brain, TrendingUp, Zap } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const progressData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 85 },
  { day: 'Fri', score: 90 },
  { day: 'Sat', score: 88 },
  { day: 'Sun', score: 95 },
];

const topicsData = [
  { topic: 'LangGraph', mastery: 85 },
  { topic: 'FastAPI', mastery: 75 },
  { topic: 'React', mastery: 90 },
  { topic: 'PostgreSQL', mastery: 65 },
];

export function Dashboard() {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">Welcome back, John! 👋</h1>
          <p className="text-slate-600">Here's your learning progress overview</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={BookOpen}
            title="Topics Learned"
            value="24"
            change="+3 this week"
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={Brain}
            title="Quizzes Completed"
            value="47"
            change="+8 this week"
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={Award}
            title="Average Score"
            value="87%"
            change="+5% improvement"
            gradient="from-amber-500 to-orange-500"
          />
          <StatCard
            icon={Zap}
            title="Learning Streak"
            value="12 days"
            change="Keep it up!"
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Charts */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Progress Chart */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Weekly Progress</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Topic Mastery */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Topic Mastery</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topicsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="topic" type="category" stroke="#64748b" width={80} />
                <Tooltip />
                <Bar dataKey="mastery" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Weak Topics */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="size-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-slate-800">Topics to Improve</h2>
            </div>
            <div className="space-y-3">
              <TopicItem topic="PostgreSQL Optimization" score={65} color="bg-orange-500" />
              <TopicItem topic="Redis Caching" score={58} color="bg-red-500" />
              <TopicItem topic="Celery Tasks" score={70} color="bg-yellow-500" />
            </div>
          </div>

          {/* Recommended Topics */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="size-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-800">Recommended Next</h2>
            </div>
            <div className="space-y-3">
              <RecommendedTopic
                title="Advanced LangGraph Patterns"
                description="Learn conditional edges and dynamic workflows"
                difficulty="Intermediate"
              />
              <RecommendedTopic
                title="Tavily Search Integration"
                description="Master real-time knowledge retrieval"
                difficulty="Beginner"
              />
              <RecommendedTopic
                title="Multi-Agent Coordination"
                description="Build complex agent orchestration"
                difficulty="Advanced"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, change, gradient }: any) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg transition-transform hover:scale-105">
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex size-12 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}>
          <Icon className="size-6 text-white" />
        </div>
      </div>
      <h3 className="mb-1 text-sm text-slate-600">{title}</h3>
      <p className="mb-1 text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-green-600">{change}</p>
    </div>
  );
}

function TopicItem({ topic, score, color }: any) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-slate-700">{topic}</span>
        <span className="text-sm font-medium text-slate-900">{score}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function RecommendedTopic({ title, description, difficulty }: any) {
  const difficultyColors: any = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700',
  };

  return (
    <div className="cursor-pointer rounded-lg border border-slate-200 p-4 transition-all hover:border-indigo-300 hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="font-medium text-slate-800">{title}</h3>
        <span className={`rounded-full px-2 py-1 text-xs ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}
