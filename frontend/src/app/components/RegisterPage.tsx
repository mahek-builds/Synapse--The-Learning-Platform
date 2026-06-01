import { useState } from 'react';
import { Brain, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';

export function RegisterPage({ onRegister }: { onRegister: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!captchaToken) {
      alert('Please complete the CAPTCHA');
      return;
    }

    onRegister();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-white via-fuchsia-50 to-violet-100">
      {/* Left Side - Illustration */}
      <div className="hidden flex-1 p-12 lg:flex lg:flex-col lg:justify-center">
        <div className="rounded-xl border border-white/80 bg-white/95 p-8 shadow-xl shadow-pink-100/60">
          <h2 className="mb-4 text-4xl font-bold text-slate-800">Start Your Learning Journey</h2>
          <p className="mb-8 text-lg text-slate-600">
            Join thousands of learners mastering new skills with AI-powered personalized education
          </p>

          <div className="space-y-4">
            <FeatureItem
              title="Personalized Path"
              description="Curriculum tailored to your learning style"
              gradient="from-violet-600 to-pink-500"
            />
            <FeatureItem
              title="Progress Tracking"
              description="Detailed analytics of your improvements"
              gradient="from-fuchsia-500 to-pink-500"
            />
            <FeatureItem
              title="Interactive Quizzes"
              description="Adaptive assessments that grow with you"
              gradient="from-violet-500 to-fuchsia-500"
            />
            <FeatureItem
              title="24/7 AI Tutor"
              description="Get help whenever you need it"
              gradient="from-blue-500 to-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md rounded-xl border border-white/80 bg-white/95 p-8 shadow-xl shadow-pink-100/60">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-pink-500">
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
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200">
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-200">
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
              <input type="checkbox" className="mt-1 size-4 rounded border-slate-300 text-pink-500" required />
              <span className="text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-pink-500 hover:text-pink-600">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-pink-500 hover:text-pink-600">
                  Privacy Policy
                </a>
              </span>
            </label>

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
              Create Account
              <ArrowRight className="size-5" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-pink-500 hover:text-pink-600">
              Sign in
            </Link>
          </p>
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
