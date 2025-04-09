<div class="flex items-center space-x-2">
    <button
        id="light-mode-button"
        class="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center"
        aria-label="Light mode"
    >
        <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
        </svg>
    </button>
    <button
        id="dark-mode-button" 
        class="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center"
        aria-label="Dark mode"
    >
        <svg class="w-4 h-4 text-gray-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
    </button>
</div>

<script>
    // Theme switcher functionality
    document.addEventListener('DOMContentLoaded', function() {
        const lightButton = document.getElementById('light-mode-button');
        const darkButton = document.getElementById('dark-mode-button');
        const html = document.documentElement;
        
        // Get current theme
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Update button states
        if (currentTheme === 'dark') {
            darkButton.classList.add('ring-2', 'ring-blue-500');
            lightButton.classList.remove('ring-2', 'ring-blue-500');
        } else {
            lightButton.classList.add('ring-2', 'ring-blue-500');
            darkButton.classList.remove('ring-2', 'ring-blue-500');
        }
        
        // Light mode button click handler
        lightButton.addEventListener('click', function() {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            
            // Update button states
            lightButton.classList.add('ring-2', 'ring-blue-500');
            darkButton.classList.remove('ring-2', 'ring-blue-500');
        });
        
        // Dark mode button click handler
        darkButton.addEventListener('click', function() {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            
            // Update button states
            darkButton.classList.add('ring-2', 'ring-blue-500');
            lightButton.classList.remove('ring-2', 'ring-blue-500');
        });
    });
</script>