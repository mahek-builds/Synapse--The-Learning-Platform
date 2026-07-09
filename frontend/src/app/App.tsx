import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClaudeSidebar } from './components/ClaudeSidebar';
import { ClaudeChat } from './components/ClaudeChat';
import { ProfileModal } from './components/ProfileModal';
import { FullPageQuiz } from './components/FullPageQuiz';
import { FullPageExplanation } from './components/FullPageExplanation';
import { FullPageDiagram } from './components/FullPageDiagram';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentView, setCurrentView] = useState<'chat' | 'quiz' | 'explanation' | 'diagram'>('chat');

  const handleCardClick = (type: string) => {
    if (type === 'quiz') setCurrentView('quiz');
    else if (type === 'explanation') setCurrentView('explanation');
    else if (type === 'diagram') setCurrentView('diagram');
  };

  const handleNewChat = () => {
    setCurrentView('chat');
  };

  const renderAuthenticatedApp = () => {
    if (currentView === 'quiz') {
      return <FullPageQuiz onClose={() => setCurrentView('chat')} />;
    }

    if (currentView === 'explanation') {
      return <FullPageExplanation onClose={() => setCurrentView('chat')} />;
    }

    if (currentView === 'diagram') {
      return <FullPageDiagram onClose={() => setCurrentView('chat')} />;
    }

    return (
      <div className="flex h-screen bg-[#FAFAF8]">
        <ClaudeSidebar onNewChat={handleNewChat} onProfileClick={() => setShowProfile(true)} />
        <div className="flex-1">
          <ClaudeChat onCardClick={handleCardClick} />
        </div>
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage onRegister={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? renderAuthenticatedApp() : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={isAuthenticated ? renderAuthenticatedApp() : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
