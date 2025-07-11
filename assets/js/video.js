
document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('myVideo');
    const unmuteButton = document.getElementById('unmute-button');

    unmuteButton.addEventListener('click', () => {
        if (video.muted) {
            video.muted = false;
            unmuteButton.textContent = 'Mute';
        } else {
            video.muted = true;
            unmuteButton.textContent = 'Unmute';
        }
    });
});
