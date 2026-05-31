import { useState } from 'react';
import { Brain, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function RegisterPage({ onRegister }: { onRegister: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onRegister();
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Illustration */}
      <div className="hidden flex-1 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 p-12 lg:flex lg:flex-col lg:justify-center">
        <div className="text-white">
          <h2 className="mb-4 text-4xl font-bold">Start Your Learning Journey</h2>
          <p className="mb-8 text-lg text-white/80">
            Join thousands of learners mastering new skills with AI-powered personalized education
          </p>

          <div className="space-y-4">
            <FeatureItem title="Personalized Path" description="Curriculum tailored to your learning style" />
            <FeatureItem title="Progress Tracking" description="Detailed analytics of your improvements" />
            <FeatureItem title="Interactive Quizzes" description="Adaptive assessments that grow with you" />
            <FeatureItem title="24/7 AI Tutor" description="Get help whenever you need it" />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600">
                <Brain className="size-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Synapse AI</h1>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-600">Start learning with AI-powered personalization</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                <User className="size-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="flex-1 border-0 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
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
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                <Lock className="size-5 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 border-0 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            <label className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 size-4 rounded border-slate-300 text-blue-600" required />
              <span className="text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl"
            >
              Create Account
              <ArrowRight className="size-5" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
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
