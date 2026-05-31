import { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Star,
  TrendingUp,
  Trophy,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Brain
} from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  isFavorite?: boolean;
}

export function PremiumSidebar({
  onNewChat,
  isCollapsed,
  onToggle
}: {
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions] = useState<ChatSession[]>([
    { id: '1', title: 'Introduction to LangGraph', timestamp: new Date('2026-05-30'), isFavorite: true },
    { id: '2', title: 'FastAPI Backend Development', timestamp: new Date('2026-05-29') },
    { id: '3', title: 'Multi-Agent AI Systems', timestamp: new Date('2026-05-28'), isFavorite: true },
    { id: '4', title: 'PostgreSQL Advanced Queries', timestamp: new Date('2026-05-27') },
    { id: '5', title: 'React State Management', timestamp: new Date('2026-05-26') },
  ]);

  if (isCollapsed) {
    return (
      <div className="flex h-full w-16 flex-col items-center bg-[#0F172A] py-4">
        <button
          onClick={onToggle}
          className="mb-4 flex size-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#1E293B]"
        >
          <ChevronRight className="size-5" />
        </button>
        <button
          onClick={onNewChat}
          className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[#4F46E5] text-white transition-all hover:bg-[#4338CA]"
        >
          <Plus className="size-5" />
        </button>
      </div>
    );
  }

  const recentSessions = sessions.slice(0, 5);
  const favoriteSessions = sessions.filter((s) => s.isFavorite);

  return (
    <div className="flex h-full w-64 flex-col bg-[#0F172A] text-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]">
            <Brain className="size-5 text-white" />
          </div>
          <span className="text-lg font-bold">Synapse AI</span>
        </div>
        <button
          onClick={onToggle}
          className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#1E293B]"
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-lg bg-[#4F46E5] px-4 py-3 font-medium transition-all hover:bg-[#4338CA]"
        >
          <Plus className="size-5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 rounded-lg bg-[#1E293B] px-3 py-2">
          <Search className="size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="border-b border-white/10 px-3 pb-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#1E293B]">
          <TrendingUp className="size-4 text-[#22C55E]" />
          <span>Learning Progress</span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#1E293B]">
          <Trophy className="size-4 text-[#F59E0B]" />
          <span>Quiz History</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-auto px-3">
        {/* Favorites */}
        {favoriteSessions.length > 0 && (
          <div className="mb-4 mt-3">
            <h3 className="mb-2 px-2 text-xs font-semibold text-slate-400">Favorites</h3>
            <div className="space-y-1">
              {favoriteSessions.map((session) => (
                <button
                  key={session.id}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[#1E293B]"
                >
                  <Star className="size-3 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="flex-1 truncate">{session.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Topics */}
        <div className="mb-4">
          <h3 className="mb-2 px-2 text-xs font-semibold text-slate-400">Recent Topics</h3>
          <div className="space-y-1">
            {recentSessions.map((session) => (
              <button
                key={session.id}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[#1E293B]"
              >
                <MessageSquare className="size-3 text-slate-500" />
                <span className="flex-1 truncate">{session.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-lg bg-[#1E293B] px-3 py-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]">
            <User className="size-5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">John Doe</p>
            <p className="truncate text-xs text-slate-400">john@example.com</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1E293B] py-2 text-sm transition-colors hover:bg-[#334155]">
            <Settings className="size-4" />
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1E293B] py-2 text-sm text-red-400 transition-colors hover:bg-[#334155]">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
