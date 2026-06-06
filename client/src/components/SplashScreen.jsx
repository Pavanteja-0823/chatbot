import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen({ onComplete }) {
  const navigate = useNavigate();

  const handleGetStarted = useCallback(() => {
    onComplete?.();
    navigate('/login');
  }, [onComplete, navigate]);

  const handleSignIn = useCallback(
    (e) => {
      e.preventDefault();
      onComplete?.();
      navigate('/login');
    },
    [onComplete, navigate]
  );

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none" style={{ background: '#F5F0FF' }}>
      {/* Background Blobs */}
      <div className="blob blob--purple" aria-hidden="true" />
      <div className="blob blob--pink" aria-hidden="true" />
      <div className="blob blob--blue" aria-hidden="true" />
      <div className="blob blob--amber" aria-hidden="true" />

      {/* Hero Content */}
      <div className="hero">
        <p className="eyebrow">Create · Connect · Elevate</p>

        <div className="card">
          <h1 className="card-name">Anpa</h1>
          <p className="card-tagline">Your world, beautifully built</p>
        </div>

        <div className="dots" aria-hidden="true">
          <span className="dot dot--purple" />
          <span className="dot dot--pink" />
          <span className="dot dot--blue" />
        </div>

        <div className="btn-wrapper">
          <button className="btn-start" onClick={handleGetStarted}>
            Get Started
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9h10" />
            <path d="M10 5l4 4-4 4" />
          </svg>
          </button>
        </div>

        <p className="signin-link">
          Already have an account?{' '}
          <a onClick={handleSignIn} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleSignIn(e)}>
            Sign in
          </a>
        </p>
      </div>

      {/* Styles */}
      <style>{`
        /* Blob Animations */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          will-change: transform;
          pointer-events: none;
        }

        .blob--purple {
          width: 550px;
          height: 550px;
          background: #c4b5fd;
          top: -120px;
          left: -120px;
          animation: blobMove1 12s ease-in-out alternate infinite;
        }

        .blob--pink {
          width: 520px;
          height: 520px;
          background: #fbcfe8;
          bottom: -120px;
          right: -120px;
          animation: blobMove2 14s ease-in-out alternate infinite;
        }

        .blob--blue {
          width: 480px;
          height: 480px;
          background: #bae6fd;
          bottom: -100px;
          left: -100px;
          animation: blobMove3 10s ease-in-out alternate infinite;
        }

        .blob--amber {
          width: 500px;
          height: 500px;
          background: #fde68a;
          top: -100px;
          right: -100px;
          animation: blobMove4 13s ease-in-out alternate infinite;
        }

        @keyframes blobMove1 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(60px, 40px) scale(1.15); }
          66%  { transform: translate(-30px, 80px) scale(0.9); }
          100% { transform: translate(40px, 20px) scale(1.08); }
        }

        @keyframes blobMove2 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(-50px, -30px) scale(1.12); }
          66%  { transform: translate(40px, -60px) scale(0.92); }
          100% { transform: translate(-30px, -20px) scale(1.05); }
        }

        @keyframes blobMove3 {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(40px, -40px) scale(1.1); }
          50%  { transform: translate(-20px, -70px) scale(0.95); }
          75%  { transform: translate(60px, -30px) scale(1.05); }
          100% { transform: translate(10px, 0) scale(1); }
        }

        @keyframes blobMove4 {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(-40px, 30px) scale(1.08); }
          50%  { transform: translate(30px, 50px) scale(0.93); }
          75%  { transform: translate(-50px, 20px) scale(1.1); }
          100% { transform: translate(-10px, 0) scale(1); }
        }

        /* Fade-Up Keyframe */
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Bob Float Keyframe */
        @keyframes bobFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        /* Hero Container */
        .hero {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 100vh;
          padding: 0 24px;
        }

        /* Eyebrow Text */
        .eyebrow {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 16px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #7C3AED;
          opacity: 0;
          animation: fadeUp 0.8s ease-out 0.2s forwards;
        }

        /* Frosted Glass Card */
        .card {
          margin-top: 28px;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 52px 72px 40px;
          box-shadow:
            0 8px 40px rgba(124, 58, 237, 0.12),
            0 2px 8px rgba(124, 58, 237, 0.06);
          opacity: 0;
          animation: fadeUp 0.9s ease-out 0.5s forwards,
                     bobFloat 4s ease-in-out 1.5s infinite;
        }

        .card-name {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 110px;
          line-height: 1;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #7C3AED, #DB2777, #2563EB);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-tagline {
          margin-top: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 18px;
          color: #6B7280;
          letter-spacing: 0.02em;
        }

        /* Divider Dots */
        .dots {
          display: flex;
          gap: 14px;
          margin-top: 36px;
          opacity: 0;
          animation: fadeUp 0.7s ease-out 1s forwards;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot--purple { background: #7C3AED; }
        .dot--pink   { background: #DB2777; }
        .dot--blue   { background: #2563EB; }

        /* Button */
        .btn-wrapper {
          margin-top: 36px;
          opacity: 0;
          animation: fadeUp 0.8s ease-out 1.2s forwards;
        }

        .btn-start {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 52px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 18px;
          color: #ffffff;
          background: linear-gradient(135deg, #7C3AED, #DB2777);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          overflow: hidden;
          outline: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          will-change: transform;
        }

        .btn-start::before {
          content: '';
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.30) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
          transition: left 0.6s ease;
          pointer-events: none;
        }

        .btn-start:hover::before {
          left: 125%;
        }

        .btn-start:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(124, 58, 237, 0.40);
        }

        .btn-start:active {
          transform: translateY(0) scale(0.98);
        }

        /* Sign-in Link */
        .signin-link {
          margin-top: 24px;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 16px;
          color: #6B7280;
          opacity: 0;
          animation: fadeUp 0.8s ease-out 1.5s forwards;
        }

        .signin-link a {
          color: #7C3AED;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .signin-link a:hover {
          color: #6D28D9;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .card {
            padding: 28px 24px 24px;
          }

          .card-name {
            font-size: 52px;
          }

          .card-tagline {
            font-size: 14px;
          }

          .card {
            padding: 36px 32px 28px;
          }

          .card-name {
            font-size: 64px;
          }

          .card-tagline {
            font-size: 15px;
          }

          .btn-start {
            padding: 14px 36px;
            font-size: 16px;
          }

          .eyebrow {
            font-size: 13px;
          }

          .dots {
            gap: 10px;
            margin-top: 28px;
          }

          .dot {
            width: 9px;
            height: 9px;
          }

          .blob--purple { width: 320px; height: 320px; top: -80px; left: -80px; }
          .blob--pink   { width: 300px; height: 300px; bottom: -80px; right: -80px; }
          .blob--blue   { width: 280px; height: 280px; bottom: -60px; left: -60px; }
          .blob--amber  { width: 290px; height: 290px; top: -60px; right: -60px; }
        }
      `}</style>
    </div>
  );
}
