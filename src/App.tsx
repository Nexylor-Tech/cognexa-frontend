import { useEffect, useState } from 'react';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Blog } from './pages/Blog';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { AuthForm } from './components/AuthForm';
import { authApi } from './services/api';
import type { User, Session } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hash-based routing state
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    // Session check
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

    fetchSession();

    // Route listener
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSignOut = async () => {
    try {
      await authApi.signOut();
      setUser(null);
      setSession(null);
      window.location.hash = '';
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const handleAuthSuccess = async () => {
    const data = await authApi.getSession();
    if (data && data.user) {
      setUser(data.user);
      setSession(data.session);
      window.location.hash = '#dashboard';
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

  // Normalize hash
  const currentPath = hash.replace('#', '') || '';

  // Routing Logic

  // Public Pages that ignore auth state (mostly)
  if (currentPath === 'blog') return <Blog />;
  if (currentPath === 'terms') return <Terms />;
  if (currentPath === 'privacy') return <Privacy />;

  // Auth Page
  if (currentPath === 'auth') {
    if (user) {
      // Already logged in, redirect to dashboard
      window.location.hash = '#dashboard';
      return null;
    }
    return (
      <div className="min-h-screen bg-base flex flex-col">
        <nav className="p-6 flex justify-between items-center">
          <div
            className="text-2xl font-bold tracking-tight text-iris cursor-pointer"
            onClick={() => window.location.hash = ''}
          >
            Cognexa
          </div>
        </nav>
        <AuthForm
          onSuccess={handleAuthSuccess}
          onCancel={() => window.location.hash = ''}
        />
      </div>
    );
  }

  // Dashboard Protection
  if (user) {
    // If user is logged in and not on a public page, show dashboard
    // We accept #dashboard or empty hash as dashboard for logged in users
    return <Dashboard user={user} onSignOut={handleSignOut} />;
  }

  // Fallback / Landing
  // If not logged in and not on specific page, show Landing
  return <Landing onSignInClick={() => window.location.hash = '#auth'} />;
}

export default App;

