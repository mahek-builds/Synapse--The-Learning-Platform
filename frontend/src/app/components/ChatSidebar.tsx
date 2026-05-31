import { useState } from 'react';
import { MessageSquare, PenSquare, User, LogOut, Mail, ChevronDown, Plus } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

export function ChatSidebar({ onNewChat }: { onNewChat: () => void }) {
  const [showProfile, setShowProfile] = useState(false);
  const [sessions] = useState<ChatSession[]>([
    { id: '1', title: 'Introduction to LangGraph', timestamp: new Date('2026-05-30') },
    { id: '2', title: 'FastAPI Basics', timestamp: new Date('2026-05-29') },
    { id: '3', title: 'Multi-Agent Systems', timestamp: new Date('2026-05-28') },
    { id: '4', title: 'PostgreSQL Advanced', timestamp: new Date('2026-05-27') },
    { id: '5', title: 'React Hooks Deep Dive', timestamp: new Date('2026-05-26') },
  ]);

  const groupSessionsByDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      Today: [] as ChatSession[],
      Yesterday: [] as ChatSession[],
      'Previous 7 Days': [] as ChatSession[],
      Older: [] as ChatSession[],
    };

    sessions.forEach((session) => {
      const sessionDate = new Date(session.timestamp);
      if (sessionDate.toDateString() === today.toDateString()) {
        groups.Today.push(session);
      } else if (sessionDate.toDateString() === yesterday.toDateString()) {
        groups.Yesterday.push(session);
      } else if (sessionDate >= lastWeek) {
        groups['Previous 7 Days'].push(session);
      } else {
        groups.Older.push(session);
      }
    });

    return groups;
  };

  const groupedSessions = groupSessionsByDate();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-lg border border-white/20 px-4 py-3 transition-colors hover:bg-white/10"
        >
          <Plus className="size-5" />
          <span className="font-medium">New chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-auto px-3">
        {Object.entries(groupedSessions).map(([group, items]) =>
          items.length > 0 ? (
            <div key={group} className="mb-4">
              <h3 className="mb-2 px-3 text-xs font-semibold text-slate-400">{group}</h3>
              <div className="space-y-1">
                {items.map((session) => (
                  <button
                    key={session.id}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/10"
                  >
                    <MessageSquare className="size-4 shrink-0 text-slate-400" />
                    <span className="truncate">{session.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Profile Section */}
      <div className="relative border-t border-white/10 p-3">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/10"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            <User className="size-4" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">John Doe</p>
          </div>
          <ChevronDown className={`size-4 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
        </button>

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-lg border border-white/10 bg-slate-800 shadow-xl">
            <div className="p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                  <User className="size-5" />
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Mail className="size-3" />
                    <span>john@example.com</span>
                  </div>
                </div>
              </div>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-white/10">
                <LogOut className="size-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
