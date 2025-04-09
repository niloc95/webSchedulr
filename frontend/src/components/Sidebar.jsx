import { useState, useEffect, memo } from 'react';
import { useTheme } from '../context/ThemeContext';

function Sidebar({ isOpen, setIsOpen }) {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedCategories, setExpandedCategories] = useState({
    overview: true,
    features: true,
    guides: false,
    reference: false
  });

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

  // Force re-render when theme changes
  useEffect(() => {
    console.log("Sidebar theme changed:", theme);
  }, [theme]);

  // Handle responsive behavior
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        // Close sidebar on small screens by default
        setIsOpen(false);
      }
    }
    
    // Initial call to set correct state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);
  
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  return (
    <>
      {/* Backdrop - only visible on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 z-30 w-72 border-r h-[calc(100vh-4rem)] overflow-y-auto transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:h-auto lg:translate-x-0 lg:z-0 lg:w-72 lg:flex-shrink-0
        ${currentTheme === 'dark' 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'}
      `}>
        {/* Mobile close button - only visible on mobile */}
        <div className="lg:hidden p-4 flex justify-end">
          <button 
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
              ${currentTheme === 'dark' 
                ? 'text-gray-400 hover:bg-gray-700' 
                : 'text-gray-500 hover:bg-gray-200'}`}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-3 py-2">
          <div className="mb-2 px-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4-4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="search" 
                placeholder="Search docs..." 
                className={`block w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${currentTheme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>
          </div>
          
          {/* Navigation Sections */}
          <nav className="space-y-1 mt-6">
            {/* Category headings and items */}
            {Object.entries({
              overview: { title: "Getting Started", items: [
                { id: "introduction", label: "Introduction" },
                { id: "quickstart", label: "Quick Start Guide" },
                { id: "architecture", label: "Architecture" }
              ]},
              features: { title: "Core Features", items: [
                { id: "appointments", label: "Appointment System" },
                { id: "calendar", label: "Calendar Implementation" },
                { id: "analytics", label: "Dashboard Analytics" }
              ]},
              reference: { title: "API Reference", items: [
                { id: "endpoints", label: "REST Endpoints" },
                { id: "authentication", label: "Authentication" },
                { id: "models", label: "Data Models" }
              ]},
              guides: { title: "Advanced Guides", items: [
                { id: "customization", label: "Customization" },
                { id: "integration", label: "Third-party Integration" },
                { id: "best-practices", label: "Best Practices" }
              ]}
            }).map(([category, { title, items }]) => (
              <div key={category} className="mb-6">
                <button
                  onClick={() => toggleCategory(category)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md
                    ${currentTheme === 'dark' 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-900 hover:bg-gray-100'}`}
                >
                  <span className="font-semibold">{title}</span>
                  <svg 
                    className={`w-5 h-5 transform transition-transform ${expandedCategories[category] ? 'rotate-0' : '-rotate-90'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {expandedCategories[category] && (
                  <div className="mt-1 pl-4">
                    {items.map(item => (
                      <a 
                        key={item.id}
                        href="#" 
                        className={`block px-3 py-2 text-sm rounded-md
                          ${activeSection === item.id 
                            ? (currentTheme === 'dark' 
                              ? 'bg-blue-900/30 text-blue-400' 
                              : 'bg-blue-50 text-blue-600') 
                            : (currentTheme === 'dark' 
                              ? 'text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-600 hover:bg-gray-100')}`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* Version info */}
          <div className={`mt-6 pt-6 px-3 border-t
            ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className={`flex items-center text-sm 
              ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Version: 1.2.3</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default memo(Sidebar);