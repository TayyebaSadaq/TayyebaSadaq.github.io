const player = document.getElementById('player');
const playBtn = document.getElementById('playbtn');
const prevBtn = document.getElementById('prevbtn');
const nextBtn = document.getElementById('nextbtn');
const trackTitle = document.querySelector('.track-title');
const progress = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('current');

let isPlaying = false;
let currentTrackIndex = 0; // Initialize currentTrackIndex

const playlist = [
    {
        title: 'Cafe Corner',
        src: 'music/cafe-corner.mp3'
    },
    {
        title: 'Sunrise Delight',
        src: 'music/sunrise-delight.mp3'
    },
    {
        title: 'Night In Paris',
        src: 'music/night-in-paris.mp3'
    },
];

document.addEventListener('DOMContentLoaded', function() {
    player.play(); // Start playing the audio automatically when the page loads
});

// Play or pause functionality
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        player.pause();
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
    } else {
        player.play();
        playBtn.classList.remove('fa-play');
        playBtn.classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
});

// Next track functionality
nextBtn.addEventListener('click', () => {
    currentTrackIndex++;
    if (currentTrackIndex >= playlist.length) {
        currentTrackIndex = 0; // Loop back to the first track if at the end of the playlist
    }
    player.src = playlist[currentTrackIndex].src;
    trackTitle.textContent = playlist[currentTrackIndex].title;
    player.play();
});

// Previous track functionality
prevBtn.addEventListener('click', () => {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = playlist.length - 1; // Go to the last track if at the beginning of the playlist
    }
    player.src = playlist[currentTrackIndex].src;
    trackTitle.textContent = playlist[currentTrackIndex].title;
    player.play();
});

// Update progress bar
player.addEventListener('timeupdate', () => {
    const duration = player.duration;
    const currentTime = player.currentTime;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeDisplay.textContent = formatTime(currentTime);
});

// Format time as mm:ss
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}
