import { Home, BarChart3, Search, Wrench, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function MobileBottomNav() {
  const navigate = useNavigate();
  const { user, isAuthenticated, openLoginModal } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#374151] border-t border-[#E5E7EB] dark:border-[#4B5563] z-50">
      <div className="flex items-center justify-around px-4 py-3">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-[#6B7280] dark:text-[#9CA3AF] active:text-[#4F46E5]">
          <Home className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wide">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280] dark:text-[#9CA3AF] active:text-[#4F46E5]">
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wide">Screens</span>
        </button>
        <button className="flex items-center justify-center w-14 h-14 -mt-8 bg-[#4F46E5] rounded-full shadow-lg active:bg-[#4338CA]">
          <Search className="w-6 h-6 text-white" />
        </button>
        <button className="flex flex-col items-center gap-1 text-[#6B7280] dark:text-[#9CA3AF] active:text-[#4F46E5]">
          <Wrench className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wide">Tools</span>
        </button>
        <button
          onClick={() => isAuthenticated ? navigate('/') : openLoginModal()}
          className="flex flex-col items-center gap-1 text-[#6B7280] dark:text-[#9CA3AF] active:text-[#4F46E5]"
        >
          {isAuthenticated && user ? (
            <div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-[8px] font-semibold">{user.initials}</div>
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] uppercase tracking-wide">{isAuthenticated ? 'Profile' : 'Login'}</span>
        </button>
      </div>
    </nav>
  );
}
