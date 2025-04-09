<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>WebSchedulr</title>
        
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        
        <!-- Theme Script -->
        <script>
            // Check for saved theme preference or respect OS setting
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        </script>
    </head>
    <body class="font-sans antialiased">
        <div id="root"></div>
        
        @if (file_exists(public_path('build/assets')))
            @php
                $jsFiles = glob(public_path('build/assets/*.js'));
                $cssFiles = glob(public_path('build/assets/*.css'));
            @endphp
            
            @foreach($cssFiles as $cssFile)
                <link rel="stylesheet" href="{{ asset('build/assets/' . basename($cssFile)) }}">
            @endforeach
            
            @foreach($jsFiles as $jsFile)
                <script type="module" src="{{ asset('build/assets/' . basename($jsFile)) }}"></script>
            @endforeach
        @else
            <div class="flex items-center justify-center h-screen">
                <div class="p-4 text-center">
                    <h1 class="text-xl font-bold mb-2">Frontend not built</h1>
                    <p>Run <code>npm run build</code> in the frontend directory to build the frontend assets.</p>
                </div>
            </div>
        @endif
    </body>
</html>