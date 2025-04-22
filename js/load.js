export function initLoad() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingVideo = document.getElementById('loading-video');
    const body = document.body;

    if (!localStorage.getItem('visited')) {
        localStorage.setItem('visited', 'true');
        
        // Show the loading screen and hide the content initially
        loadingScreen.style.display = 'block';

        loadingVideo.addEventListener('ended', function() {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                body.classList.remove('hidden-content');
                body.classList.add('show-content');
            }, 800); // Match this duration with the transition
        });
    } else {
        // Skip the loading screen if visited before
        loadingScreen.style.display = 'none';
        body.classList.remove('hidden-content');
    }
}
