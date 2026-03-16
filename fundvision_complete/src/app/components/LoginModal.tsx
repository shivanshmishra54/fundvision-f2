/**
 * components/LoginModal.tsx
 * Modal popup triggered when a guest clicks a protected action (Follow, Export).
 * The backend returns HTTP 401 with { "trigger": "LOGIN_MODAL" }.
 * The axios interceptor fires a DOM event which AuthContext catches and sets showLoginModal=true.
 */

import { useState } from 'react';
import { X, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router';

export function LoginModal() {
  const { showLoginModal, closeLoginModal, login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeLoginModal}
    >
      {/* Modal card */}
      <div
        className="relative bg-white dark:bg-[#1F2937] rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#EEF2FF] dark:bg-[#312E81] rounded-full flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-6 h-6 text-[#4F46E5]" />
          </div>
          <h2 className="text-xl font-semibold text-[#111827] dark:text-white">Login required</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
            Sign in to follow stocks, export data and more.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#111827] dark:text-white mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#111827] dark:text-white mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F46E5] text-white py-3 rounded-lg hover:bg-[#4338CA] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-5">
          No account?{' '}
          <Link
            to="/register"
            onClick={closeLoginModal}
            className="text-[#4F46E5] hover:underline font-medium"
          >
            Register free
          </Link>
        </p>
      </div>
    </div>
  );
}
