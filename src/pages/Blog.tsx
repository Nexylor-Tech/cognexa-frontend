import { env } from '../lib';
import { ThemeToggle } from '../components/ThemeToggle';

const IMAGE_URL = `${env.API_URL}/public`;

export const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "The Future of AI-Native Project Management",
      excerpt: "Why manual task entry is becoming obsolete in the enterprise.",
      date: "Oct 12, 2024",
      readTime: "5 min read",
      category: "Thought Leadership"
    },
    {
      id: 2,
      title: "Conflict-Aware Scheduling: A Technical Deep Dive",
      excerpt: "How we built the engine that prevents calendar clashes before they happen.",
      date: "Sep 28, 2024",
      readTime: "8 min read",
      category: "Engineering"
    },
    {
      id: 3,
      title: "From Transcript to Task: The parsing pipeline",
      excerpt: "A look at how Cognexa extracts structured data from unstructured meetings.",
      date: "Sep 15, 2024",
      readTime: "6 min read",
      category: "Product"
    }
  ];

  return (
    <div className="min-h-screen bg-base text-text font-sans">
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-overlay">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = ''}>
          <img src={`${IMAGE_URL}/cognexa.png`} alt="Cognexa" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-xl font-bold tracking-tight text-text">Cognexa</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-subtle hover:text-text hidden sm:block">Home</a>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text mb-4">The Cognexa Blog</h1>
          <p className="text-lg text-subtle">Insights on productivity, AI, and the future of work.</p>
        </div>

        <div className="space-y-12">
          {posts.map(post => (
            <article key={post.id} className="group cursor-pointer border border-overlay rounded-2xl p-8 hover:bg-surface transition-colors hover:shadow-lg">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted mb-3">
                <span className="text-iris">{post.category}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>
              <h2 className="text-2xl font-bold text-text mb-3 group-hover:text-pine transition-colors">
                {post.title}
              </h2>
              <p className="text-subtle mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center text-sm font-semibold text-pine group-hover:underline">
                Read Article <span className="ml-2">→</span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="bg-surface border-t border-overlay py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-subtle">© 2024 Cognexa Inc.</div>
          <div className="flex gap-6 text-sm font-medium text-subtle">
            <a href="#" className="hover:text-text">Home</a>
            <a href="#terms" className="hover:text-text">Terms</a>
            <a href="#privacy" className="hover:text-text">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

