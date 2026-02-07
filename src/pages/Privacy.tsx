import { ThemeToggle } from '../components/ThemeToggle';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-base text-text font-sans">
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-overlay">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = ''}>
          <div className="w-8 h-8 bg-pine rounded-lg flex items-center justify-center text-surface font-bold">C</div>
          <span className="text-xl font-bold tracking-tight text-text">Cognexa</span>
        </div>
        <ThemeToggle />
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-text mb-8">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert text-subtle">
          <p className="mb-4">Last Updated: October 26, 2024</p>

          <h3 className="text-xl font-semibold text-text mt-8 mb-4">1. Information We Collect</h3>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account, upload documents, or request customer support. This includes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Account information (name, email, password)</li>
            <li>Content you upload (documents, transcripts) for processing</li>
            <li>Usage data and logs</li>
          </ul>

          <h3 className="text-xl font-semibold text-text mt-8 mb-4">2. How We Use Information</h3>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, including using AI models to extract tasks from your documents. We do not sell your personal data.
          </p>

          <h3 className="text-xl font-semibold text-text mt-8 mb-4">3. Data Security</h3>
          <p className="mb-4">
            We implement enterprise-grade security measures designed to protect your data from unauthorized access, including encryption at rest and in transit.
          </p>

          <h3 className="text-xl font-semibold text-text mt-8 mb-4">4. Your Rights</h3>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal information. You can manage your account settings within the application or contact us for assistance.
          </p>
        </div>
      </main>

      <footer className="bg-surface border-t border-overlay py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-sm text-subtle">
          <a href="#" className="hover:text-text underline">Return to Home</a>
        </div>
      </footer>
    </div>
  );
};

