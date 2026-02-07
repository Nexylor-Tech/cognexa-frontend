import { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Blog } from './pages/Blog';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';

function App() {
  // Hash-based routing state
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    // Route listener
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Normalize hash
  const currentPath = hash.replace('#', '') || '';

  // Routing Logic
  if (currentPath === 'blog') return <Blog />;
  if (currentPath === 'terms') return <Terms />;
  if (currentPath === 'privacy') return <Privacy />;

  // Default to Landing
  return <Landing />;
}

export default App;