import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { AuthNavbar } from '../components/AuthNavbar';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <AuthNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="pt-12">
            <h1 className="text-4xl md:text-5xl text-[#111827] dark:text-white mb-6">Welcome back!</h1>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-6">Login to access your personalized financial dashboard.</p>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-12">Don't have an account?{' '}<Link to="/register" className="text-[#4F46E5] hover:text-[#4338CA]">Register for free.</Link></p>
            <div className="mt-24">
              <p className="text-[#9CA3AF] italic text-sm mb-2">"I started investing at the age of 11. I was late!"</p>
              <p className="text-[#111827] dark:text-white font-medium">Warren Buffett</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#374151] rounded-2xl shadow-sm p-8 max-w-md w-full mx-auto">
            {error && <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-[#111827] dark:text-white text-sm mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" required />
              </div>
              <div className="mb-6">
                <label className="block text-[#111827] dark:text-white text-sm mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" required />
              </div>
              <div className="flex items-center justify-between mb-6">
                <button type="submit" disabled={loading} className="bg-[#4F46E5] text-white px-8 py-3 rounded-lg hover:bg-[#4338CA] transition-colors font-medium flex items-center gap-2 disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  {loading ? 'Logging in...' : 'LOGIN'}
                </button>
                <a href="#" className="text-[#4F46E5] text-sm hover:text-[#4338CA]">Lost password?</a>
              </div>
            </form>
            <p className="text-center text-[#6B7280] text-sm">Don't have an account?{' '}<Link to="/register" className="text-[#4F46E5] hover:text-[#4338CA]">Register for free.</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
