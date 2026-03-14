const songs = [
  {
    src: "tracks/song1.mp3",
    title: "Song 1",
    artist: "Artist 1",
    cover: "musiclogo1.png!f305cw",
  },
  {
    src: "tracks/song2.mp3",
    title: "Song 2",
    artist: "Artist 2",
    cover: "musiclogo2.jpg",
  },
  {
    src: "tracks/song3.mp3",
    title: "Song 3",
    artist: "Artist 3",
    cover: "musiclogo3.webp",
  },
  {
    src: "tracks/song4.mp3",
    title: "Song 4",
    artist: "Artist 4",
    cover: "musiclogo3.webp",
  },
];

let currentSong = 0;

window.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audio");
  const progress = document.getElementById("progress");
  const volume = document.getElementById("volume");
  const cover = document.getElementById("cover");
  const titleEl = document.getElementById("title");
  const artistEl = document.getElementById("artist");
  const prevBtn = document.getElementById("prev");
  const playBtn = document.getElementById("play");
  const nextBtn = document.getElementById("next");
  const playlistEl = document.getElementById("playlist");

  // Make sure audio element is visible while debugging
  audio.controls = false;

  function updateUIForSong(index) {
    const song = songs[index];
    audio.src = song.src;
    cover.src = song.cover;
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
  }

  function playSong(index) {
    currentSong = index;
    updateUIForSong(currentSong);
    audio.play();
    playBtn.textContent = "⏸";
  }

  function togglePlayPause() {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = "⏸";
    } else {
      audio.pause();
      playBtn.textContent = "▶";
    }
  }

  function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    playSong(currentSong);
  }

  function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    playSong(currentSong);
  }

  // Progress bar update
  audio.addEventListener("timeupdate", function () {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      progress.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  // Seek when user moves the progress bar
  progress.addEventListener("input", function () {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      audio.currentTime = (progress.value / 100) * audio.duration;
    }
  });

  // Volume control
  volume.addEventListener("input", function () {
    audio.volume = volume.value;
  });

  // Auto-next when song ends
  audio.addEventListener("ended", nextSong);

  // Button events
  prevBtn.addEventListener("click", prevSong);
  playBtn.addEventListener("click", togglePlayPause);
  nextBtn.addEventListener("click", nextSong);

  // Build playlist UI
  songs.forEach(function (song, index) {
    const li = document.createElement("li");
    li.textContent = song.title + " - " + song.artist;
    li.addEventListener("click", function () {
      playSong(index);
    });
    playlistEl.appendChild(li);
  });

  // Initial state
  updateUIForSong(currentSong);
  audio.volume = 0.5;
});
