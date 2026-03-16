import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { AuthNavbar } from '../components/AuthNavbar';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const { register }                = useAuth();
  const navigate                    = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPass) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await register({ email, first_name: firstName, last_name: lastName, password, password_confirm: confirmPass });
      navigate('/');
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.details) {
        const first = Object.values(data.details)[0];
        setError(Array.isArray(first) ? first[0] : String(first));
      } else {
        setError(data?.error || 'Registration failed. Please try again.');
      }
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
            <h1 className="text-4xl md:text-5xl text-[#111827] dark:text-white mb-6">Get a free account</h1>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-lg mb-6">Over 50 lakh investors use FundVision for finding and tracking stock ideas.</p>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-12">Already registered?{' '}<Link to="/login" className="text-[#4F46E5] hover:text-[#4338CA]">Login here.</Link></p>
            <div className="mt-24">
              <p className="text-[#9CA3AF] italic text-sm mb-2">"The stock market is a device for transferring money from the impatient to the patient."</p>
              <p className="text-[#111827] dark:text-white font-medium">Warren Buffett</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#374151] rounded-2xl shadow-sm p-8 max-w-md w-full mx-auto">
            {error && <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#111827] dark:text-white text-sm mb-2">First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" required />
                </div>
                <div>
                  <label className="block text-[#111827] dark:text-white text-sm mb-2">Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" />
                </div>
              </div>
              <div>
                <label className="block text-[#111827] dark:text-white text-sm mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" required />
              </div>
              <div>
                <label className="block text-[#111827] dark:text-white text-sm mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" required minLength={8} />
              </div>
              <div>
                <label className="block text-[#111827] dark:text-white text-sm mb-2">Confirm Password</label>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full px-4 py-3 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" required />
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                By registering you agree to the <a href="#" className="text-[#4F46E5]">Terms of Use</a> and <a href="#" className="text-[#4F46E5]">Privacy Policy</a>.
              </p>
              <button type="submit" disabled={loading} className="w-full bg-[#4F46E5] text-white px-6 py-3 rounded-lg hover:bg-[#4338CA] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'CREATE ACCOUNT'}
              </button>
            </form>

            <p className="text-center text-[#6B7280] text-sm mt-6">
              Already registered?{' '}<Link to="/login" className="text-[#4F46E5] hover:text-[#4338CA]">Login here.</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
