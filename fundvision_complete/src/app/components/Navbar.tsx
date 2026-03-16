/**
 * components/Navbar.tsx  (UPDATED — connected to real backend auth)
 */

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, BookMarked, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ToolsDropdown } from './ToolsDropdown';
import { SearchBar } from './SearchBar';

export function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-[#F9FAFB] dark:bg-[#374151] border-b border-[#E5E7EB] dark:border-[#4B5563]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 font-bold text-[#111827] dark:text-white text-base md:text-lg whitespace-nowrap">
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
            <rect x="0"  y="10" width="5" height="10" rx="1" fill="#16A34A" />
            <rect x="6"  y="5"  width="5" height="15" rx="1" fill="#16A34A" />
            <rect x="12" y="0"  width="5" height="20" rx="1" fill="#4ADE80" />
            <rect x="17" y="7"  width="5" height="13" rx="1" fill="#16A34A" opacity="0.7" />
          </svg>
          FundVision
        </button>

        <div className="hidden md:flex items-center gap-10">
          <button onClick={() => navigate('/')} className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors text-sm">HOME</button>
          <button className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors text-sm">VISION</button>
          <ToolsDropdown />
        </div>

        <div className="hidden md:block flex-1 max-w-sm">
          <SearchBar />
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(o => !o)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#4B5563] transition-colors">
                {user.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt={user.full_name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-xs font-semibold">{user.initials}</div>
                )}
                <span className="text-sm text-[#111827] dark:text-white font-medium">{user.first_name}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-xl shadow-lg z-50 py-1">
                  <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#374151]">
                    <p className="text-sm font-medium text-[#111827] dark:text-white">{user.full_name}</p>
                    <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
                  </div>
                  <button onClick={() => { setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] dark:text-[#D1D5DB] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] transition-colors">
                    <BookMarked className="w-4 h-4" /> My Watchlist
                  </button>
                  <button onClick={() => { setDropdownOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] dark:text-[#D1D5DB] hover:bg-[#F9FAFB] dark:hover:bg-[#374151] transition-colors">
                    <Clock className="w-4 h-4" /> History
                  </button>
                  <div className="border-t border-[#E5E7EB] dark:border-[#374151] mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={openLoginModal} className="text-[#6B7280] dark:text-[#9CA3AF] px-4 py-2 hover:text-[#111827] dark:hover:text-white transition-colors flex items-center gap-2 text-sm">
                <User className="w-4 h-4" /> LOGIN
              </button>
              <button onClick={() => navigate('/register')} className="text-white bg-[#4F46E5] px-5 py-2 rounded-lg hover:bg-[#4338CA] transition-colors text-sm">
                GET FREE ACCOUNT
              </button>
            </>
          )}
        </div>
        <div className="md:hidden" />
      </div>
    </nav>
  );
}
