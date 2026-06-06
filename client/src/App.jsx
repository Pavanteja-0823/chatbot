import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';
import Chat from './pages/Chat';

export default function App() {
  const { user, loading } = useAuth();
  const [splashComplete, setSplashComplete] = useState(false);

  // Check if splash has been shown this session
  const [splashSeen, setSplashSeen] = useState(() => {
    return sessionStorage.getItem('anpa_splash_seen') === 'true';
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('anpa_splash_seen', 'true');
    setSplashComplete(true);
  };

  // Auto-skip splash if user already seen it this session
  useEffect(() => {
    if (user && splashSeen) {
      setSplashComplete(true);
    }
  }, [user, splashSeen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-btn shadow-premium-sm flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent-blue border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <>
      {!splashComplete && !splashSeen && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      <div className={splashComplete || splashSeen ? 'fade-in' : ''}>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
