import { useState } from 'react';
import { Brain, Mail, Lock, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      alert('Please complete the CAPTCHA');
      return;
    }

    onLogin();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-white via-fuchsia-50 to-violet-100">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md rounded-xl border border-white/80 bg-white/95 p-8 shadow-xl shadow-pink-100/60">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-pink-500">
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
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200">
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
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200">
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
                <input type="checkbox" className="size-4 rounded border-slate-300 text-pink-500" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-pink-500 hover:text-pink-600">
                Forgot password?
              </a>
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl"
            >
              Sign In
              <ArrowRight className="size-5" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (!captchaToken) {
                  alert('Please complete the CAPTCHA first');
                  return;
                }

                console.log('Google login success', credentialResponse);
                onLogin();
              }}
              onError={() => {
                console.log('Google login failed');
              }}
              text="signin_with"
              shape="rectangular"
              width="320"
            />
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-pink-500 hover:text-pink-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden flex-1 p-12 lg:flex lg:flex-col lg:justify-center">
        <div className="rounded-xl border border-white/80 bg-white/95 p-8 shadow-xl shadow-pink-100/60">
          <h2 className="mb-4 text-4xl font-bold text-slate-800">Multi-Agent AI Learning Platform</h2>
          <p className="mb-8 text-lg text-slate-600">
            Powered by LangGraph, featuring intelligent agents that adapt to your learning style
          </p>

          <div className="space-y-4">
            <FeatureItem
              title="Adaptive Learning"
              description="AI adjusts difficulty based on your performance"
              gradient="from-violet-600 to-pink-500"
            />
            <FeatureItem
              title="Multi-Agent System"
              description="7+ specialized agents working together"
              gradient="from-fuchsia-500 to-pink-500"
            />
            <FeatureItem
              title="Real-time Research"
              description="Access latest information with Tavily integration"
              gradient="from-violet-500 to-fuchsia-500"
            />
            <FeatureItem
              title="Visual Learning"
              description="Interactive diagrams and flowcharts"
              gradient="from-blue-500 to-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, description, gradient }: { title: string; description: string; gradient: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient}`}>
        <div className="size-2 rounded-full bg-white" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}
