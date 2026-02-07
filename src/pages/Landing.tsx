import React from 'react';
import { env } from '../lib';
import { ThemeToggle } from '../components/ThemeToggle';
const IMAGE_URL = `${env.API_URL}/public`
import {
  CheckCircle,
  FileText,
  Calendar,
  Users,
  Shield,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';

interface LandingProps {
  onSignInClick: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onSignInClick }) => {
  return (
    <div className="min-h-screen bg-base text-text font-sans overflow-x-hidden">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(var(--text) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={`${IMAGE_URL}/cognexa.png`} alt="Cognexa" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-xl font-bold tracking-tight text-text">Cognexa</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-subtle">
          <a href="#features" className="hover:text-text transition-colors">Features</a>
          <a href="#solutions" className="hover:text-text transition-colors">Solutions</a>
          <a href="#resources" className="hover:text-text transition-colors">Resources</a>
          <a href="#pricing" className="hover:text-text transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={onSignInClick}
            className="text-sm font-semibold text-text hover:text-pine transition-colors hidden sm:block"
          >
            Sign in
          </button>
          <button
            onClick={onSignInClick}
            className="text-sm font-semibold bg-surface border border-overlay px-4 py-2 rounded-lg hover:bg-overlay transition-colors shadow-sm text-text"
          >
            Get demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Hero Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-iris/10 text-iris text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={12} /> AI-Native Execution
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-text leading-[1.1] mb-6 tracking-tight">
              Think, plan, and track <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pine to-foam">
                all in one place
              </span>
            </h1>
            <p className="text-lg md:text-xl text-subtle mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Convert unstructured documents and meeting content into structured, conflict-aware tasks inside secure, role-based projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={onSignInClick}
                className="px-8 py-4 bg-pine text-surface text-lg font-semibold rounded-lg hover:bg-pine/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Get free demo
              </button>
              <button
                onClick={onSignInClick}
                className="px-8 py-4 bg-surface border border-overlay text-text text-lg font-semibold rounded-lg hover:bg-overlay transition-colors"
              >
                View documentation
              </button>
            </div>
            <p className="mt-4 text-sm text-muted">
              No credit card required · Enterprise ready · SOC2 Compliant
            </p>
          </div>
          {/* Hero Visuals (Floating Cards) */}
          <div className="relative h-[500px] w-full hidden lg:block perspective-1000">
            {/* Center Logo Floating */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-surface rounded-2xl shadow-2xl flex items-center justify-center border border-overlay z-20 animate-pulse">
              <img src={`${IMAGE_URL}/nx.png`} alt="NX" className="w-16 h-16 object-contain" />
            </div>

            {/* Top Right: Reminders Card */}
            <div className="absolute top-10 right-10 w-64 bg-surface p-4 rounded-xl shadow-xl border border-overlay transform rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-text">Reminders</span>
                <Clock size={16} className="text-love" />
              </div>
              <div className="bg-overlay/50 p-3 rounded-lg mb-2">
                <div className="text-sm font-medium">Q3 Strategy Meeting</div>
                <div className="text-xs text-subtle mt-1">13:00 - 13:45</div>
              </div>
              <div className="h-2 w-2/3 bg-muted/20 rounded"></div>
            </div>

            {/* Top Left: Sticky Note */}
            <div className="absolute top-20 left-0 w-56 bg-[#fff9c4] dark:bg-[#4a4528] p-4 rounded-lg shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-0">
              <div className="w-3 h-3 rounded-full bg-love mx-auto mb-2 opacity-50"></div>
              <p className="handwritten font-serif text-sm leading-relaxed text-text/80 italic">
                "Take notes to keep track of crucial details, and accomplish more tasks with ease."
              </p>
            </div>

            {/* Bottom Left: Tasks Card */}
            <div className="absolute bottom-10 left-10 w-72 bg-surface p-5 rounded-xl shadow-xl border border-overlay transform rotate-2 hover:rotate-0 transition-transform duration-500 z-20">
              <h3 className="font-bold text-text mb-4">Today's tasks</h3>
              <div className="space-y-3">
                <div className="bg-overlay/30 p-2 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-love rounded"></div>
                    <span className="text-xs font-medium">Campaign Launch</span>
                  </div>
                  <div className="w-16 h-1 bg-muted/20 rounded-full overflow-hidden">
                    <div className="h-full bg-love w-[60%]"></div>
                  </div>
                </div>
                <div className="bg-overlay/30 p-2 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-foam rounded"></div>
                    <span className="text-xs font-medium">Design PPT #4</span>
                  </div>
                  <div className="w-16 h-1 bg-muted/20 rounded-full overflow-hidden">
                    <div className="h-full bg-foam w-[90%]"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom Right: Integrations */}
            <div className="absolute bottom-20 right-0 w-60 bg-surface p-4 rounded-xl shadow-xl border border-overlay transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
              <div className="text-xs font-bold text-muted uppercase mb-3">Integrations</div>
              <div className="flex gap-4 justify-center">
                <img src={`${IMAGE_URL}/gmail.png`} alt="Gmail" className="w-10 h-10 rounded-lg bg-white shadow object-contain p-2" />
                <img src={`${IMAGE_URL}/slack.png`} alt="Slack" className="w-10 h-10 rounded-lg bg-white shadow object-contain p-2" />
                <img src={`${IMAGE_URL}/github.png`} alt="GitHub" className="w-10 h-10 rounded-lg bg-white shadow object-contain p-2" />
                <img src={`${IMAGE_URL}/calendar.png`} alt="Calendar" className="w-10 h-10 rounded-lg bg-white shadow object-contain p-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-surface relative z-10 border-t border-overlay">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-text mb-4">Execution Shouldn't Be Chaos</h2>
          <p className="text-subtle max-w-2xl mx-auto mb-16">
            Teams today struggle with fragmented tools, lost decisions, and endless manual data entry.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Lost Decisions", desc: "Key action items buried in transcript purgatory." },
              { title: "Manual Entry", desc: "Hours wasted copy-pasting from docs to Jira." },
              { title: "Scheduling Conflicts", desc: "Deadlines set without knowing resource availability." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-base border border-overlay">
                <div className="w-12 h-12 bg-rose/20 text-rose rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  !
                </div>
                <h3 className="text-lg font-bold text-text mb-2">{item.title}</h3>
                <p className="text-subtle text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Structure from Unstructured Data</h2>
            <p className="text-subtle max-w-2xl mx-auto">
              Cognexa uses advanced AI to parse your documents and meetings into actionable, conflict-aware project plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="col-span-1 lg:col-span-2 bg-surface border border-overlay rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-pine/10 p-3 rounded-lg text-pine"><FileText size={24} /></div>
                <span className="bg-pine/10 text-pine text-xs font-bold px-2 py-1 rounded">CORE</span>
              </div>
              <h3 className="text-2xl font-bold text-text mb-2">Intelligent Task Extraction</h3>
              <p className="text-subtle mb-6">
                Upload PDFs, text files, or meeting transcripts. Our engine automatically identifies tasks, deadlines, and assignees, converting them into a structured proposal you can review before committing.
              </p>
              <div className="w-full h-32 bg-base rounded-lg border border-overlay flex items-center justify-center text-muted text-sm">
                [ Document Parsing Visualization ]
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface border border-overlay rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-gold/10 p-3 rounded-lg text-gold w-fit mb-6"><Calendar size={24} /></div>
              <h3 className="text-xl font-bold text-text mb-2">Conflict-Aware Scheduling</h3>
              <p className="text-subtle">
                Cognexa detects calendar conflicts instantly. It suggests alternative time slots for deadlines based on team workload and existing commitments.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface border border-overlay rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="bg-iris/10 p-3 rounded-lg text-iris w-fit mb-6"><Users size={24} /></div>
              <h3 className="text-xl font-bold text-text mb-2">Role-Based Collaboration</h3>
              <p className="text-subtle">
                Invite stakeholders with granular permissions (Admin, Editor, Viewer). Keep your execution secure and focused.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="col-span-1 lg:col-span-2 bg-surface border border-overlay rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-foam/10 p-3 rounded-lg text-foam"><Shield size={24} /></div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-2">Enterprise-Grade Security</h3>
              <p className="text-subtle mb-6">
                Built for the enterprise with multi-tenant data isolation, encrypted storage, and audit logs.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-subtle">
                  <CheckCircle size={16} className="text-pine" /> SOC2 Ready
                </div>
                <div className="flex items-center gap-2 text-sm text-subtle">
                  <CheckCircle size={16} className="text-pine" /> GDPR Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-surface border-y border-overlay relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-text text-center mb-16">From Document to Done</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Upload", desc: "Drag & drop transcripts or requirement docs." },
              { step: "02", title: "Extract", desc: "AI identifies tasks, dates, and owners." },
              { step: "03", title: "Review", desc: "Approve the plan and resolve conflicts." },
              { step: "04", title: "Execute", desc: "Track progress in a structured dashboard." }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-black text-overlay absolute -top-8 -left-4 z-0 opacity-50">{item.step}</div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-text mb-2">{item.title}</h3>
                  <p className="text-subtle text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-text mb-6">Stop managing tasks manually. <br /> Start executing intelligently.</h2>
          <p className="text-lg text-subtle mb-10">
            Join forward-thinking product teams who have switched to AI-native project execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onSignInClick}
              className="px-8 py-4 bg-pine text-surface text-lg font-semibold rounded-lg hover:bg-pine/90 transition-all shadow-lg w-full sm:w-auto"
            >
              Get Started for Free
            </button>
            <button className="px-8 py-4 bg-transparent border border-overlay text-text text-lg font-semibold rounded-lg hover:bg-surface transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
              Talk to Sales <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-overlay py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-pine rounded flex items-center justify-center text-surface font-bold text-xs">C</div>
              <span className="font-bold text-text">Cognexa</span>
            </div>
            <p className="text-xs text-subtle">© 2024 Cognexa Inc.</p>
          </div>
          <div>
            <h4 className="font-bold text-text mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-subtle">
              <li><a href="#features" className="hover:text-pine">Features</a></li>
              <li><a href="#" className="hover:text-pine">Security</a></li>
              <li><a href="#pricing" className="hover:text-pine">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-text mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-subtle">
              <li><a href="#blog" className="hover:text-pine">Blog</a></li>
              <li><a href="#" className="hover:text-pine">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-text mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-subtle">
              <li><a href="#privacy" className="hover:text-pine">Privacy</a></li>
              <li><a href="#terms" className="hover:text-pine">Terms</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
