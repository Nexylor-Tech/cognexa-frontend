import { env } from '../lib';
import { ThemeToggle } from '../components/ThemeToggle';

const IMAGE_URL = `${env.API_URL}/public`;

export const Terms = () => {
  return (
    <div className="min-h-screen bg-base text-text font-sans">
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-overlay">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = ''}>
          <img src={`${IMAGE_URL}/cognexa.png`} alt="Cognexa" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-xl font-bold tracking-tight text-text">Cognexa</span>
        </div>
        <ThemeToggle />
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-text mb-8">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert text-subtle">
          <p className="mb-4">Effective Date: October 26, 2024</p>

          <h3 className="text-xl font-semibold text-text mt-8 mb-4">1. Acceptance of Terms</h3>
          <p className="mb-4">
            By accessing or using the Cognexa platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>

          <h3 className="text-xl font-semibold text-text mt-8 mb-4">2. Use of Service</h3>
          <p className="mb-4">
            Cognexa grants you a limited, non-exclusive, non-transferable license to use the Service for your internal business purposes in accordance with these Terms. You are responsible for all activity that occurs under your account.
          </p>

          <h3 className="text-xl font-semibold text-text mt-8 mb-4">3. AI & Data Processing</h3>
          <p className="mb-4">
            Our Service utilizes Artificial Intelligence to process documents and transcripts. By using the Service, you acknowledge that automated extraction may not always be 100% accurate and requires human review. You retain all rights to the data you upload.
          </p>

          <h3 className="text-xl font-semibold text-text mt-8 mb-4">4. Limitation of Liability</h3>
          <p className="mb-4">
            To the maximum extent permitted by law, Cognexa shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of the Service.
          </p>

          <h3 className="text-xl font-semibold text-text mt-8 mb-4">5. Contact</h3>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at legal@cognexa.com.
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

