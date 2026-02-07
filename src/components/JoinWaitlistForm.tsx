import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { X } from 'lucide-react';

interface JoinWaitlistFormProps {
  onClose: () => void;
}

export const JoinWaitlistForm: React.FC<JoinWaitlistFormProps> = ({ onClose }) => {
  const [state, handleSubmit] = useForm("mojnqdnz");

  if (state.succeeded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm p-4">
        <div className="bg-surface border border-overlay p-8 rounded-xl shadow-2xl relative w-full max-w-md text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-subtle hover:text-text"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-pine/10 text-pine rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">You're on the list!</h2>
          <p className="text-subtle">
            Thanks for joining. We'll be in touch soon with exclusive access.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-surface border border-overlay text-text font-semibold rounded-lg hover:bg-overlay transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm p-4">
      <div className="bg-surface border border-overlay p-8 rounded-xl shadow-2xl relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-subtle hover:text-text"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-bold mb-2 text-center text-text">
          Join the Waitlist
        </h2>
        <p className="text-center text-subtle mb-8">
          Be the first to know when we launch.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full bg-overlay border border-muted/20 rounded p-2.5 text-text focus:outline-none focus:border-iris transition-colors"
              placeholder="you@company.com"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="text-love text-sm mt-1"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-muted mb-1">
              Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="w-full bg-overlay border border-muted/20 rounded p-2.5 text-text focus:outline-none focus:border-iris transition-colors resize-none"
              placeholder="Tell us about your team..."
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
              className="text-love text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="w-full bg-pine text-surface font-semibold py-2.5 rounded hover:bg-foam transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.submitting ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
      </div>
    </div>
  );
};
