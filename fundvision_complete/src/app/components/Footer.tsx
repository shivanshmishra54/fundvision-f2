import { Sun, Moon, Monitor, Download, Link as LinkIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="bg-[#F9FAFB] dark:bg-[#374151] border-t border-[#E5E7EB] dark:border-[#4B5563] py-12 md:py-16 pb-20 md:pb-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Brand */}
          <div>
            <h3 className="flex items-center gap-1.5 font-bold text-[#111827] dark:text-white text-base md:text-lg mb-3 md:mb-4">
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0"  y="10" width="5" height="10" rx="1" fill="#16A34A" />
                <rect x="6"  y="5"  width="5" height="15" rx="1" fill="#16A34A" />
                <rect x="12" y="0"  width="5" height="20" rx="1" fill="#4ADE80" />
                <rect x="17" y="7"  width="5" height="13" rx="1" fill="#16A34A" opacity="0.7" />
              </svg>
              FundVision
            </h3>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm mb-4 md:mb-6">
              Stock analysis and screening tool
            </p>
            <p className="text-[#9CA3AF] dark:text-[#6B7280] text-xs mb-1 md:mb-2">
              © 2026 FundVision
            </p>
            <p className="text-[#9CA3AF] dark:text-[#6B7280] text-xs mb-3 md:mb-4">
              Made with ❤️ in India
            </p>
            <a href="#" className="text-[#6B7280] dark:text-[#9CA3AF] text-xs hover:text-[#4F46E5] transition-colors">
              Terms & Privacy
            </a>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-[#111827] dark:text-white mb-3 md:mb-4 font-medium text-sm md:text-base">
              Product
            </h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="#" className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm hover:text-[#4F46E5] transition-colors flex items-center gap-2">
                  <LinkIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  Premium
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm hover:text-[#4F46E5] transition-colors flex items-center gap-2">
                  <LinkIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  What's new?
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm hover:text-[#4F46E5] transition-colors flex items-center gap-2">
                  <LinkIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  Learn
                </a>
              </li>
              <li className="pt-2">
                <button className="text-[#4F46E5] text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 border border-[#4F46E5] rounded-lg hover:bg-[#4F46E5] hover:text-white transition-colors flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Install App
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Team */}
          <div>
            <h4 className="text-[#111827] dark:text-white mb-3 md:mb-4 font-medium text-sm md:text-base">
              Team
            </h4>
            <div className="mb-4 md:mb-6">
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm mb-2 md:mb-3 font-medium">
                Developed by
              </p>
              <ul className="space-y-1.5 md:space-y-2">
                <li className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm">Shivansh Mishra</li>
                <li className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm">Vedant Mandhare</li>
                <li className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm">Krunal Modak</li>
              </ul>
            </div>
            <div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm mb-2 md:mb-3 font-medium">
                Guided by
              </p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs md:text-sm">Nasim Shah</p>
            </div>
          </div>

          {/* Column 4: Theme */}
          <div>
            <h4 className="text-[#111827] dark:text-white mb-3 md:mb-4 font-medium text-sm md:text-base">
              Theme
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 md:gap-3 text-xs md:text-sm w-full text-left px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all ${
                  theme === 'light'
                    ? 'text-[#4F46E5] bg-white dark:bg-[#1F2937] border border-[#4F46E5]'
                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:bg-white dark:hover:bg-[#1F2937] border border-transparent'
                }`}
              >
                <Sun className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 md:gap-3 text-xs md:text-sm w-full text-left px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'text-[#4F46E5] bg-white dark:bg-[#1F2937] border border-[#4F46E5]'
                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:bg-white dark:hover:bg-[#1F2937] border border-transparent'
                }`}
              >
                <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Dark
              </button>
              <button
                onClick={() => setTheme('auto')}
                className={`flex items-center gap-2 md:gap-3 text-xs md:text-sm w-full text-left px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all ${
                  theme === 'auto'
                    ? 'text-[#4F46E5] bg-white dark:bg-[#1F2937] border border-[#4F46E5]'
                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:bg-white dark:hover:bg-[#1F2937] border border-transparent'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Auto
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}