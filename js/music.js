export function audioPlayer() {
    const musicButton = document.getElementById('alternar-musica');
    const backgroundMusic = new Audio('/sons/luna-rise-part-one.mp3');
    backgroundMusic.loop = true;

    musicButton.addEventListener('change', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
        }
    })
}