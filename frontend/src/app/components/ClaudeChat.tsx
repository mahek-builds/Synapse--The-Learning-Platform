import { useEffect, useRef, useState } from 'react';
import { Plus, Mic, Send, BookOpen, BarChart3, Brain, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  cards?: ResultCard[];
  timestamp: Date;
  explanation?: string;
  diagram?: string;
  questions?: string;
}

interface ResultCard {
  id: string;
  type: 'explanation' | 'diagram' | 'quiz';
  title: string;
  subtitle: string;
  url: string;
}

const getStoredUserId = () => {
  if (typeof window === 'undefined') return '00000000-0000-0000-0000-000000000000';
  let stored = window.localStorage.getItem('synapse_user_id');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!stored || !uuidRegex.test(stored)) {
    try {
      stored = window.crypto.randomUUID();
    } catch (e) {
      stored = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    window.localStorage.setItem('synapse_user_id', stored);
  }
  return stored;
};

function buildCards(
  hasExplanation: boolean,
  hasQuestions: boolean,
  topic: string,
  idSuffix: string | number,
): ResultCard[] | undefined {
  if (!hasExplanation && !hasQuestions) return undefined;
  return [
    ...(hasExplanation
      ? [{
          id: `exp-${idSuffix}`,
          type: 'explanation' as const,
          title: `Explanation: ${topic}`,
          subtitle: 'Read the detailed generated explanation',
          url: '#',
        }]
      : []),
    ...(hasQuestions
      ? [{
          id: `quiz-${idSuffix}`,
          type: 'quiz' as const,
          title: `Quiz: ${topic}`,
          subtitle: 'Test your understanding with a quick quiz',
          url: '#',
        }]
      : []),
  ];
}

export function ClaudeChat({
  onCardClick,
  sessionId,
  onSessionCreated,
  onSessionUpdated,
}: {
  onCardClick: (type: string, data: any) => void;
  sessionId: string | null;
  onSessionCreated: (sessionId: string) => void;
  onSessionUpdated: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState<string>(getStoredUserId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const skipNextFetchRef = useRef(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load messages when session changes
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    // Skip fetch if we just handled a response locally (avoids race condition)
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }

    let cancelled = false;
    fetch(`/chat/messages/${sessionId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load messages');
        return response.json();
      })
      .then((data: Array<{ id?: string; sender: 'user' | 'ai'; content: string; created_at: string; metadata?: any }>) => {
        if (!cancelled) {
          setMessages(
            data.map((message, index) => {
              const metadata = message.metadata || {};
              const topic = metadata.topic || 'Topic';

              return {
                id: message.id || `${sessionId}-${index}`,
                type: message.sender,
                content: message.content,
                explanation: metadata.explanation,
                diagram: metadata.diagram,
                questions: metadata.questions,
                timestamp: new Date(message.created_at),
                cards: buildCards(!!metadata.explanation, !!metadata.questions, topic, index),
              };
            }),
          );
        }
      })
      .catch((error) => console.error('Unable to load messages:', error));

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // ── SSE STREAMING handleSend ──────────────────────────────────
  // Instead of:  fetch → wait for EVERYTHING → show response
  // Now:         fetch → read CHUNKS as they arrive → update UI progressively
  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add user message to chat (same as before)
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

    // 2. Create an EMPTY AI message — user sees it immediately
    //    We'll fill it in as chunks arrive from the server
    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        type: 'ai',
        content: '',  // empty for now — will be filled progressively
        timestamp: new Date(),
      },
    ]);

    try {
      // 3. Call /chat/stream instead of /chat/
      //    This returns SSE (Server-Sent Events) — data arrives in chunks
      const response = await fetch('/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          message: currentInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`);
      }

      // 4. Read the response as a STREAM (not response.json())
      //    Think of it like reading a book page by page instead of
      //    waiting for the whole book to be printed
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      // Track accumulated data across chunks
      let newSessionId = sessionId;
      let topic = 'Topic';
      let explanation = '';
      let questions = '';
      let latestContent = '';

      // 5. Read chunks in a loop until the stream ends
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;  // stream finished

        // Convert raw bytes → text string
        const text = decoder.decode(value, { stream: true });

        // SSE sends data like: "data: {"node":"teacher","explanation":"..."}\n\n"
        // There can be multiple events in one chunk, so we split by lines
        const lines = text.split('\n');

        for (const line of lines) {
          // Only process lines that start with "data: "
          if (!line.startsWith('data: ')) continue;

          const payload = line.slice(6).trim();  // remove "data: " prefix
          if (payload === '[DONE]') continue;     // stream complete signal

          try {
            // 6. Parse the JSON chunk from this node
            const chunk = JSON.parse(payload);

            // Track session ID and topic
            if (chunk.session_id) newSessionId = chunk.session_id;
            if (chunk.topic) topic = chunk.topic;

            // Accumulate content from each node
            if (chunk.explanation) explanation = chunk.explanation;
            if (chunk.questions) questions = chunk.questions;

            // Pick the main display content
            const content = chunk.response || chunk.explanation || chunk.feedback || '';

            if (content) {
              latestContent = content;

              // 7. UPDATE the existing AI message (don't add a new one!)
              //    This is what makes the UI update progressively
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMessageId
                    ? {
                        ...m,
                        content: latestContent,
                        explanation,
                        questions,
                        cards: buildCards(!!explanation, !!questions, topic, aiMessageId),
                      }
                    : m
                )
              );
            }
          } catch {
            // Skip malformed chunks — sometimes partial data arrives
          }
        }
      }

      // 8. Stream finished — handle session creation (same as before)
      if (newSessionId && !sessionId) {
        skipNextFetchRef.current = true;
        onSessionCreated(newSessionId);
      }
      onSessionUpdated();
    } catch (error) {
      // If streaming fails, show error in the AI message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId
            ? { ...m, content: 'Unable to contact backend. Please try again.' }
            : m
        )
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'explanation':
        return BookOpen;
      case 'diagram':
        return BarChart3;
      case 'quiz':
        return Brain;
      default:
        return BookOpen;
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
                            {line.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                              i % 2 === 1 ? (
                                <strong key={i} className="font-semibold">
                                  {part}
                                </strong>
                              ) : (
                                part
                              ),
                            )}
                          </p>
                        );
                      }
                      return line ? (
                        <p key={idx} className="mb-2">
                          {line}
                        </p>
                      ) : (
                        <br key={idx} />
                      );
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
                            onClick={() =>
                              onCardClick(card.type, {
                                title: card.title,
                                url: card.url,
                                content: card.type === 'explanation' ? message.explanation : message.questions,
                              })
                            }
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

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="pb-6">
        <div className="mx-auto w-[680px]">
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
            <div className="flex items-center gap-3 px-4 py-3">
              <input ref={fileInputRef} type="file" multiple className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
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
