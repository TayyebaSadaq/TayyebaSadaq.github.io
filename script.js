var player = document.getElementById("player");
let progress = document.getElementById("progress");
let playbtn = document.getElementById("playbtn");
let prevbtn = document.getElementById("prevbtn"); // Get the previous button element
let nextbtn = document.getElementById("nextbtn"); // Get the next button element
let current = document.getElementById("current");
var playerContainer = document.querySelector(".player");

var playpause = function () {
  if (player.paused) {
    player.play();
    playerContainer.classList.add("playing"); // Add "playing" class to player container when playing
  } else {
    player.pause();
    playerContainer.classList.remove("playing"); // Remove "playing" class when paused
  }
}

playbtn.addEventListener("click", playpause);
prevbtn.addEventListener("click", playPreviousTrack); // Add event listener for previous button
nextbtn.addEventListener("click", playNextTrack); // Add event listener for next button

player.onplay = function () {
  playbtn.classList.remove("fa-play");
  playbtn.classList.add("fa-pause");
}

player.onpause = function () {
  playbtn.classList.add("fa-play");
  playbtn.classList.remove("fa-pause");
}

player.ontimeupdate = function () {
  let ct = player.currentTime;
  current.innerHTML = timeFormat(ct);
  //progress
  let duration = player.duration;
  prog = Math.floor((ct * 100) / duration);
  progress.style.setProperty("--progress", prog + "%");
}

function timeFormat(ct) {
  minutes = Math.floor(ct / 60);
  seconds = Math.floor(ct % 60);

  if (seconds < 10) {
    seconds = "0"+seconds;
  }

  return minutes + ":" + seconds;
}

let currentTrackIndex = 0;

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

// Next track functionality
function playNextTrack() {
  currentTrackIndex++;
  if (currentTrackIndex >= playlist.length) {
      currentTrackIndex = 0; // Loop back to the first track if at the end of the playlist
  }
  player.src = playlist[currentTrackIndex].src;
  player.play();
  updateTrackTitle(); // Update the track title
}

// Previous track functionality
function playPreviousTrack() {
  currentTrackIndex--;
  if (currentTrackIndex < 0) {
      currentTrackIndex = playlist.length - 1; // Go to the last track if at the beginning of the playlist
  }
  player.src = playlist[currentTrackIndex].src;
  player.play();
  updateTrackTitle(); // Update the track title
}

// Function to update the track title
function updateTrackTitle() {
  let trackTitle = document.querySelector(".track-title");
  trackTitle.textContent = playlist[currentTrackIndex].title;
}
