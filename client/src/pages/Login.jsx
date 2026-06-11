import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [tab, setTab] = useState('signin');
  const [direction, setDirection] = useState('right');
  const [animating, setAnimating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Navigate to chat once user state is updated after login/register
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const switchTab = useCallback((t) => {
    if (t === tab || animating) return;
    setDirection(t === 'signup' ? 'right' : 'left');
    setAnimating(true);
    setError('');
    setTimeout(() => {
      setTab(t);
      setAnimating(false);
    }, 280);
  }, [tab, animating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'signup') {
      if (!name || !email || !password || !confirmPassword) {
        setError('All fields are required');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setLoading(true);
      try {
        await register(name, email, password);
        // Navigation happens in useEffect when user state updates
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      setLoading(true);
      try {
        await login(email, password);
        // Navigation happens in useEffect when user state updates
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const slideOutClass = animating
    ? `animate-slide-out-${direction}`
    : '';
  const slideInClass = tab === 'signin'
    ? 'animate-slide-in-left'
    : 'animate-slide-in-right';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-6 relative overflow-y-auto"
      style={{ background: '#F5F0FF' }}
    >
      {/* Colored glow blobs */}
      <div className="fixed top-[-120px] left-[5%] w-[450px] h-[450px] rounded-full bg-[#c4b5fd] blur-[120px] pointer-events-none animate-float" />
      <div className="fixed bottom-[-150px] right-[5%] w-[500px] h-[500px] rounded-full bg-[#fbcfe8] blur-[140px] pointer-events-none animate-float-delayed" />
      <div className="fixed top-1/3 right-[10%] w-[350px] h-[350px] rounded-full bg-[#bae6fd] blur-[100px] pointer-events-none animate-float-slow" />
      <div className="fixed bottom-1/4 left-[10%] w-[300px] h-[300px] rounded-full bg-[#fde68a] blur-[90px] pointer-events-none animate-float-slow" />

      <div className="w-full max-w-md relative z-10 my-auto">
        {/* Brand Header - compact on mobile */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-4 animate-glow shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #DB2777, #2563EB)',
            }}
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome to{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #DB2777, #2563EB)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ANPA
            </span>
          </h1>
          <p className="text-text-secondary mt-1.5 sm:mt-2 text-xs sm:text-sm">Your world, beautifully built</p>
        </div>

        {/* Glass Auth Card - smaller padding on mobile */}
        <div
          className="rounded-[20px] sm:rounded-[24px] px-5 py-6 sm:px-10 sm:py-10 transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(124, 58, 237, 0.12)',
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.08), 0 2px 8px rgba(124, 58, 237, 0.04)',
          }}
        >
          {/* Tab Toggle */}
          <div className="relative flex rounded-xl p-1 mb-5 sm:mb-8" style={{ background: 'rgba(124, 58, 237, 0.06)' }}>
            <div
              className="absolute top-1 bottom-1 w-1/2 rounded-lg bg-gradient-btn shadow-md transition-all duration-300 ease-out"
              style={{
                left: tab === 'signin' ? '4px' : 'calc(50% - 4px)',
              }}
            />
            <button
              onClick={() => switchTab('signin')}
              className="relative flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 z-10"
              style={{
                color: tab === 'signin' ? '#ffffff' : undefined,
              }}
            >
              SIGN IN
            </button>
            <button
              onClick={() => switchTab('signup')}
              className="relative flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 z-10"
              style={{
                color: tab === 'signup' ? '#ffffff' : undefined,
              }}
            >
              SIGN UP
            </button>
          </div>

          {/* Form */}
          <div className="relative overflow-hidden">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className={`space-y-3 sm:space-y-4 relative z-10 ${animating ? slideOutClass : slideInClass}`}
              style={{ animationDuration: '0.28s' }}
            >
              {error && (
                <div className="bg-rose-500/8 border border-rose-500/15 text-rose-500 rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 animate-fade-in">
                  <svg className="w-4 h-4 shrink-0 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Full Name - signup only */}
              {tab === 'signup' && (
                <div className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
                  <label htmlFor="fullName" className="block text-xs font-medium text-text-muted mb-1 tracking-wide uppercase">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-text-primary rounded-xl px-4 py-2.5 sm:py-3 outline-none border transition-all duration-200 placeholder:text-text-muted focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 hover:border-purple-500/30"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(124, 58, 237, 0.15)',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.04)',
                    }}
                    placeholder="Full name"
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Email */}              <div>
                  <label htmlFor="email" className="block text-xs font-medium text-text-muted mb-1 tracking-wide uppercase">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-text-primary rounded-xl px-4 py-2.5 sm:py-3 outline-none border transition-all duration-200 placeholder:text-text-muted focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 hover:border-purple-500/30"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(124, 58, 237, 0.15)',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.04)',
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

              {/* Password */}              <div>
                  <label htmlFor="password" className="block text-xs font-medium text-text-muted mb-1 tracking-wide uppercase">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-text-primary rounded-xl px-4 py-2.5 sm:py-3 outline-none border transition-all duration-200 placeholder:text-text-muted focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 hover:border-purple-500/30"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(124, 58, 237, 0.15)',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.04)',
                    }}
                    placeholder={tab === 'signup' ? 'Min 6 characters' : 'Your password'}
                    autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                  />
                </div>

              {/* Confirm Password - signup only */}
              {tab === 'signup' && (
                <div className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-text-muted mb-1 tracking-wide uppercase">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-text-primary rounded-xl px-4 py-2.5 sm:py-3 outline-none border transition-all duration-200 placeholder:text-text-muted focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 hover:border-purple-500/30"
                    style={{
                      background: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(124, 58, 237, 0.15)',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.04)',
                    }}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="relative group pt-1 sm:pt-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3 sm:py-3.5 bg-gradient-btn text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm tracking-wide overflow-hidden"
                  style={{            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.25)' }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </span>
                  {loading ? (
                    <span className="relative flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {tab === 'signup' ? 'Creating account...' : 'Signing in...'}
                    </span>
                  ) : (
                    <span className="relative">{tab === 'signup' ? 'Create Account' : 'Sign In'}</span>
                  )}
                </button>
              </div>

              {/* Switch tab hint */}
              <p className="text-center text-xs text-text-muted pt-1 sm:pt-2">
                {tab === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button type="button" onClick={() => switchTab('signup')} className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchTab('signin')} className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-5 sm:mt-6 tracking-wide animate-fade-in">
          &copy; {new Date().getFullYear()} ANPA AI. All rights reserved.
        </p>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes slide-out-right {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-30px); }
        }
        @keyframes slide-out-left {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(30px); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-out-right { animation: slide-out-right 0.28s ease-out forwards; }
        .animate-slide-out-left { animation: slide-out-left 0.28s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.28s ease-out forwards; }
        .animate-slide-in-left { animation: slide-in-left 0.28s ease-out forwards; }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
