import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Transition, Menu } from '@headlessui/react';
import { Link } from 'react-router-dom';

export default function Navbar({ toggleSidebar }) {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  // This will eventually come from your auth context or state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Update local theme state when context theme changes
  useEffect(() => {
    setCurrentTheme(theme);
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
  
  return (
    <header className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-30 shadow-sm
      ${currentTheme === 'dark' 
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-900'}`}>
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className={`lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
            ${currentTheme === 'dark' 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-600 hover:bg-gray-100'}`}
          aria-label="Open sidebar"
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Logo - Link to home page */}
        <Link to="/" className="flex items-center ml-4 lg:ml-0">
          <svg className={`h-8 w-8 ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.6947 13.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.6947 16.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.9955 13.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.9955 16.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.29431 13.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.29431 16.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={`ml-2 text-lg font-medium ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>WebSchedulr</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-8">
          <ul className="flex space-x-6">
            <li>
              <a 
                href="#" 
                className={`px-1 py-2 text-sm font-medium border-b-2 ${currentTheme === 'dark' ? 'text-blue-400 border-blue-400' : 'text-blue-600 border-blue-600'}`}
              >
                Documentation
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`px-1 py-2 text-sm font-medium border-b-2 border-transparent 
                  ${currentTheme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-900'}`}
              >
                API Reference
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`px-1 py-2 text-sm font-medium border-b-2 border-transparent 
                  ${currentTheme === 'dark' 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-900'}`}
              >
                Support
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* Search button */}
        <button 
          className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
            ${currentTheme === 'dark' 
              ? 'text-gray-400 hover:bg-gray-700' 
              : 'text-gray-500 hover:bg-gray-100'}`}
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8a4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Conditionally render Login button or User menu */}
        {!isAuthenticated ? (
          <Link
            to="/login"
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${currentTheme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Login
          </Link>
        ) : (
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${currentTheme === 'dark' 
                  ? 'bg-blue-800 text-blue-300' 
                  : 'bg-blue-100 text-blue-700'}`}
              >
                <span className="text-sm font-medium">US</span>
              </div>
              <span className={`hidden md:inline text-sm 
                ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                User
              </span>
              <svg className={`w-4 h-4 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Menu.Button>
            
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className={`absolute right-0 mt-2 w-48 origin-top-right shadow-lg rounded-md py-1 border focus:outline-none
                ${currentTheme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'}`}
              >
                <Menu.Item>
                  {({ active }) => (
                    <a 
                      href="#" 
                      className={`block px-4 py-2 text-sm ${
                        currentTheme === 'dark'
                          ? (active ? 'bg-gray-700 text-gray-100' : 'text-gray-300')
                          : (active ? 'bg-gray-100 text-gray-900' : 'text-gray-700')
                      }`}
                    >
                      Your Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a 
                      href="#" 
                      className={`block px-4 py-2 text-sm ${
                        currentTheme === 'dark'
                          ? (active ? 'bg-gray-700 text-gray-100' : 'text-gray-300')
                          : (active ? 'bg-gray-100 text-gray-900' : 'text-gray-700')
                      }`}
                    >
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button 
                      onClick={() => setIsAuthenticated(false)} 
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        currentTheme === 'dark'
                          ? (active ? 'bg-gray-700 text-gray-100' : 'text-gray-300')
                          : (active ? 'bg-gray-100 text-gray-900' : 'text-gray-700')
                      }`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </header>
  );
}