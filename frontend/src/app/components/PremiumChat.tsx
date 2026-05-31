import { useState, useRef } from 'react';
import { Send, Paperclip, Mic, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function PremiumChat({
  onQuizStart,
  onTopicChange,
  onWorkflowUpdate
}: {
  onQuizStart: (topic: string) => void;
  onTopicChange: (topic: any) => void;
  onWorkflowUpdate: (workflow: any[]) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.toLowerCase();
    setInput('');
    setIsLoading(true);

    // Update workflow
    const workflow = [
      { agent: 'Planner Agent', status: 'running' as const },
      { agent: 'Teacher Agent', status: 'waiting' as const },
      { agent: 'Evaluator Agent', status: 'waiting' as const },
    ];
    onWorkflowUpdate(workflow);

    // Simulate agent workflow
    setTimeout(() => {
      workflow[0].status = 'completed';
      workflow[1].status = 'running';
      onWorkflowUpdate([...workflow]);
    }, 1000);

    setTimeout(() => {
      workflow[1].status = 'completed';
      workflow[2].status = 'running';
      onWorkflowUpdate([...workflow]);
    }, 2000);

    setTimeout(() => {
      const isQuizRequest = currentInput.includes('quiz') || currentInput.includes('test');

      workflow[2].status = 'completed';
      onWorkflowUpdate([...workflow]);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: isQuizRequest
          ? `I'll create an adaptive quiz for you on **${userMessage.content.replace(/quiz|test|create|generate/gi, '').trim() || 'this topic'}**.\n\n### Quiz Features:\n- ✓ Adaptive difficulty based on performance\n- ✓ Real-time feedback\n- ✓ Detailed analytics\n- ✓ Performance tracking\n\nClick below to start your assessment!`
          : `Let me help you learn about **${userMessage.content}**.\n\n### Understanding the Topic\n\nI've processed your request through our multi-agent system. Here's what you need to know:\n\n#### Core Concepts\n- Fundamental principles and definitions\n- Key terminology and concepts\n- Practical applications\n\n#### Best Practices\n\`\`\`javascript\n// Example implementation\nfunction example() {\n  return "This is how it works";\n}\n\`\`\`\n\n#### Next Steps\n1. Review the concepts above\n2. Practice with examples\n3. Take a quiz to test understanding\n\nWould you like me to generate a quiz to test your knowledge?`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);

      // Update topic info
      onTopicChange({
        name: userMessage.content,
        difficulty: 'Intermediate' as const,
        estimatedTime: '15 min',
        prerequisites: ['Basic understanding', 'Prior knowledge'],
        objectives: [
          'Understand core concepts',
          'Apply in real scenarios',
          'Master best practices',
        ],
      });

      if (isQuizRequest) {
        setTimeout(() => {
          onQuizStart(userMessage.content);
        }, 1000);
      }
    }, 3000);
  };

  return (
    <div className="flex h-full flex-col bg-[#0F172A]">
      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <h1 className="mb-3 text-3xl font-bold text-[#F8FAFC]">Welcome to Synapse AI</h1>
              <p className="mb-8 max-w-md text-slate-400">
                Your AI-powered learning assistant. Ask anything about DSA, AI, Web Development, System Design, Cloud Computing, or Programming...
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setInput('Teach me about Binary Search')}
                  className="rounded-lg border border-white/10 bg-[#1E293B]/50 p-4 text-left backdrop-blur-xl transition-all hover:border-[#4F46E5]/50 hover:bg-[#1E293B]"
                >
                  <p className="mb-1 text-sm font-medium text-[#F8FAFC]">Learn Binary Search</p>
                  <p className="text-xs text-slate-400">Understand search algorithms</p>
                </button>
                <button
                  onClick={() => setInput('Create a quiz on React Hooks')}
                  className="rounded-lg border border-white/10 bg-[#1E293B]/50 p-4 text-left backdrop-blur-xl transition-all hover:border-[#4F46E5]/50 hover:bg-[#1E293B]"
                >
                  <p className="mb-1 text-sm font-medium text-[#F8FAFC]">Quiz on React</p>
                  <p className="text-xs text-slate-400">Test your knowledge</p>
                </button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`mb-8 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-1' : ''}`}>
                  {message.type === 'ai' && (
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A]">
                        <span className="text-xs font-bold text-white">AI</span>
                      </div>
                      <span className="text-sm font-semibold text-[#F8FAFC]">Synapse AI</span>
                    </div>
                  )}

                  <div
                    className={`group relative rounded-2xl px-5 py-4 ${
                      message.type === 'user'
                        ? 'bg-[#4F46E5] text-white'
                        : 'border border-white/10 bg-[#1E293B]/50 text-[#F8FAFC] backdrop-blur-xl'
                    }`}
                  >
                    <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                      {message.content.split('\n').map((line, idx) => {
                        // Handle headings
                        if (line.startsWith('### ')) {
                          return <h3 key={idx} className="mb-2 mt-4 text-base font-bold">{line.replace('### ', '')}</h3>;
                        }
                        if (line.startsWith('#### ')) {
                          return <h4 key={idx} className="mb-2 mt-3 text-sm font-semibold">{line.replace('#### ', '')}</h4>;
                        }
                        // Handle code blocks
                        if (line.startsWith('```')) {
                          return null; // Handle separately
                        }
                        // Handle bold
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        if (boldRegex.test(line)) {
                          return (
                            <p key={idx} className="mb-2">
                              {line.split(boldRegex).map((part, i) =>
                                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                              )}
                            </p>
                          );
                        }
                        // Handle bullet points
                        if (line.startsWith('- ')) {
                          return <li key={idx} className="ml-4">{line.replace('- ', '')}</li>;
                        }
                        // Regular text
                        return line ? <p key={idx} className="mb-2">{line}</p> : <br key={idx} />;
                      })}

                      {/* Code block rendering */}
                      {message.content.includes('```') && (
                        <div className="relative my-3 overflow-hidden rounded-lg bg-[#0F172A] p-4">
                          <button
                            onClick={() => copyToClipboard(message.content.match(/```[\s\S]*?```/)?.[0] || '', message.id)}
                            className="absolute right-2 top-2 rounded bg-white/10 p-1.5 text-slate-300 transition-colors hover:bg-white/20"
                          >
                            {copiedId === message.id ? <Check className="size-3" /> : <Copy className="size-3" />}
                          </button>
                          <pre className="text-xs text-slate-300">
                            <code>{message.content.match(/```[\s\S]*?```/)?.[0]?.replace(/```\w*\n?|\n?```/g, '')}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-1 px-2 text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="mb-8 flex justify-start">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A]">
                    <span className="text-xs font-bold text-white">AI</span>
                  </div>
                  <span className="text-sm font-semibold text-[#F8FAFC]">Synapse AI</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#1E293B]/50 px-5 py-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="size-2 animate-bounce rounded-full bg-[#4F46E5]" style={{ animationDelay: '0ms' }} />
                      <div className="size-2 animate-bounce rounded-full bg-[#4F46E5]" style={{ animationDelay: '150ms' }} />
                      <div className="size-2 animate-bounce rounded-full bg-[#4F46E5]" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-slate-400">Processing with AI agents...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-[#0F172A] p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-end gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#1E293B] text-slate-400 transition-colors hover:bg-[#334155] hover:text-white"
            >
              <Paperclip className="size-5" />
            </button>

            <div className="flex-1 rounded-2xl border border-white/20 bg-[#1E293B] shadow-xl focus-within:border-[#4F46E5]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about DSA, AI, Web Development, System Design, Cloud Computing, or Programming..."
                className="w-full resize-none border-0 bg-transparent px-5 py-4 text-sm text-[#F8FAFC] outline-none placeholder:text-slate-500"
                rows={1}
              />
            </div>

            <button
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#1E293B] text-slate-400 transition-colors hover:bg-[#334155] hover:text-white"
            >
              <Mic className="size-5" />
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg transition-all hover:shadow-[#4F46E5]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
