import { useState, useRef } from 'react';
import { Send, FileText, File } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  attachments?: FileAttachment[];
  workflow?: AgentWorkflow;
  quizUrl?: string;
  timestamp: Date;
}

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface AgentWorkflow {
  topic: string;
  agents: string[];
}

export function MainChat({ onQuizStart }: { onQuizStart: (topic: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI learning assistant powered by LangGraph multi-agent system. Ask me anything or request a quiz!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: FileAttachment[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input || 'Uploaded files',
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.toLowerCase();
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    // Simulate AI response with LangGraph workflow
    setTimeout(() => {
      const isQuizRequest = currentInput.includes('quiz');

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: isQuizRequest
          ? `I'll create an adaptive quiz for you on "${userMessage.content.replace(/quiz|test|create|generate/gi, '').trim() || 'this topic'}". The quiz will adjust difficulty based on your answers:\n\n✓ Correct answer → Difficulty increases\n✗ Wrong answer → Difficulty decreases or stays same\n\nClick the button below to start your quiz!`
          : `Let me help you learn about "${userMessage.content}".\n\n**Understanding the Topic**\n\nI've processed your request through our multi-agent system:\n\n1. **Planner Agent**: Analyzed your query and determined the learning path\n2. **Research Agent**: Gathered latest information and examples\n3. **Teacher Agent**: Structured the content for optimal learning\n4. **Evaluator Agent**: Ensured quality and accuracy\n\nHere's what you need to know:\n\n• Core concepts and fundamentals\n• Real-world applications\n• Best practices and common pitfalls\n• Industry standards\n\nWould you like me to create a quiz to test your understanding?`,
        workflow: {
          topic: userMessage.content,
          agents: ['Planner', 'Research', 'Teacher', 'Evaluator'],
        },
        quizUrl: isQuizRequest ? `/quiz/${Date.now()}` : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {messages.map((message) => (
            <div key={message.id} className={`mb-8 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                {message.type === 'ai' && (
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
                      <span className="text-xs font-bold text-white">AI</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">Synapse AI</span>
                  </div>
                )}

                <div
                  className={`rounded-2xl px-5 py-3 ${
                    message.type === 'user'
                      ? 'bg-slate-100 text-slate-900'
                      : 'bg-transparent text-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>

                  {/* File Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((file) => (
                        <div
                          key={file.id}
                          className={`flex items-center gap-3 rounded-lg p-3 ${
                            message.type === 'user' ? 'bg-white' : 'bg-slate-50'
                          }`}
                        >
                          {file.type.startsWith('image/') ? (
                            <div className="size-12 shrink-0 overflow-hidden rounded-lg">
                              <img src={file.url} alt={file.name} className="size-full object-cover" />
                            </div>
                          ) : (
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                              {file.type === 'application/pdf' ? (
                                <FileText className="size-6 text-blue-600" />
                              ) : (
                                <File className="size-6 text-blue-600" />
                              )}
                            </div>
                          )}
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Agent Workflow */}
                  {message.workflow && (
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-xs font-semibold text-slate-600">LangGraph Agent Workflow</p>
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
                          Frontend
                        </div>
                        <span className="text-slate-400">→</span>
                        <div className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                          POST /learn
                        </div>
                        <span className="text-slate-400">→</span>
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          LangGraph
                        </div>
                      </div>
                      <div className="ml-4 mt-3 space-y-2 border-l-2 border-slate-300 pl-4">
                        {message.workflow.agents.map((agent, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-green-500" />
                            <span className="text-xs text-slate-700">{agent} Agent</span>
                          </div>
                        ))}
                      </div>
                      <div className="ml-4 mt-3 flex items-center gap-2">
                        <span className="text-slate-400">→</span>
                        <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Response
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quiz Button */}
                  {message.quizUrl && (
                    <button
                      onClick={() => onQuizStart(message.workflow?.topic || 'General')}
                      className="mt-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl"
                    >
                      Start Adaptive Quiz →
                    </button>
                  )}
                </div>

                <p className="mt-1 px-1 text-xs text-slate-400">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mb-8 flex justify-start">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
                    <span className="text-xs font-bold text-white">AI</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Synapse AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="size-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
                    <div className="size-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
                    <div className="size-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-slate-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3">
            <div className="flex-1 rounded-2xl border border-slate-300 bg-white shadow-sm focus-within:border-slate-400">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message Synapse AI..."
                className="w-full resize-none border-0 bg-transparent px-4 py-3 text-sm outline-none"
                rows={1}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
