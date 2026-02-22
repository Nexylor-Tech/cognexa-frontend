import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { env } from '../lib';
import { ThemeToggle } from '../components/ThemeToggle';
const IMAGE_URL = `${env.API_URL}/public`

interface LandingProps {
  onSignInClick: () => void;
}
export const Landing: React.FC<LandingProps> = ({ onSignInClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-base text-text font-sans overflow-x-hidden selection:bg-iris/30">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(var(--text) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-100 flex justify-center pointer-events-none">
        <motion.nav
          initial={false}
          animate={{
            width: isScrolled ? "min(600px, 90%)" : "100%",
            marginTop: isScrolled ? "1.5rem" : "0rem",
            borderRadius: isScrolled ? "5px" : "0px",
            backgroundColor: isScrolled ? "rgba(var(--surface-rgb), 0.9)" : "transparent",
            boxShadow: isScrolled ? "0 20px 40px -10px rgba(0,0,0,0.3)" : "none",
            border: isScrolled ? "1px solid rgba(var(--iris-rgb), 0.3)" : "1px solid transparent",
            padding: isScrolled ? "0.5rem 1.5rem" : "0rem 3rem",
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className={`pointer-events-auto flex items-center justify-between h-16 backdrop-blur-xl`}
        >
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.location.hash = ''}>
            <img src={`${IMAGE_URL}/cognexa.png`} alt="Cognexa Logo" className="w-8 h-8 rounded-[5px] shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-text">
              Cognexa
            </span>
          </div>

          <AnimatePresence>
            <motion.div
              className="hidden md:flex items-center gap-8 text-sm font-medium text-subtle px-4 overflow-hidden whitespace-nowrap"
            >
              <a href="#features" className="hover:text-text transition-colors">Features</a>
              <a href="#blog" className="hover:text-text transition-colors">Blogs</a>
              <a href="#pricing" className="hover:text-text transition-colors">Pricing</a>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4 shrink-0">
            <ThemeToggle />
            <button
              onClick={onSignInClick}
              className="text-sm font-semibold bg-iris text-surface border border-iris/20 px-4 py-2 rounded-[5px] hover:bg-iris/90 transition-all shadow-lg shadow-iris/20 whitespace-nowrap"
            >
              Sign Up
            </button>
          </div>
        </motion.nav>
      </div>

      <div className="h-20"></div> {/* Spacer for fixed nav */}

      {/* Hero Section */}
      <section className="relative z-10 min-h-[calc(100vh-5rem)] flex items-center px-6 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">

          {/* Hero Copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={revealVariants}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-text leading-[1.1] mb-6 tracking-tight">
              Think, plan, and track <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-pine to-foam">
                all in one place
              </span>
            </h1>
            <p className="text-lg md:text-xl text-subtle mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Convert unstructured documents and meeting content into structured, conflict-aware tasks inside secure, role-based projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={onSignInClick}
                className="px-8 py-4 bg-pine text-surface text-lg font-semibold rounded-[5px] hover:bg-pine/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </div>
            <p className="mt-4 text-sm text-muted">
              No credit card required · Enterprise ready · SOC2 Compliant
            </p>
          </motion.div>

          {/* Hero Visuals (Floating Cards) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-125 w-full hidden lg:block perspective-1000"
          >
            {/* Center Logo Floating (NX style) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-surface rounded-[5px] shadow-2xl flex items-center justify-center border border-overlay z-20">
              <img src={`${IMAGE_URL}/nx.png`} alt="NX" className="w-12 h-12 object-contain" />
            </div>

            {/* Top Right: Reminders Card */}
            <div className="absolute top-0 right-0 w-64 bg-surface p-4 rounded-[5px] shadow-xl border border-overlay transform rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-text">Reminders</span>
              </div>
              <div className="bg-overlay/50 p-3 rounded-[5px] mb-2">
                <div className="text-sm font-medium">Q3 Strategy Meeting</div>
                <div className="text-xs text-subtle mt-1">13:00 - 13:45</div>
              </div>
              <div className="h-2 w-2/3 bg-muted/20 rounded-[5px]"></div>
            </div>

            {/* Top Left: Sticky Note */}
            <div className="absolute top-10 left-1/4 w-56 bg-surface p-4 rounded-[5px] shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-0">
              <div className="w-3 h-3 rounded-full bg-love mx-auto mb-2 opacity-50"></div>
              <p className="handwritten font-serif text-sm leading-relaxed text-text/80 italic">
                "Take notes to keep track of crucial details, and accomplish more tasks with ease."
              </p>
            </div>

            {/* Bottom Left: Tasks Card */}
            <div className="absolute bottom-0 left-10 w-72 bg-surface p-5 rounded-[5px] shadow-xl border border-overlay transform rotate-2 hover:rotate-0 transition-transform duration-500 z-20">
              <h3 className="font-bold text-text mb-4">Today's tasks</h3>
              <div className="space-y-3">
                <div className="bg-overlay/30 p-2 rounded-[5px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-love rounded-[5px]"></div>
                    <span className="text-xs font-medium">Campaign Launch</span>
                  </div>
                  <div className="w-16 h-1 bg-muted/20 rounded-[5px] overflow-hidden">
                    <div className="h-full bg-love w-[60%]"></div>
                  </div>
                </div>
                <div className="bg-overlay/30 p-2 rounded-[5px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-foam rounded-[5px]"></div>
                    <span className="text-xs font-medium">Design PPT #4</span>
                  </div>
                  <div className="w-16 h-1 bg-muted/20 rounded-[5px] overflow-hidden">
                    <div className="h-full bg-foam w-[90%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right: Integrations */}
            <div className="absolute bottom-10 right-0 w-60 bg-surface p-4 rounded-[5px] shadow-xl border border-overlay transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
              <div className="text-xs font-bold text-muted uppercase mb-3">Integrations</div>
              <div className="flex gap-3 justify-center">
                <div className="w-10 h-10 rounded-[5px] bg-white shadow flex items-center justify-center"><img src={`${IMAGE_URL}/gmail.png`} className="w-6 h-6 object-contain" alt="Gmail" /></div>
                <div className="w-10 h-10 rounded-[5px] bg-white shadow flex items-center justify-center"><img src={`${IMAGE_URL}/slack.png`} className="w-6 h-6 object-contain" alt="Slack" /></div>
                <div className="w-10 h-10 rounded-[5px] bg-white shadow flex items-center justify-center"><img src={`${IMAGE_URL}/github.png`} className="w-6 h-6 object-contain" alt="GitHub" /></div>
                <div className="w-10 h-10 rounded-[5px] bg-white shadow flex items-center justify-center"><img src={`${IMAGE_URL}/calendar.png`} className="w-6 h-6 object-contain" alt="Calendar" /></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cognitive Layer Section */}
      <section ref={containerRef} className="relative py-32 px-6 overflow-hidden border-y border-overlay">
        <motion.div style={{ scale, opacity }} className="relative mx-auto w-fit">
          <img
            src={`${IMAGE_URL}/dashboard.png`}
            className="block max-w-full h-auto object-contain opacity-100 rounded-[5px] shadow-2xl border border-overlay"
            alt="Cognitive Layer Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0"></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto mt-[-10%] flex flex-col items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={revealVariants}
            className="max-w-3xl text-center bg-base p-8 rounded-[5px] shadow-xl border border-overlay"
          >
            <h2 className="text-4xl font-black text-text leading-tight mb-8">
              Cognexa Is Not a Storage Tool. <br />
              <span className="text-iris">It’s a Cognitive Layer.</span>
            </h2>
            <ul className="grid md:grid-cols-2 gap-6 mb-12 text-left">
              {[
                "Reads your project documents",
                "Processes meeting transcripts privately",
                "Extracts action items automatically",
                "Tracks task state from structured data",
                "Surfaces risks before they escalate",
                "Answers project-level questions intelligently",
                "Automates Slack + Calendar updates",
                "Connects files, tasks, meetings, and chat into one reasoning layer"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-lg font-medium text-subtle"
                >
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-iris shrink-0"></div>
                  {item}
                </motion.li>
              ))}
            </ul>
            <div className="pt-8 border-t border-overlay">
              <p className="text-2xl font-serif italic text-text">
                "It doesn’t just store. <span className="text-iris font-bold not-italic">It understands.</span>"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Show It Working Steps */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={revealVariants}
            className="text-center mb-24"
          >
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-iris mb-4">Concrete Scenarios</h2>
            <h3 className="text-5xl font-black text-text tracking-tight">Show It Working.</h3>
          </motion.div>

          <div className="space-y-40">
            {[
              {
                step: "01",
                user: "uploads: documents",
                action: "Processes document",
                result: "Extracts schedules, Detects tasks",
                footer: "Embeds knowledge into project memory",
                img: `${IMAGE_URL}/files.png`
              },
              {
                step: "02",
                user: "“Who are the attendees in the meeting?”",
                action: "Extracts meeting participants",
                result: "Groups them by event",
                footer: "Responds with structured clarity",
                img: `${IMAGE_URL}/chatbot.png`
              }
            ].map((item, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.8 }}
                  className="w-full lg:w-1/2 flex justify-center"
                >
                  <div className="relative rounded-[5px] overflow-hidden shadow-2xl group border border-overlay w-fit">
                    <img
                      src={item.img}
                      className="block max-w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-110"
                      alt={`Step ${item.step}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[0px] group-hover:bg-black/20 transition-colors"></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full lg:w-1/2 space-y-6"
                >
                  <div className="text-6xl font-black text-overlay mb-4">{item.step}</div>
                  <h4 className="text-3xl font-bold text-text">{item.footer}</h4>

                  {/* Moved Content Card */}
                  <div className=" p-8 rounded-[5px] mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-[5px] bg-iris flex items-center justify-center text-xs font-bold text-surface">U</div>
                      <p className="italic text-xl font-medium text-text">{item.user}</p>
                    </div>
                    <div className="h-px bg-overlay my-6"></div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-iris font-black text-xs uppercase tracking-widest">
                        Cognexa
                      </div>
                      <p className="text-2xl font-bold leading-tight text-text">{item.action}</p>
                      <p className="text-subtle text-lg">{item.result}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Cognexa Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={revealVariants}
            className="text-3xl font-black text-text text-center mb-16"
          >
            Why Cognexa Is Better
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 justify-items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="space-y-6 flex flex-col items-center"
            >
              <h3 className="text-xl font-bold text-muted uppercase tracking-widest text-center">Traditional Tools</h3>
              <ul className="space-y-4 w-full max-w-xs">
                {["Passive", "Fragmented", "Manual", "Reactive"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-lg text-subtle line-through opacity-50"
                  >
                    <div className="w-2 h-2 rounded-full bg-muted shrink-0"></div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="space-y-6 flex flex-col items-center"
            >
              <h3 className="text-xl font-bold text-iris uppercase tracking-widest text-center">Cognexa</h3>
              <ul className="space-y-4 w-full max-w-xs">
                {["Active", "Connected", "Automated", "Proactive"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-lg font-bold text-text"
                  >
                    <div className="w-2 h-2 rounded-full bg-iris shrink-0"></div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            className="mt-20 text-center"
          >
            <p className="text-xl text-subtle leading-relaxed">
              Instead of humans stitching context together, <span className="text-text font-bold">Cognexa does it.</span> <br />
              Instead of remembering everything, <span className="text-iris font-bold">You focus on building.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-text mb-6">Stop managing tasks manually. <br /> Start executing intelligently.</h2>
          <p className="text-lg text-subtle mb-10">
            Join forward-thinking product teams who have switched to AI-native project execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onSignInClick}
              className="px-8 py-4 bg-pine text-surface text-lg font-semibold rounded-[5px] hover:bg-pine/90 transition-all shadow-lg w-full sm:w-auto"
            >
              Try Cognexa
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-overlay py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.location.hash = ''}>
              <img src={`${IMAGE_URL}/cognexa.png`} alt="Cognexa Logo" className="w-5 h-5 rounded-[5px] shadow-sm" />
              <span className="text-md font-bold tracking-tight text-text">
                Cognexa
              </span>
            </div>
            <p className="text-xs text-subtle">© 2026 Cognexa Inc.</p>
          </div>
          <div>
            <h4 className="font-bold text-text mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-subtle">
              <li><a href="#features" className="hover:text-pine">Features</a></li>
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
