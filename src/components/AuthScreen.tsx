import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("Could not sign in as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent animate-scan-line" />
      </div>

      {/* CRT overlay */}
      <div className="crt-overlay" />
      <div className="noise-overlay" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg className="w-7 h-7 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              <span className="gradient-text">PULSE</span>
              <span className="text-zinc-400 font-light">FEED</span>
            </h1>
          </div>
          <p className="text-zinc-500 font-mono text-sm tracking-wider uppercase">
            Real-time Weather • News • AI Assistant
          </p>
        </div>

        {/* Auth form */}
        <div className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-semibold text-zinc-100 mb-6 font-display">
            {flow === "signIn" ? "Welcome back" : "Create account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 transition-all focus:border-amber-500/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 transition-all focus:border-amber-500/50"
                placeholder="••••••••"
              />
            </div>

            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : flow === "signIn" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-sm">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <button
            onClick={handleAnonymous}
            disabled={isLoading}
            className="w-full mt-6 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium rounded-xl transition-all disabled:opacity-50"
          >
            Continue as Guest
          </button>

          <p className="mt-6 text-center text-sm text-zinc-500">
            {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
            >
              {flow === "signIn" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-zinc-600 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Requested by @LBallz77283 · Built by @clonkbot
        </footer>
      </div>
    </div>
  );
}
