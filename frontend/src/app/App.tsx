import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChatSession, ClaudeSidebar } from './components/ClaudeSidebar';
import { ClaudeChat } from './components/ClaudeChat';
import { ProfileModal } from './components/ProfileModal';
import { FullPageQuiz } from './components/FullPageQuiz';
import { FullPageExplanation } from './components/FullPageExplanation';
import { FullPageDiagram } from './components/FullPageDiagram';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';

interface ApiSession {
  id: string;
  title?: string | null;
  topic?: string | null;
  created_at?: string;
  updated_at?: string;
}

function getStoredUserId() {
  let userId = window.localStorage.getItem('synapse_user_id');
  if (!userId) {
    userId = window.crypto.randomUUID();
    window.localStorage.setItem('synapse_user_id', userId);
  }
  return userId;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'quiz' | 'explanation' | 'diagram'>('chat');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const response = await fetch(`/chat/sessions/${getStoredUserId()}`);
      if (!response.ok) throw new Error('Unable to load conversations');
      const data: ApiSession[] = await response.json();
      setSessions(data.map((session) => ({
        id: session.id,
        title: session.title || session.topic || 'Untitled chat',
        timestamp: new Date(session.updated_at || session.created_at || Date.now()),
      })));
    } catch (error) {
      console.error('Unable to load chat sessions:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadSessions();
  }, [isAuthenticated, loadSessions]);

  const handleCardClick = (type: string) => {
    if (type === 'quiz') setCurrentView('quiz');
    else if (type === 'explanation') setCurrentView('explanation');
    else if (type === 'diagram') setCurrentView('diagram');
  };

  const handleNewChat = () => {
    setCurrentView('chat');
    setActiveSessionId(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    // The current backend has no DELETE endpoint, so this removes it from this UI only.
    setSessions((current) => current.filter((session) => session.id !== sessionId));
    if (activeSessionId === sessionId) setActiveSessionId(null);
  };

  const renderAuthenticatedApp = () => {
    if (currentView === 'quiz') return <FullPageQuiz onClose={() => setCurrentView('chat')} />;
    if (currentView === 'explanation') return <FullPageExplanation onClose={() => setCurrentView('chat')} />;
    if (currentView === 'diagram') return <FullPageDiagram onClose={() => setCurrentView('chat')} />;

    return (
      <div className="flex h-screen bg-[#FAFAF8]">
        <ClaudeSidebar
          onNewChat={handleNewChat}
          onProfileClick={() => setShowProfile(true)}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onDeleteSession={handleDeleteSession}
        />
        <div className="flex-1">
          <ClaudeChat
            onCardClick={handleCardClick}
            sessionId={activeSessionId}
            onSessionCreated={(sessionId) => {
              setActiveSessionId(sessionId);
              loadSessions();
            }}
            onSessionUpdated={loadSessions}
          />
        </div>
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage onRegister={() => setIsAuthenticated(true)} />} />
        <Route path="/dashboard" element={isAuthenticated ? renderAuthenticatedApp() : <Navigate to="/login" replace />} />
        <Route path="/" element={isAuthenticated ? renderAuthenticatedApp() : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}