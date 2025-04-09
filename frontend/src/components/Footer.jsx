import { useEffect, useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  // Update local theme state when context theme changes
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  // Force re-render when theme changes
  useEffect(() => {
    console.log("Footer theme changed:", theme);
  }, [theme]);

  // Listen for theme change events
  useEffect(() => {
    const handleThemeChange = () => {
      setForceUpdate(prev => !prev);
      setCurrentTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    };
    
    window.addEventListener('themechange', handleThemeChange);
    return () => {
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  // On component mount, show links with animation
  useEffect(() => {
    setShowLinks(true);
  }, []);

  return (
    <footer className={`border-t py-8 px-6 w-full ${currentTheme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <svg className={`w-6 h-6 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={`text-lg font-semibold ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>WebSchedulr</span>
            
            {/* Color Theme Switcher */}
            <div className="flex items-center ml-6">
              <ThemeSwitcher />
            </div>
          </div>
          
          {/* Grid links with manual animation instead of Transition */}
          <div 
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-opacity duration-500 ${showLinks ? 'opacity-100' : 'opacity-0'}`}
          >
            <div>
              <h3 className={`text-sm font-semibold mb-4 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Features</a></li>
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Pricing</a></li>
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>API</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-sm font-semibold mb-4 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>About</a></li>
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Blog</a></li>
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-sm font-semibold mb-4 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Documentation</a></li>
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Guides</a></li>
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-sm font-semibold mb-4 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Privacy</a></li>
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Terms</a></li>
                <li><a href="#" className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}>Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright section with manual animation instead of Transition */}
        <div 
          className={`mt-8 pt-8 border-t text-sm text-center transition-opacity duration-500 delay-300 
            ${currentTheme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}
        >
          &copy; {new Date().getFullYear()} WebSchedulr. All rights reserved.
        </div>
      </div>
    </footer>
  );
}