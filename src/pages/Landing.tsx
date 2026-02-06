import React, { useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { authApi } from '../services/api';

interface LandingProps {
  onSuccess: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onSuccess }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignIn) {
        await authApi.signIn(email, password);
      } else {
        await authApi.signUp(name, email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base text-text p-4">
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight text-iris">Cognexa</div>
        <ThemeToggle />
      </nav>

      <div className="w-full max-w-md bg-surface border border-overlay p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-text">
          {isSignIn ? 'Welcome Back' : 'Get Started'}
        </h2>
        <p className="text-center text-subtle mb-8">
          {isSignIn ? 'Sign in to access your workspace' : 'Create an account to join Cognexa'}
        </p>

        {error && (
          <div className="bg-love/10 border border-love/20 text-love p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-overlay border border-muted/20 rounded p-2.5 text-text focus:outline-none focus:border-iris transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-overlay border border-muted/20 rounded p-2.5 text-text focus:outline-none focus:border-iris transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-overlay border border-muted/20 rounded p-2.5 text-text focus:outline-none focus:border-iris transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pine text-surface font-semibold py-2.5 rounded hover:bg-foam transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isSignIn ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError('');
              }}
              className="text-gold hover:underline font-medium"
            >
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

