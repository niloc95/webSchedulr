import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import { useTheme } from '../context/ThemeContext'

// Move icons outside of the component to prevent recreation on each render
const ICONS = {
  calendar: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
  ),
  appointment: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 002-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
    </svg>
  ),
  chart: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>
  )
};

export default function WelcomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { theme } = useTheme();
  
  // Replace your debug effect with a conditional check
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("WelcomePage - Current theme:", theme);
      console.log("Dark class present:", document.documentElement.classList.contains('dark'));
    }
  }, [theme]);

  // Set document title
  useEffect(() => {
    document.title = "WebSchedulr Documentation";
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log(`Signing up ${email}`);
    setEmail('');
  };

  // Use the constant icons
  const icons = ICONS;
  
  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Skip to content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-blue-600 focus:text-white focus:z-50"
      >
        Skip to content
      </a>

      {/* Fixed header */}
      <Navbar toggleSidebar={toggleSidebar} />
      
      {/* Main content area with sidebar */}
      <div className="pt-16 flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main content wrapper - make sure it takes full width when sidebar is hidden */}
        <div id="main-content" className="flex-1 min-w-0 w-full flex flex-col overflow-x-hidden">
          {/* Hero Section */}
          <section className={`w-full px-4 py-12 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                WebSchedulr Documentation
              </h1>
              <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                A comprehensive guide to WebSchedulr's features, capabilities, and implementation details.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {/* Installation Button - Primary CTA */}
                <Link 
                  to="/install"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-lg font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Let's Install WebSchedulr
                </Link>
                
                <a 
                  href="#features" 
                  className={`border px-6 py-3 rounded-md transition-colors text-lg font-medium
                  ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  View Features
                </a>
              </div>
            </div>
          </section>
          
          {/* Feature Cards Section */}
          <section id="features" className={`w-full py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto">
              <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Key Features Documentation
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature cards go here */}
                <FeatureCard 
                  icon={icons.appointment} 
                  title="Appointment System" 
                  theme={theme}
                  description="Appointments are the core entity of WebSchedulr and include essential information."
                  items={[
                    'Client information',
                    'Service type',
                    'Date and time',
                    'Duration',
                    'Status (pending, confirmed, completed, cancelled)',
                    'Staff assignment',
                    'Notes and additional information'
                  ]}
                />
                
                <FeatureCard 
                  icon={icons.calendar} 
                  title="Calendar Implementation"
                  theme={theme}
                  description="The calendar system provides three main views for effective scheduling management."
                  items={[
                    <span key="day"><span className="font-medium">Day View:</span> Detailed view of a single day's appointments</span>,
                    <span key="week"><span className="font-medium">Week View:</span> Overview of appointments across a week</span>,
                    <span key="month"><span className="font-medium">Month View:</span> Monthly planning view with appointment indicators</span>
                  ]}
                />
                
                <FeatureCard 
                  icon={icons.chart} 
                  title="Dashboard Analytics" 
                  theme={theme}
                  description="The dashboard uses Chart.js to visualize key business metrics and trends."
                  items={[
                    'Appointments by status',
                    'Revenue trends',
                    'Service popularity',
                    'Client retention'
                  ]}
                />
              </div>
            </div>
          </section>
          
          {/* Newsletter Form */}
          <section className={`w-full px-4 py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Stay Updated</h2>
              <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Subscribe to receive updates about new features, documentation changes, and release notes.</p>
              <form className="flex flex-col sm:flex-row gap-2 justify-center" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className={`px-4 py-3 rounded-lg w-full sm:w-80 focus:outline-none focus:ring focus:ring-blue-500 border
                    ${theme === 'dark' 
                      ? 'bg-gray-800 text-gray-200 border-gray-700' 
                      : 'bg-white text-gray-800 border-gray-300'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

// Helper component for feature cards
function FeatureCard({ icon, title, description, items, theme }) {
  // Add state to sync with theme changes
  const [currentTheme, setCurrentTheme] = useState(theme);
  
  // Update when theme prop changes
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
  
  return (
    <div className={`p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow
      ${currentTheme === 'dark' 
        ? 'bg-gray-800 border-gray-700 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-600'}`}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-4
        ${currentTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}
      >
        <span className={currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'}>{icon}</span>
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className="mb-4">
        {description}
      </p>
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}