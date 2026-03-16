import { useNavigate } from 'react-router';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from './SearchBar';
import { ToolsDropdown } from './ToolsDropdown';

export function AuthNavbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-[#374151]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-2.5 flex items-center gap-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
            <rect x="0"  y="10" width="5" height="10" rx="1" fill="#16A34A" />
            <rect x="6"  y="5"  width="5" height="15" rx="1" fill="#16A34A" />
            <rect x="12" y="0"  width="5" height="20" rx="1" fill="#4ADE80" />
            <rect x="17" y="7"  width="5" height="13" rx="1" fill="#16A34A" opacity="0.7" />
          </svg>
          <span className="text-[#111827] dark:text-white font-bold text-base tracking-tight">FundVision</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate('/')} className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors text-xs tracking-widest">HOME</button>
          <button className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors text-xs tracking-widest">VISION</button>
          <ToolsDropdown />
        </div>

        <div className="hidden md:flex relative flex-shrink-0 w-52 ml-auto">
          <SearchBar />
        </div>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5">
                {user.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt={user.full_name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-xs font-semibold">{user.initials}</div>
                )}
                <span className="text-sm text-[#111827] dark:text-white font-medium">{user.first_name}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors text-xs tracking-widest px-3 py-1.5">
                <LogOut className="w-3.5 h-3.5" /> LOGOUT
              </button>
            </>
          ) : (
            <>
              <button onClick={openLoginModal} className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors text-xs tracking-widest px-3 py-1.5">
                <User className="w-3.5 h-3.5" /> LOGIN
              </button>
              <button onClick={() => navigate('/register')} className="text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5] dark:border-[#818CF8] px-4 py-1.5 rounded hover:bg-[#4F46E5] hover:text-white transition-colors text-xs tracking-widest">
                GET FREE ACCOUNT
              </button>
            </>
          )}
        </div>
        <div className="md:hidden ml-auto" />
      </div>
    </nav>
  );
}
