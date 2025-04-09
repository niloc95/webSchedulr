import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize with a default, but this will be immediately updated in the useEffect
  const [theme, setTheme] = useState(() => {
    // Try to get from localStorage during initialization
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      
      // Fall back to system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Apply theme changes to document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Apply theme class to HTML element
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      htmlElement.style.colorScheme = 'dark';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Debug
    console.log('Theme set to:', theme);
    console.log('Dark class present:', htmlElement.classList.contains('dark'));
    
    // Dispatch custom event to trigger re-renders in components
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }, [theme]);

  // Context value object
  const value = {
    theme,
    setTheme,
    toggleTheme: () => {
      setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    },
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}