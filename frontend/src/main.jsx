import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Initialize theme before rendering
function initializeTheme() {
  // Get theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  
  // Check for system preference if no saved preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply theme class
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
  
  console.log('Initial theme:', savedTheme || (prefersDark ? 'dark (system)' : 'light (system)'));
  console.log('Dark mode class present:', document.documentElement.classList.contains('dark'));
}

// Call the initialization function before rendering
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
