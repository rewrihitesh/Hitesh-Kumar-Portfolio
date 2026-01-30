
// Wrapper script to initialize the CSS Houdini PaintWorklet for Ring Particles

if ('paintWorklet' in CSS) {
    console.log('Registering Houdini PaintWorklet...');

    // Register the PaintWorklet
    // Using local file to avoid CORS/Network issues and implement custom color logic
    CSS.paintWorklet.addModule('custom-ring-particles.js')
        .then(() => {
            console.log('PaintWorklet registered successfully.');
        }).catch(err => {
            console.error('Failed to register PaintWorklet:', err);
        });

    // The ring should follow the mouse on hover
    let isInteractive = false;
    const $container = document.querySelector('#particle-container');

    if ($container) {
        // Listen on window because particle container allows clicks to pass through (pointer-events: none)
        window.addEventListener('pointermove', (e) => {
            if (!isInteractive) {
                $container.style.setProperty('--ring-interactive', 1);
                isInteractive = true;
            }

            // Calculate percentage position relative to viewport (since container is fixed full screen)
            const x = Math.max(0, Math.min(100, (e.clientX / window.innerWidth) * 100));
            const y = Math.max(0, Math.min(100, (e.clientY / window.innerHeight) * 100));

            $container.style.setProperty('--ring-x', x);
            $container.style.setProperty('--ring-y', y);
        });

        window.addEventListener('pointerleave', (e) => {
            isInteractive = false;
            // Center ring on exit
            $container.style.setProperty('--ring-x', 50);
            $container.style.setProperty('--ring-y', 50);
            $container.style.setProperty('--ring-interactive', 0);
        });
    } else {
        console.warn('Element #particle-container not found for Houdini particles interaction.');
    }
} else {
    console.warn('CSS.paintWorklet is not supported in this browser. Please use Chrome, Edge, or Opera.');
    // Optional: Add a fallback class to #welcome if needed
}
