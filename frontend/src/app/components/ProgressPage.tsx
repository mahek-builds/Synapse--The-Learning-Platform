import { Trophy, TrendingUp, Target, Award, Star } from 'lucide-react';
import { AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const skillsData = [
  { skill: 'LangGraph', score: 85 },
  { skill: 'FastAPI', score: 75 },
  { skill: 'React', score: 90 },
  { skill: 'PostgreSQL', score: 65 },
  { skill: 'Redis', score: 70 },
  { skill: 'Celery', score: 60 },
];

const monthlyProgress = [
  { month: 'Jan', completed: 12, score: 75 },
  { month: 'Feb', completed: 18, score: 78 },
  { month: 'Mar', completed: 22, score: 82 },
  { month: 'Apr', completed: 28, score: 85 },
  { month: 'May', completed: 35, score: 88 },
];

const achievements = [
  { id: '1', title: 'First Steps', description: 'Completed your first lesson', icon: Star, unlocked: true, color: 'from-yellow-400 to-orange-500' },
  { id: '2', title: 'Quick Learner', description: 'Completed 10 lessons in a week', icon: TrendingUp, unlocked: true, color: 'from-green-400 to-emerald-500' },
  { id: '3', title: 'Perfect Score', description: 'Got 100% on a quiz', icon: Trophy, unlocked: true, color: 'from-purple-400 to-pink-500' },
  { id: '4', title: 'Dedicated', description: 'Maintained a 7-day streak', icon: Target, unlocked: true, color: 'from-blue-400 to-cyan-500' },
  { id: '5', title: 'Master', description: 'Mastered 5 different topics', icon: Award, unlocked: false, color: 'from-slate-300 to-slate-400' },
];

export function ProgressPage() {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-purple-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">Your Progress</h1>
          <p className="text-slate-600">Track your learning journey and achievements</p>
        </div>

        {/* Overall Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm text-slate-600">Overall Progress</h3>
              <Trophy className="size-5 text-yellow-500" />
            </div>
            <p className="mb-2 text-3xl font-bold text-slate-800">Level 7</p>
            <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-3/4 bg-gradient-to-r from-indigo-600 to-purple-600" />
            </div>
            <p className="text-xs text-slate-500">750 / 1000 XP to Level 8</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm text-slate-600">Topics Mastered</h3>
              <Target className="size-5 text-green-500" />
            </div>
            <p className="mb-2 text-3xl font-bold text-slate-800">4 / 6</p>
            <p className="text-sm text-slate-600">67% completion</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm text-slate-600">Current Streak</h3>
              <TrendingUp className="size-5 text-orange-500" />
            </div>
            <p className="mb-2 text-3xl font-bold text-slate-800">12 days 🔥</p>
            <p className="text-sm text-slate-600">Longest: 15 days</p>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Skills Radar */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Skills Assessment</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" stroke="#64748b" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" />
                <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Progress */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Monthly Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyProgress}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="completed" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-slate-800">Achievements</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`rounded-xl border-2 p-6 text-center transition-all ${
                    achievement.unlocked
                      ? 'border-transparent bg-gradient-to-br shadow-md'
                      : 'border-dashed border-slate-300 bg-slate-50 opacity-50'
                  } ${achievement.unlocked ? achievement.color : ''}`}
                >
                  <div className={`mb-3 flex justify-center`}>
                    <div className={`flex size-16 items-center justify-center rounded-full ${achievement.unlocked ? 'bg-white/20' : 'bg-slate-200'}`}>
                      <Icon className={`size-8 ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                  </div>
                  <h3 className={`mb-1 font-semibold ${achievement.unlocked ? 'text-white' : 'text-slate-600'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-xs ${achievement.unlocked ? 'text-white/80' : 'text-slate-500'}`}>
                    {achievement.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
