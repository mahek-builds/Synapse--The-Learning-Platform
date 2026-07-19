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
import { getStoredUserId, authFetch } from './utils/api';

interface ApiSession {
  id: string;
  title?: string | null;
  topic?: string | null;
  created_at?: string;
  updated_at?: string;
}


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return window.localStorage.getItem('synapse_authenticated') === 'true';
  });
  const [showProfile, setShowProfile] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'quiz' | 'explanation' | 'diagram'>('chat');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeCardData, setActiveCardData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(() => {
    const name = window.localStorage.getItem('synapse_user_name');
    const email = window.localStorage.getItem('synapse_user_email');
    return name && email ? { name, email } : null;
  });

  const loadSessions = useCallback(async () => {
    try {
      const response = await authFetch(`/chat/sessions/${getStoredUserId()}`);
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

  const loadProfile = useCallback(async () => {
    try {
      const response = await authFetch(`/users/${getStoredUserId()}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.email) {
          setUserProfile({
            name: data.name || 'Synapse User',
            email: data.email || 'user@synapse.local'
          });
          window.localStorage.setItem('synapse_user_name', data.name || 'Synapse User');
          window.localStorage.setItem('synapse_user_email', data.email || 'user@synapse.local');
        }
      }
    } catch (error) {
      console.error('Unable to load user profile:', error);
    }
  }, []);

  const updateProfileOnBackend = async (name: string, email: string) => {
    try {
      await authFetch(`/users/${getStoredUserId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
    } catch (error) {
      console.error('Unable to update profile on backend:', error);
    }
  };

  useEffect(() => {
    window.localStorage.setItem('synapse_authenticated', String(isAuthenticated));
    if (isAuthenticated) {
      loadSessions();
      loadProfile();
    }
  }, [isAuthenticated, loadSessions, loadProfile]);

  const handleCardClick = (type: string, data: any) => {
    setActiveCardData(data);
    if (type === 'quiz') setCurrentView('quiz');
    else if (type === 'explanation') setCurrentView('explanation');
    else if (type === 'diagram') setCurrentView('diagram');
  };

  const handleNewChat = () => {
    setCurrentView('chat');
    setActiveSessionId(null);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await authFetch(`/chat/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSessions((current) => current.filter((session) => session.id !== sessionId));
        if (activeSessionId === sessionId) setActiveSessionId(null);
      } else {
        console.error('Failed to permanently delete session');
      }
    } catch (error) {
      console.error('Error permanently deleting session:', error);
    }
  };

  const handleCloseFullPage = () => {
    setCurrentView('chat');
    setActiveCardData(null);
  };

  const handleLogin = (email: string) => {
    const defaultName = email.split('@')[0];
    const capitalizedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
    window.localStorage.setItem('synapse_user_name', capitalizedName);
    window.localStorage.setItem('synapse_user_email', email);
    setUserProfile({ name: capitalizedName, email });
    setIsAuthenticated(true);
    updateProfileOnBackend(capitalizedName, email);
  };

  const handleRegister = (name: string, email: string) => {
    window.localStorage.setItem('synapse_user_name', name);
    window.localStorage.setItem('synapse_user_email', email);
    setUserProfile({ name, email });
    setIsAuthenticated(true);
    updateProfileOnBackend(name, email);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('synapse_authenticated');
    window.localStorage.removeItem('synapse_user_name');
    window.localStorage.removeItem('synapse_user_email');
    window.localStorage.removeItem('synapse_user_id');
    setUserProfile(null);
    setIsAuthenticated(false);
    setCurrentView('chat');
    setActiveSessionId(null);
  };

  const renderAuthenticatedApp = () => {
    if (currentView === 'quiz') return <FullPageQuiz onClose={handleCloseFullPage} data={activeCardData} />;
    if (currentView === 'explanation') return <FullPageExplanation onClose={handleCloseFullPage} data={activeCardData} />;
    if (currentView === 'diagram') return <FullPageDiagram onClose={handleCloseFullPage} />;

    return (
      <div className="flex h-screen bg-[#FAFAF8]">
        <ClaudeSidebar
          onNewChat={handleNewChat}
          onProfileClick={() => setShowProfile(true)}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onDeleteSession={handleDeleteSession}
          userProfile={userProfile}
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
        {showProfile && (
          <ProfileModal
            onClose={() => setShowProfile(false)}
            userProfile={userProfile}
            onLogout={handleLogout}
          />
        )}
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage onRegister={handleRegister} />} />
        <Route path="/dashboard" element={isAuthenticated ? renderAuthenticatedApp() : <Navigate to="/login" replace />} />
        <Route path="/" element={isAuthenticated ? renderAuthenticatedApp() : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}