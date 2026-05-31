import { useState, useRef } from 'react';
import { Plus, Mic, Send, BookOpen, BarChart3, Brain, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  cards?: ResultCard[];
  timestamp: Date;
}

interface ResultCard {
  id: string;
  type: 'explanation' | 'diagram' | 'quiz';
  title: string;
  subtitle: string;
  url: string;
}

export function ClaudeChat({
  onCardClick
}: {
  onCardClick: (type: string, data: any) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I'll help you learn about **${currentInput}**.\n\nThis is a comprehensive topic that involves understanding core concepts, practical implementation, and best practices. I've created three resources to help you master this:\n\n**Core Concepts:** The fundamental principles you need to understand\n\n**Visual Representation:** A diagram showing how everything connects\n\n**Knowledge Check:** An adaptive quiz to test your understanding\n\nClick on any card below to explore each aspect in detail.`,
        cards: [
          {
            id: 'exp-1',
            type: 'explanation',
            title: 'Explanation',
            subtitle: `Comprehensive guide to ${currentInput}`,
            url: `/explain/${Date.now()}`,
          },
          {
            id: 'dia-1',
            type: 'diagram',
            title: 'Diagram',
            subtitle: 'Visual workflow representation',
            url: `/diagram/${Date.now()}`,
          },
          {
            id: 'quiz-1',
            type: 'quiz',
            title: 'Quiz',
            subtitle: '5 Questions',
            url: `/quiz/${Date.now()}`,
          },
        ],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'explanation': return BookOpen;
      case 'diagram': return BarChart3;
      case 'quiz': return Brain;
      default: return BookOpen;
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#FAFAF8]">
      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[680px] px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#EC4899]">
                <span className="text-2xl font-bold text-white">S</span>
              </div>
              <h1 className="mb-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text font-serif text-4xl font-bold text-transparent">
                Synapse AI
              </h1>
              <p className="text-[#6B6B6B]">Multi-Agent Learning Platform</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`mb-8 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                {message.type === 'ai' && (
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#EC4899]">
                      <span className="text-xs font-bold text-white">AI</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1A1A1A]">Synapse AI</span>
                  </div>
                )}

                <div className={`${message.type === 'user' ? 'max-w-[85%] rounded-2xl bg-[#F5F3EF] px-5 py-3' : ''}`}>
                  <div className="text-sm leading-relaxed text-[#1A1A1A]">
                    {message.content.split('\n').map((line, idx) => {
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      if (boldRegex.test(line)) {
                        return (
                          <p key={idx} className="mb-2">
                            {line.split(boldRegex).map((part, i) =>
                              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                            )}
                          </p>
                        );
                      }
                      return line ? <p key={idx} className="mb-2">{line}</p> : <br key={idx} />;
                    })}
                  </div>

                  {/* Result Cards */}
                  {message.cards && message.cards.length > 0 && (
                    <div className="mt-4 grid gap-3">
                      {message.cards.map((card) => {
                        const Icon = getCardIcon(card.type);
                        return (
                          <button
                            key={card.id}
                            onClick={() => onCardClick(card.type, { title: card.title, url: card.url })}
                            className="group flex items-start gap-4 rounded-xl border border-black/10 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md"
                          >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#EC4899]">
                              <Icon className="size-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="mb-1 font-medium text-[#1A1A1A]">{card.title}</h3>
                              <p className="text-sm text-[#6B6B6B]">{card.subtitle}</p>
                            </div>
                            <ExternalLink className="size-4 text-[#6B6B6B] opacity-0 transition-opacity group-hover:opacity-100" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <p className="mt-1 px-1 text-xs text-[#6B6B6B]">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))
          )}

          {isLoading && (
            <div className="mb-8">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#EC4899]">
                  <span className="text-xs font-bold text-white">AI</span>
                </div>
                <span className="text-sm font-semibold text-[#1A1A1A]">Synapse AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="size-1.5 animate-bounce rounded-full bg-[#6366F1]" style={{ animationDelay: '0ms' }} />
                  <div className="size-1.5 animate-bounce rounded-full bg-[#EC4899]" style={{ animationDelay: '150ms' }} />
                  <div className="size-1.5 animate-bounce rounded-full bg-[#6366F1]" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="pb-6">
        <div className="mx-auto w-[680px]">
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
            <div className="flex items-center gap-3 px-4 py-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-[#F5F3EF]"
              >
                <Plus className="size-5" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message Synapse AI..."
                className="flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#6B6B6B]"
              />

              <div className="flex items-center gap-2">
                <button className="flex size-9 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-[#F5F3EF]">
                  <Mic className="size-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
