import { useState, useRef } from 'react';
import { Send, Sparkles, Loader2, BookOpen, Image as ImageIcon, FileText, File } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  diagram?: string;
  attachments?: FileAttachment[];
  timestamp: Date;
}

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI learning assistant powered by multiple specialized agents. Ask me anything about programming, AI, or any topic you'd like to learn!",
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
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const hasFiles = userMessage.attachments && userMessage.attachments.length > 0;
      const responseContent = hasFiles
        ? `I've received your ${userMessage.attachments!.length} file${userMessage.attachments!.length > 1 ? 's' : ''}. I can analyze:\n\n${userMessage.attachments!.map(f => `• ${f.name}`).join('\n')}\n\nHow would you like me to help you with ${userMessage.attachments!.length > 1 ? 'these files' : 'this file'}? I can:\n1. Analyze the content\n2. Explain concepts found in the file\n3. Generate a quiz based on the material\n4. Create a visual diagram of the concepts`
        : `Great question about "${userMessage.content}"! Let me break this down for you:\n\n**Understanding ${userMessage.content}**\n\nThis concept involves several key components:\n\n1. **Foundation**: The basic principles that govern this topic\n2. **Implementation**: How it's applied in real-world scenarios\n3. **Best Practices**: Industry-standard approaches\n\nWould you like me to generate a quiz to test your understanding, or would you prefer to dive deeper into any specific aspect?`;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: responseContent,
        diagram: !hasFiles && (userMessage.content.toLowerCase().includes('langgraph') || userMessage.content.toLowerCase().includes('workflow') || userMessage.content.toLowerCase().includes('agent'))
          ? `graph TD
    A[User Query] --> B[Planner Agent]
    B --> C[Research Agent]
    C --> D[Teacher Agent]
    D --> E[Visual Agent]
    E --> F[Evaluator Agent]
    F --> G[Final Response]`
          : undefined,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">AI Learning Assistant</h2>
            <p className="text-xs text-slate-500">Multi-Agent LangGraph System</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="mr-3 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Sparkles className="size-4 text-white" />
                </div>
              )}
              <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`rounded-2xl px-5 py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                      : 'bg-white shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>

                  {/* File Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((file) => (
                        <div
                          key={file.id}
                          className={`flex items-center gap-3 rounded-lg p-3 ${
                            message.type === 'user' ? 'bg-white/10' : 'bg-slate-50'
                          }`}
                        >
                          {file.type.startsWith('image/') ? (
                            <div className="size-12 shrink-0 overflow-hidden rounded-lg">
                              <img src={file.url} alt={file.name} className="size-full object-cover" />
                            </div>
                          ) : (
                            <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${
                              message.type === 'user' ? 'bg-white/20' : 'bg-indigo-100'
                            }`}>
                              {file.type === 'application/pdf' ? (
                                <FileText className={`size-6 ${message.type === 'user' ? 'text-white' : 'text-indigo-600'}`} />
                              ) : (
                                <File className={`size-6 ${message.type === 'user' ? 'text-white' : 'text-indigo-600'}`} />
                              )}
                            </div>
                          )}
                          <div className="flex-1 overflow-hidden">
                            <p className={`truncate text-sm font-medium ${
                              message.type === 'user' ? 'text-white' : 'text-slate-800'
                            }`}>
                              {file.name}
                            </p>
                            <p className={`text-xs ${message.type === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mermaid Diagram */}
                {message.diagram && (
                  <div className="mt-3 rounded-xl border border-indigo-200 bg-white p-6 shadow-md">
                    <div className="mb-3 flex items-center gap-2">
                      <ImageIcon className="size-4 text-indigo-600" />
                      <span className="text-sm font-medium text-slate-700">Learning Flowchart</span>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <pre className="text-xs text-slate-600">{message.diagram}</pre>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      This diagram shows the agent workflow processing your query
                    </p>
                  </div>
                )}

                <p className="mt-1 px-1 text-xs text-slate-400">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="mr-3 mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                <Sparkles className="size-4 text-white" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-md">
                <Loader2 className="size-4 animate-spin text-indigo-600" />
                <span className="text-sm text-slate-600">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white p-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything... (e.g., 'Teach me about LangGraph workflows')"
                className="w-full resize-none border-0 bg-transparent px-4 py-3 text-sm outline-none"
                rows={3}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="size-5" />
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Powered by Planner, Research, Teacher, Visual, and Evaluator agents
          </p>
        </div>
      </div>
  );
}
