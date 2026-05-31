import { useState } from 'react';
import { Plus, MessageSquare, Clock, Star, Folder, Wrench, User, MoreVertical, Trash2 } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

export function ClaudeSidebar({
  onNewChat,
  onProfileClick
}: {
  onNewChat: () => void;
  onProfileClick: () => void;
}) {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: '1', title: 'Introduction to LangGraph Multi-Agent Systems', timestamp: new Date() },
    { id: '2', title: 'FastAPI Backend Development Tutorial', timestamp: new Date(Date.now() - 86400000) },
    { id: '3', title: 'React State Management Patterns', timestamp: new Date(Date.now() - 86400000) },
    { id: '4', title: 'PostgreSQL Advanced Queries', timestamp: new Date(Date.now() - 172800000) },
    { id: '5', title: 'System Design Principles', timestamp: new Date(Date.now() - 172800000 * 3) },
  ]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const groupSessionsByDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      Today: [] as ChatSession[],
      Yesterday: [] as ChatSession[],
      'Last 7 Days': [] as ChatSession[],
    };

    sessions.forEach((session) => {
      const sessionDate = new Date(session.timestamp);
      if (sessionDate.toDateString() === today.toDateString()) {
        groups.Today.push(session);
      } else if (sessionDate.toDateString() === yesterday.toDateString()) {
        groups.Yesterday.push(session);
      } else if (sessionDate >= lastWeek) {
        groups['Last 7 Days'].push(session);
      }
    });

    return groups;
  };

  const groupedSessions = groupSessionsByDate();

  const handleDeleteChat = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div className="flex h-full w-[260px] flex-col bg-[#F5F3EF]">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#EC4899] px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
        >
          <Plus className="size-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Icon Navigation */}
      <div className="flex items-center gap-1 px-3 pb-4">
        <button className="flex size-9 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-black/5">
          <MessageSquare className="size-4" />
        </button>
        <button className="flex size-9 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-black/5">
          <Clock className="size-4" />
        </button>
        <button className="flex size-9 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-black/5">
          <Star className="size-4" />
        </button>
        <button className="flex size-9 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-black/5">
          <Folder className="size-4" />
        </button>
        <button className="flex size-9 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-black/5">
          <Wrench className="size-4" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-auto px-3">
        {Object.entries(groupedSessions).map(([group, items]) =>
          items.length > 0 ? (
            <div key={group} className="mb-4">
              <h3 className="mb-1 px-2 text-xs font-medium text-[#6B6B6B]">{group}</h3>
              <div className="space-y-0.5">
                {items.map((session) => (
                  <div key={session.id} className="group relative">
                    <button className="w-full truncate rounded-lg px-3 py-2 pr-10 text-left text-sm text-[#1A1A1A] transition-colors hover:bg-black/5">
                      {session.title}
                    </button>

                    {/* 3-dot Menu Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === session.id ? null : session.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
                    >
                      <MoreVertical className="size-4 text-[#6B6B6B]" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === session.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-2 top-full z-20 mt-1 w-40 rounded-lg border border-black/10 bg-white py-1 shadow-lg">
                          <button
                            onClick={() => handleDeleteChat(session.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="size-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Profile Button */}
      <div className="border-t border-black/10 p-3">
        <button
          onClick={onProfileClick}
          className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#EC4899] text-white"
        >
          <span className="text-sm font-semibold">H</span>
        </button>
      </div>
    </div>
  );
}
