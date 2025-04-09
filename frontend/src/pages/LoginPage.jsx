import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function LoginPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCheckingInstall, setIsCheckingInstall] = useState(true);

  // Update when theme changes
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  // Listen for theme change events
  useEffect(() => {
    const handleThemeChange = () => {
      setCurrentTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    };
    
    window.addEventListener('themechange', handleThemeChange);
    return () => {
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  // Set document title
  useEffect(() => {
    document.title = "Login - WebSchedulr";
  }, []);

  // Check if WebSchedulr is installed
  useEffect(() => {
    const checkInstallation = async () => {
      try {
        // In a real app, this would be an API call to check if WebSchedulr is installed
        // For now, we'll use localStorage
        const installed = localStorage.getItem('webschedulr_installed') === 'true';
        
        if (!installed) {
          // If not installed, redirect to install page
          navigate('/install');
        }
      } catch (err) {
        console.error('Error checking installation:', err);
      } finally {
        setIsCheckingInstall(false);
      }
    };
    
    checkInstallation();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Get stored admin username (in a real app, this would be an API call)
      const storedUsername = localStorage.getItem('webschedulr_admin_username');
      
      // Simple validation (just for demo, real auth would be handled by backend)
      if (username === storedUsername && password.length > 0) {
        // Successful login
        console.log('Login successful', { username, rememberMe });
        // In a real app, you would set authentication state here
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If checking installation, show loading spinner
  if (isCheckingInstall) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors
        ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
      >
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Checking installation status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors
      ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      
      <div className={`w-full max-w-md p-8 space-y-8 rounded-lg shadow-md transition-all
        ${currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      >
        <div className="text-center">
          <svg className={`h-12 w-12 mx-auto ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className={`mt-6 text-3xl font-extrabold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Sign in to WebSchedulr
          </h2>
          <p className={`mt-2 text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter your credentials to access your account
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border
                  rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                  ${currentTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border
                  rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                  ${currentTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={`h-4 w-4 rounded focus:ring-blue-500
                  ${currentTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-blue-500'
                    : 'bg-white border-gray-300 text-blue-600'}`}
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className={`font-medium hover:underline ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'} 
                ${currentTheme === 'dark' ? 'focus:ring-offset-gray-800' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <Link 
            to="/"
            className={`text-sm hover:underline ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
          >
            Back to Welcome Page
          </Link>
        </div>
      </div>
    </div>
  );
}