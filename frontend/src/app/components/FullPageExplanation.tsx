import { ArrowRight } from 'lucide-react';

export function FullPageExplanation({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Progress Dots */}
      <div className="border-b border-black/10 px-6 py-4">
        <div className="mx-auto flex max-w-[720px] items-center justify-center gap-2">
          <div className="size-2 rounded-full bg-[#C4593A]" />
          <div className="size-2 rounded-full bg-black/10" />
          <div className="size-2 rounded-full bg-black/10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[720px]">
          <h1 className="mb-6 font-serif text-3xl text-[#1A1A1A]">
            Understanding React Hooks
          </h1>

          <div className="space-y-4 text-[#1A1A1A]">
            <p className="leading-relaxed">
              React Hooks are functions that let you use state and other React features without writing a class.
              They were introduced in React 16.8 and have revolutionized how we write React components.
            </p>

            <h2 className="mt-6 font-serif text-xl">Core Concepts</h2>

            <p className="leading-relaxed">
              The most commonly used hooks are <code className="rounded bg-[#F5F3EF] px-2 py-0.5 text-sm">useState</code> for
              managing component state and <code className="rounded bg-[#F5F3EF] px-2 py-0.5 text-sm">useEffect</code> for
              handling side effects like data fetching, subscriptions, or manually changing the DOM.
            </p>

            <div className="my-6 rounded-xl border border-black/10 bg-[#FAFAF8] p-6">
              <pre className="text-sm">
                <code>{`import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`}</code>
              </pre>
            </div>

            <h2 className="mt-6 font-serif text-xl">Best Practices</h2>

            <ul className="space-y-2">
              <li className="flex gap-3">
                <span className="text-[#C4593A]">•</span>
                <span>Only call hooks at the top level of your component</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#C4593A]">•</span>
                <span>Only call hooks from React functions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#C4593A]">•</span>
                <span>Use the ESLint plugin to enforce these rules</span>
              </li>
            </ul>
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
