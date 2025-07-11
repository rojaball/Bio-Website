
document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('myVideo');
    const muteButton = document.getElementById('mute-button');
    const soundIcon = muteButton.querySelector('.sound-icon');
    const soundOverlay = document.getElementById('sound-overlay');
    
    let soundEnabled = false;

    console.log('Video element found:', video);
    console.log('Mute button found:', muteButton);
    console.log('Sound icon found:', soundIcon);
    console.log('Sound overlay found:', soundOverlay);

    // Set volume to reasonable level
    video.volume = 0.5;
    
    // Function to update the button appearance
    function updateButtonAppearance() {
        console.log('Updating button appearance, muted:', video.muted);
        if (video.muted) {
            soundIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>';
            muteButton.classList.add('muted');
        } else {
            soundIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>';
            muteButton.classList.remove('muted');
        }
    }

    // Function to enable sound with user interaction
    function enableSound() {
        console.log('Enabling sound with user interaction');
        video.muted = false;
        soundEnabled = true;
        updateButtonAppearance();
        
        // Hide the overlay
        soundOverlay.style.display = 'none';
        
        // Ensure video is playing
        if (video.paused) {
            video.play().catch(e => console.log('Play failed:', e));
        }
        
        console.log('Sound enabled! Video muted:', video.muted);
    }

    // Function to handle mute button clicks
    function handleMuteClick(event) {
        event.stopPropagation();
        console.log('Mute button clicked! Current muted state:', video.muted);
        
        if (!soundEnabled) {
            // First click enables sound
            enableSound();
        } else {
            // Subsequent clicks toggle mute
            video.muted = !video.muted;
            console.log('New muted state:', video.muted);
            updateButtonAppearance();
        }
        
        // Try to play if video is paused
        if (video.paused) {
            video.play().catch(e => console.log('Manual play failed:', e));
        }
    }

    // Add click event for sound overlay
    soundOverlay.addEventListener('click', enableSound);
    
    // Add click event for mute button
    muteButton.addEventListener('click', handleMuteClick);
    
    // Initial setup
    updateButtonAppearance();
    
    // Video should already be autoplaying muted due to HTML attributes
    console.log('Video setup complete. Click overlay or mute button to enable sound.');

    // Auto-scroll to bio after 60 seconds
    setTimeout(() => {
        const bioContainer = document.getElementById('bio-container');
        if (bioContainer) {
            bioContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }, 60000);
});
