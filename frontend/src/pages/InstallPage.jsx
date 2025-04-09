import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function InstallPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isInstalled, setIsInstalled] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Installation progress state
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatus, setStepStatus] = useState({
    connection: 'pending',
    database: 'pending',
    tables: 'pending',
    admin: 'pending',
    env: 'pending'
  });
  const [showProgress, setShowProgress] = useState(false);
  
  // Database configuration state
  const [dbType, setDbType] = useState('mysql'); // Default to MySQL for testing
  const [dbHost, setDbHost] = useState('localhost');
  const [dbPort, setDbPort] = useState('3306');  // Default MySQL port
  const [dbName, setDbName] = useState('webschedulr');
  const [dbUser, setDbUser] = useState('root');
  const [dbPassword, setDbPassword] = useState('');
  const [appEnv, setAppEnv] = useState('production');
  const [showDbConfig, setShowDbConfig] = useState(true); // Show DB config by default

  // Set default ports based on database type
  useEffect(() => {
    if (dbType === 'mysql') {
      setDbPort('3306');
    } else if (dbType === 'postgresql') {
      setDbPort('5432');
    }
    
    // Toggle showing database config fields
    setShowDbConfig(dbType !== 'sqlite');
  }, [dbType]);

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
    document.title = "Install WebSchedulr";
  }, []);

  // Check if WebSchedulr is already installed
  useEffect(() => {
    const checkInstallStatus = async () => {
      setIsChecking(true);
      try {
        // In a real application, this would be an API call to check installation status
        // For now, we'll just simulate the check with localStorage
        const installed = localStorage.getItem('webschedulr_installed') === 'true';
        setIsInstalled(installed);
        
        if (installed) {
          // If already installed, redirect to login after a brief delay
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('Error checking install status:', err);
        setError('Failed to check installation status. Please try again.');
      } finally {
        setIsChecking(false);
      }
    };

    checkInstallStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Database validation
    if (dbType !== 'sqlite') {
      if (!dbHost || !dbPort || !dbName || !dbUser) {
        setError('All database connection fields are required');
        return;
      }
    }
    
    // Start installation
    setIsLoading(true);
    setShowProgress(true);
    
    try {
      // Simulate the installation process with steps
      await simulateInstallation();
      
      // Generate env configuration
      const envConfig = generateEnvConfig();
      
      // Save installation status to localStorage
      localStorage.setItem('webschedulr_installed', 'true');
      localStorage.setItem('webschedulr_admin_username', username);
      localStorage.setItem('webschedulr_db_config', JSON.stringify(envConfig));
      
      // Debug - display the generated env config in console
      console.log("Generated environment configuration:", envConfig);
      
      // Show success message and redirect to login
      setIsInstalled(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Installation error:', err);
      setError(`Installation failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate the installation process with realistic steps
  const simulateInstallation = async () => {
    // Step 1: Test database connection
    setCurrentStep(1);
    setStepStatus(prev => ({ ...prev, connection: 'processing' }));
    try {
      await simulateDatabaseConnection();
      setStepStatus(prev => ({ ...prev, connection: 'completed' }));
    } catch (error) {
      setStepStatus(prev => ({ ...prev, connection: 'failed' }));
      throw new Error(`Could not connect to database: ${error.message}`);
    }
    
    // Step 2: Create database if it doesn't exist
    setCurrentStep(2);
    setStepStatus(prev => ({ ...prev, database: 'processing' }));
    try {
      await simulateCreateDatabase();
      setStepStatus(prev => ({ ...prev, database: 'completed' }));
    } catch (error) {
      setStepStatus(prev => ({ ...prev, database: 'failed' }));
      throw new Error(`Could not create database: ${error.message}`);
    }
    
    // Step 3: Create tables
    setCurrentStep(3);
    setStepStatus(prev => ({ ...prev, tables: 'processing' }));
    try {
      await simulateCreateTables();
      setStepStatus(prev => ({ ...prev, tables: 'completed' }));
    } catch (error) {
      setStepStatus(prev => ({ ...prev, tables: 'failed' }));
      throw new Error(`Could not create tables: ${error.message}`);
    }
    
    // Step 4: Create admin user
    setCurrentStep(4);
    setStepStatus(prev => ({ ...prev, admin: 'processing' }));
    try {
      await simulateCreateAdmin();
      setStepStatus(prev => ({ ...prev, admin: 'completed' }));
    } catch (error) {
      setStepStatus(prev => ({ ...prev, admin: 'failed' }));
      throw new Error(`Could not create admin user: ${error.message}`);
    }
    
    // Step 5: Generate .env file
    setCurrentStep(5);
    setStepStatus(prev => ({ ...prev, env: 'processing' }));
    try {
      await simulateGenerateEnvFile();
      setStepStatus(prev => ({ ...prev, env: 'completed' }));
    } catch (error) {
      setStepStatus(prev => ({ ...prev, env: 'failed' }));
      throw new Error(`Could not generate environment file: ${error.message}`);
    }
  };
  
  // Simulate testing database connection
  const simulateDatabaseConnection = async () => {
    // In a real app, we would make an API call to test the connection
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate connection errors for empty password on non-localhost
        if (dbType === 'mysql' && !dbPassword && dbHost !== 'localhost') {
          reject(new Error('Access denied for user'));
        } else {
          resolve();
        }
      }, 1000);
    });
    // Log the successful connection
    console.log(`Connected to ${dbType} server at ${dbHost}:${dbPort}`);
  };
  
  // Simulate creating the database
  const simulateCreateDatabase = async () => {
    // In a real app, we would make an API call to create the database
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Created database: ${dbName}`);
  };
  
  // Simulate creating tables
  const simulateCreateTables = async () => {
    // In a real app, we would make an API call to run migrations
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Created database tables');
  };
  
  // Simulate creating admin user
  const simulateCreateAdmin = async () => {
    // In a real app, we would make an API call to seed the admin user
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Created admin user: ${username}`);
  };
  
  // Simulate generating .env file
  const simulateGenerateEnvFile = async () => {
    // In a real app, we would make an API call to write the .env file
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log('Generated .env file');
  };
  
  // Generate the environment configuration
  const generateEnvConfig = () => {
    const config = {
      APP_NAME: 'WebSchedulr',
      APP_ENV: appEnv,
      APP_DEBUG: appEnv === 'development' ? 'true' : 'false',
      APP_URL: window.location.origin,
      
      DB_CONNECTION: dbType,
      ADMIN_USERNAME: username,
    };
    
    // Add database-specific configuration
    if (dbType === 'sqlite') {
      config.DB_DATABASE = 'database/webschedulr.sqlite';
    } else {
      config.DB_HOST = dbHost;
      config.DB_PORT = dbPort;
      config.DB_DATABASE = dbName;
      config.DB_USERNAME = dbUser;
      config.DB_PASSWORD = dbPassword;
    }
    
    return config;
  };

  // If we're checking installation status, show a loading screen
  if (isChecking) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors
        ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
      >
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-2xl font-semibold mb-2">Checking Installation Status</h2>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we check if WebSchedulr is already installed...</p>
        </div>
      </div>
    );
  }

  // If already installed, show info screen and redirect to login
  if (isInstalled) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-4 transition-colors
        ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
      >
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>
        <div className="text-center">
          <div className="bg-green-100 dark:bg-green-900 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">WebSchedulr is Installed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Redirecting to login page...</p>
          <Link 
            to="/login"
            className="text-blue-500 hover:underline"
          >
            Click here if you're not redirected automatically
          </Link>
        </div>
      </div>
    );
  }

  // Otherwise show the installation form
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 transition-colors
      ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      
      {/* Installation progress overlay - shown during installation */}
      {showProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full p-6 rounded-lg shadow-lg ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Installing WebSchedulr</h2>
            
            <div className="space-y-4">
              <InstallationStep 
                step={1} 
                currentStep={currentStep}
                title="Testing Database Connection" 
                status={stepStatus.connection} 
                theme={currentTheme}
              />
              
              <InstallationStep 
                step={2} 
                currentStep={currentStep}
                title="Creating Database" 
                status={stepStatus.database} 
                theme={currentTheme}
              />
              
              <InstallationStep 
                step={3} 
                currentStep={currentStep}
                title="Creating Tables" 
                status={stepStatus.tables} 
                theme={currentTheme}
              />
              
              <InstallationStep 
                step={4} 
                currentStep={currentStep}
                title="Creating Admin User" 
                status={stepStatus.admin} 
                theme={currentTheme}
              />
              
              <InstallationStep 
                step={5} 
                currentStep={currentStep}
                title="Generating Environment File" 
                status={stepStatus.env} 
                theme={currentTheme}
              />
            </div>
            
            {error && (
              <div className="mt-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={`w-full max-w-xl p-8 space-y-8 rounded-lg shadow-md transition-all mb-8
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
            Install WebSchedulr
          </h2>
          <p className={`mt-2 text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Configure your database and create an admin account
          </p>
        </div>
        
        {error && !showProgress && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Admin section */}
          <div>
            <h3 className={`text-lg font-medium mb-4 pb-2 border-b ${currentTheme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
              Admin Account
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${currentTheme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Admin username"
                />
              </div>
              
              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${currentTheme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Create a secure password"
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${currentTheme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>
          
          {/* Database section */}
          <div>
            <h3 className={`text-lg font-medium mb-4 pb-2 border-b ${currentTheme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
              Database Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Database Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`cursor-pointer border rounded-md p-4 flex flex-col items-center transition
                      ${dbType === 'sqlite' 
                        ? (currentTheme === 'dark' 
                          ? 'border-blue-500 bg-blue-900/30' 
                          : 'border-blue-500 bg-blue-50') 
                        : (currentTheme === 'dark' 
                          ? 'border-gray-600 hover:border-gray-500' 
                          : 'border-gray-300 hover:border-gray-400')}
                    `}
                    onClick={() => setDbType('sqlite')}
                  >
                    <svg className={`h-8 w-8 mb-2 ${dbType === 'sqlite' ? 'text-blue-500' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V2L8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 12H2L5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 12H22L19 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 12C7.58172 12 4 9.31371 4 6V18C4 20.7614 7.58172 23 12 23C16.4183 23 20 20.7614 20 18V6C20 9.31371 16.4183 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={`font-medium ${dbType === 'sqlite' ? 'text-blue-500' : ''}`}>SQLite</span>
                    <span className="text-xs mt-1 text-center">Zero configuration</span>
                  </div>
                  
                  <div 
                    className={`cursor-pointer border rounded-md p-4 flex flex-col items-center transition
                      ${dbType === 'mysql' 
                        ? (currentTheme === 'dark' 
                          ? 'border-blue-500 bg-blue-900/30' 
                          : 'border-blue-500 bg-blue-50') 
                        : (currentTheme === 'dark' 
                          ? 'border-gray-600 hover:border-gray-500' 
                          : 'border-gray-300 hover:border-gray-400')}
                    `}
                    onClick={() => setDbType('mysql')}
                  >
                    <svg className={`h-8 w-8 mb-2 ${dbType === 'mysql' ? 'text-blue-500' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15C21 16.8565 19.7447 18.637 17.5 19.8566C15.2553 21.0762 12.1837 21.7143 9 21.7143C5.81633 21.7143 2.74469 21.0762 0.5 19.8566" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 4.92857V21.7143" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 2V18.7857" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={`font-medium ${dbType === 'mysql' ? 'text-blue-500' : ''}`}>MySQL</span>
                    <span className="text-xs mt-1 text-center">Connection required</span>
                  </div>
                  
                  <div 
                    className={`cursor-pointer border rounded-md p-4 flex flex-col items-center transition
                      ${dbType === 'postgresql' 
                        ? (currentTheme === 'dark' 
                          ? 'border-blue-500 bg-blue-900/30' 
                          : 'border-blue-500 bg-blue-50') 
                        : (currentTheme === 'dark' 
                          ? 'border-gray-600 hover:border-gray-500' 
                          : 'border-gray-300 hover:border-gray-400')}
                    `}
                    onClick={() => setDbType('postgresql')}
                  >
                    <svg className={`h-8 w-8 mb-2 ${dbType === 'postgresql' ? 'text-blue-500' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M12 3V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className={`font-medium ${dbType === 'postgresql' ? 'text-blue-500' : ''}`}>PostgreSQL</span>
                    <span className="text-xs mt-1 text-center">Connection required</span>
                  </div>
                </div>
              </div>
              
              {/* Database connection fields - only show if not SQLite */}
              {showDbConfig && (
                <div className="space-y-4 mt-4 p-4 rounded-md bg-gray-50 dark:bg-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dbHost" className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Database Host
                      </label>
                      <input
                        id="dbHost"
                        type="text"
                        value={dbHost}
                        onChange={(e) => setDbHost(e.target.value)}
                        className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          ${currentTheme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        placeholder="localhost"
                        required={showDbConfig}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dbPort" className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Port
                      </label>
                      <input
                        id="dbPort"
                        type="text"
                        value={dbPort}
                        onChange={(e) => setDbPort(e.target.value)}
                        className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          ${currentTheme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        placeholder={dbType === 'mysql' ? '3306' : '5432'}
                        required={showDbConfig}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="dbName" className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Database Name
                    </label>
                    <input
                      id="dbName"
                      type="text"
                      value={dbName}
                      onChange={(e) => setDbName(e.target.value)}
                      className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                        ${currentTheme === 'dark'
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                      placeholder="webschedulr"
                      required={showDbConfig}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dbUser" className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Database User
                      </label>
                      <input
                        id="dbUser"
                        type="text"
                        value={dbUser}
                        onChange={(e) => setDbUser(e.target.value)}
                        className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          ${currentTheme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        placeholder="root"
                        required={showDbConfig}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dbPassword" className={`block text-sm font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Database Password
                      </label>
                      <input
                        id="dbPassword"
                        type="password"
                        value={dbPassword}
                        onChange={(e) => setDbPassword(e.target.value)}
                        className={`appearance-none relative block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                          ${currentTheme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Environment section */}
          <div>
            <h3 className={`text-lg font-medium mb-4 pb-2 border-b ${currentTheme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
              Application Environment
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Environment Mode
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="production"
                      type="radio"
                      name="appEnv"
                      value="production"
                      checked={appEnv === 'production'}
                      onChange={() => setAppEnv('production')}
                      className={`h-4 w-4 ${currentTheme === 'dark' ? 'text-blue-500 focus:ring-blue-600 bg-gray-700 border-gray-600' : 'text-blue-600 focus:ring-blue-500 border-gray-300'}`}
                    />
                    <label htmlFor="production" className="ml-2 text-sm">
                      Production
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="development"
                      type="radio"
                      name="appEnv"
                      value="development"
                      checked={appEnv === 'development'}
                      onChange={() => setAppEnv('development')}
                      className={`h-4 w-4 ${currentTheme === 'dark' ? 'text-blue-500 focus:ring-blue-600 bg-gray-700 border-gray-600' : 'text-blue-600 focus:ring-blue-500 border-gray-300'}`}
                    />
                    <label htmlFor="development" className="ml-2 text-sm">
                      Development
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'} 
                ${currentTheme === 'dark' ? 'focus:ring-offset-gray-800' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Installing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                  </svg>
                  Install WebSchedulr
                </>
              )}
            </button>
          </div>

          {/* Test connection button */}
          {dbType !== 'sqlite' && (
            <div>
              <button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  try {
                    setError(null);
                    await simulateDatabaseConnection();
                    alert('Database connection successful!');
                  } catch (err) {
                    setError(`Connection failed: ${err.message}`);
                  }
                }}
                className={`group relative w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${isLoading 
                    ? 'cursor-not-allowed opacity-50' 
                    : ''} 
                  ${currentTheme === 'dark' 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-offset-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                Test Database Connection
              </button>
            </div>
          )}
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

// Helper component for installation step display
function InstallationStep({ step, currentStep, title, status, theme }) {
  let statusIcon;
  let statusClass;
  
  switch(status) {
    case 'completed':
      statusIcon = (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      );
      statusClass = "text-green-500";
      break;
    case 'processing':
      statusIcon = (
        <svg className="animate-spin w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
      statusClass = "text-blue-500";
      break;
    case 'failed':
      statusIcon = (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      );
      statusClass = "text-red-500";
      break;
    default:
      statusIcon = (
        <div className={`w-5 h-5 rounded-full 
          ${theme === 'dark' 
            ? (step <= currentStep ? 'bg-gray-400' : 'bg-gray-600') 
            : (step <= currentStep ? 'bg-gray-400' : 'bg-gray-300')}`}
        />
      );
      statusClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  }
  
  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        {statusIcon}
      </div>
      <div className="ml-3 w-full">
        <div className="flex justify-between items-center">
          <p className={`text-sm font-medium ${statusClass}`}>{title}</p>
          
          {status === 'completed' && (
            <span className={`text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              Complete
            </span>
          )}
          
          {status === 'processing' && (
            <span className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              In progress...
            </span>
          )}
          
          {status === 'failed' && (
            <span className={`text-xs ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
              Failed
            </span>
          )}
        </div>
        
        {status === 'processing' && (
          <div className={`w-full h-1 mt-2 rounded-full overflow-hidden bg-gray-200 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className="h-full bg-blue-500 animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
}