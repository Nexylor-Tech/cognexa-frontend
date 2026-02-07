import React, { useState } from 'react';
import { authApi } from '../services/api';

interface AuthFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onCancel }) => {
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
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-md mx-auto p-4">
      <div className="w-full bg-surface border border-overlay p-8 rounded-xl shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-subtle hover:text-text"
        >
          ✕
        </button>

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
