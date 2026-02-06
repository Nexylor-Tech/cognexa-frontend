import React, { useEffect, useState } from 'react';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { authApi } from './services/api';
import type { User, Session } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const data = await authApi.getSession();
      if (data && data.user) {
        setUser(data.user);
        setSession(data.session);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error("Session check failed", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await authApi.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center text-text">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-iris rounded-full mb-4"></div>
          <p>Loading Cognexa...</p>
        </div>
      </div>
    );
  }

  // Hash Router simulation since we are in SPA without history API support in prompt guidelines (mostly)
  // Actually prompts allows HashRouter, but here we can just do simple conditional rendering 
  // based on Auth state since we only have Landing vs Dashboard.

  return (
    <>
      {user ? (
        <Dashboard user={user} onSignOut={handleSignOut} />
      ) : (
        <Landing onSuccess={fetchSession} />
      )}
    </>
  );
}

export default App;

