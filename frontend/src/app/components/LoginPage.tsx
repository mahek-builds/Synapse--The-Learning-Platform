import { useState } from 'react';
import { Brain, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                <Brain className="size-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Synapse AI</h1>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-slate-800">Welcome back!</h2>
            <p className="text-slate-600">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
                <Mail className="size-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="flex-1 border-0 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
                <Lock className="size-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 border-0 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="size-4 rounded border-slate-300 text-indigo-600" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl"
            >
              Sign In
              <ArrowRight className="size-5" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 lg:flex lg:flex-col lg:justify-center">
        <div className="text-white">
          <h2 className="mb-4 text-4xl font-bold">Multi-Agent AI Learning Platform</h2>
          <p className="mb-8 text-lg text-white/80">
            Powered by LangGraph, featuring intelligent agents that adapt to your learning style
          </p>

          <div className="space-y-4">
            <FeatureItem title="Adaptive Learning" description="AI adjusts difficulty based on your performance" />
            <FeatureItem title="Multi-Agent System" description="7+ specialized agents working together" />
            <FeatureItem title="Real-time Research" description="Access latest information with Tavily integration" />
            <FeatureItem title="Visual Learning" description="Interactive diagrams and flowcharts" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20">
        <div className="size-2 rounded-full bg-white" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </div>
  );
}
