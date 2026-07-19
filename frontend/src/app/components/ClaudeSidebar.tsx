import { useState } from 'react';
import { Plus, MessageSquare, Clock, Star, Folder, Wrench, MoreVertical, Trash2 } from 'lucide-react';

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

export function ClaudeSidebar({
  onNewChat,
  onProfileClick,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  userProfile,
}: {
  onNewChat: () => void;
  onProfileClick: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  userProfile: { name: string; email: string } | null;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const groups = { Today: [] as ChatSession[], Yesterday: [] as ChatSession[], 'Last 7 Days': [] as ChatSession[] };

  sessions.forEach((session) => {
    if (session.timestamp.toDateString() === today.toDateString()) groups.Today.push(session);
    else if (session.timestamp.toDateString() === yesterday.toDateString()) groups.Yesterday.push(session);
    else if (session.timestamp >= lastWeek) groups['Last 7 Days'].push(session);
  });

  const handleDelete = (sessionId: string) => {
    onDeleteSession(sessionId);
    setOpenMenuId(null);
  };

  return (
    <div className="flex h-full w-[260px] flex-col bg-[#F5F3EF]">
      <div className="p-3">
        <button onClick={onNewChat} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#EC4899] px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90">
          <Plus className="size-4" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex items-center gap-1 px-3 pb-4">
        {[MessageSquare, Clock, Star, Folder, Wrench].map((Icon, index) => (
          <button key={index} className="flex size-9 items-center justify-center rounded-lg text-[#6B6B6B] transition-colors hover:bg-black/5">
            <Icon className="size-4" />
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3">
        {Object.entries(groups).map(([group, items]) => items.length > 0 && (
          <div key={group} className="mb-4">
            <h3 className="mb-1 px-2 text-xs font-medium text-[#6B6B6B]">{group}</h3>
            <div className="space-y-0.5">
              {items.map((session) => (
                <div key={session.id} className="group relative">
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className={`w-full truncate rounded-lg px-3 py-2 pr-10 text-left text-sm text-[#1A1A1A] transition-colors hover:bg-black/5 ${activeSessionId === session.id ? 'bg-black/5 font-medium' : ''}`}
                  >
                    {session.title}
                  </button>
                  <button
                    onClick={(event) => { event.stopPropagation(); setOpenMenuId(openMenuId === session.id ? null : session.id); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
                    aria-label={`More options for ${session.title}`}
                  >
                    <MoreVertical className="size-4 text-[#6B6B6B]" />
                  </button>
                  {openMenuId === session.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                      <div className="absolute right-2 top-full z-20 mt-1 w-40 rounded-lg border border-black/10 bg-white py-1 shadow-lg">
                        <button onClick={() => handleDelete(session.id)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50">
                          <Trash2 className="size-4" />
                          <span>Hide</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-black/10 p-3">
        <button onClick={onProfileClick} className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6366F1] to-[#EC4899] text-white">
          <span className="text-sm font-semibold">{userProfile?.name?.charAt(0).toUpperCase() || 'U'}</span>
        </button>
      </div>
    </div>
  );
}