const songs = [
  {
    src: "tracks/song1.mp3",
    title: "Milana Movie",
    artist: "Sonu Nigam",
    cover: "images/image1.jpg",
  },
  {
    src: "tracks/song2.mp3",
    title: "Bandish Bandits Movie",
    artist: "Dhananjay Mhaskar",
    cover: "images/image2.jpg",
  },
  {
    src: "tracks/song3.mp3",
    title: "Vibe Undi",
    artist: "Arman Malik",
    cover: "images/image3.jpg",
  },
  {
    src: "tracks/song4.mp3",
    title: "Mahanati Movie",
    artist: "Dr.Charulatha Mani",
    cover: "images/image4.jpg",
  },
  {
    src: "tracks/song6.mp3",
    title: "Om Bheem Bush Movie",
    artist: "Arjit Singh",
    cover: "images/ArjithSingh.jpg",
  },
  {
    src: "tracks/song7.mp3",
    title: "Subramaniapuram Movie",
    artist: "Bellie Raj ",
    cover: "images/image7.jpg",
  },
  {
    src: "tracks/song8.mp3",
    title: "Vishwaroopam Movie",
    artist: "Shankar Mahadevan",
    cover: "images/image8.jpg",
  },
  
];

let currentSong = 0;
let isShuffle = false;
let repeatMode = "off"; // "off" | "one" | "all"
let playQueue = [];
let playlistItems = [];

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
  const shuffleBtn = document.getElementById("shuffle");
  const repeatBtn = document.getElementById("repeat");
  const playlistEl = document.getElementById("playlist");
  const currentTimeEl = document.getElementById("current-time");
  const totalTimeEl = document.getElementById("total-time");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const miniToggleBtn = document.getElementById("mini-toggle");
  const miniCover = document.getElementById("mini-cover");
  const miniTitle = document.getElementById("mini-title");
  const miniArtist = document.getElementById("mini-artist");
  const miniPrevBtn = document.getElementById("mini-prev");
  const miniPlayBtn = document.getElementById("mini-play");
  const miniNextBtn = document.getElementById("mini-next");
  const miniCurrentTimeEl = document.getElementById("mini-current-time");

  audio.controls = false;

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return m + ":" + s;
  }

  function updateActivePlaylistItem() {
    playlistItems.forEach(function (item, index) {
      if (!item) return;
      if (index === currentSong) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  function updateMiniPlayerInfo() {
    const song = songs[currentSong];
    if (miniCover) miniCover.src = song.cover;
    if (miniTitle) miniTitle.textContent = song.title;
    if (miniArtist) miniArtist.textContent = song.artist;
  }

  function setPlayingState(isPlaying) {
    playBtn.textContent = isPlaying ? "⏸" : "▶";
    if (miniPlayBtn) {
      miniPlayBtn.textContent = isPlaying ? "⏸" : "▶";
    }
    document.body.classList.toggle("is-playing", isPlaying);
  }

  function updateUIForSong(index) {
    const song = songs[index];
    audio.src = song.src;
    cover.src = song.cover;
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    updateMiniPlayerInfo();
    updateActivePlaylistItem();
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (miniCurrentTimeEl) miniCurrentTimeEl.textContent = "0:00";
  }

  function playSong(index) {
    currentSong = index;
    updateUIForSong(currentSong);
    audio.play();
    setPlayingState(true);
  }

  function togglePlayPause() {
    if (audio.paused) {
      audio.play();
      setPlayingState(true);
    } else {
      audio.pause();
      setPlayingState(false);
    }
  }

  function getNextIndexSequential() {
    if (currentSong >= songs.length - 1) {
      return 0;
    }
    return currentSong + 1;
  }

  function getRandomIndex() {
    if (songs.length <= 1) return currentSong;
    let next = currentSong;
    while (next === currentSong) {
      next = Math.floor(Math.random() * songs.length);
    }
    return next;
  }

  function nextSong() {
    if (playQueue.length > 0) {
      const nextFromQueue = playQueue.shift();
      playSong(nextFromQueue);
      return;
    }

    if (isShuffle) {
      const randomIndex = getRandomIndex();
      playSong(randomIndex);
      return;
    }

    if (repeatMode === "one") {
      playSong(currentSong);
      return;
    }

    if (repeatMode === "off" && currentSong >= songs.length - 1) {
      // Stop at the end
      audio.pause();
      audio.currentTime = 0;
      if (progress) progress.value = 0;
      setPlayingState(false);
      return;
    }

    // "all" or default wrap
    currentSong = getNextIndexSequential();
    playSong(currentSong);
  }

  function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    playSong(currentSong);
  }

  function handleTrackEnd() {
    if (repeatMode === "one") {
      playSong(currentSong);
      return;
    }

    if (playQueue.length > 0 || isShuffle || currentSong < songs.length - 1 || repeatMode === "all") {
      nextSong();
    } else {
      audio.pause();
      audio.currentTime = 0;
      if (progress) progress.value = 0;
      setPlayingState(false);
    }
  }

  // Progress bar update
  audio.addEventListener("timeupdate", function () {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      progress.value = (audio.currentTime / audio.duration) * 100;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (miniCurrentTimeEl) miniCurrentTimeEl.textContent = formatTime(audio.currentTime);
      if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("loadedmetadata", function () {
    if (!isNaN(audio.duration) && audio.duration > 0 && totalTimeEl) {
      totalTimeEl.textContent = formatTime(audio.duration);
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
  audio.addEventListener("ended", handleTrackEnd);

  // Button events
  prevBtn.addEventListener("click", prevSong);
  playBtn.addEventListener("click", togglePlayPause);
  nextBtn.addEventListener("click", nextSong);
  if (miniPrevBtn) miniPrevBtn.addEventListener("click", prevSong);
  if (miniPlayBtn) miniPlayBtn.addEventListener("click", togglePlayPause);
  if (miniNextBtn) miniNextBtn.addEventListener("click", nextSong);

  shuffleBtn.addEventListener("click", function () {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
  });

  repeatBtn.addEventListener("click", function () {
    if (repeatMode === "off") {
      repeatMode = "one";
      repeatBtn.textContent = "🔂";
    } else if (repeatMode === "one") {
      repeatMode = "all";
      repeatBtn.textContent = "🔁";
    } else {
      repeatMode = "off";
      repeatBtn.textContent = "🔁";
    }
    repeatBtn.classList.toggle("active", repeatMode !== "off");
  });

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      const isLight = document.body.classList.toggle("light-theme");
      themeToggleBtn.textContent = isLight ? "Dark mode" : "Light mode";
    });
  }

  if (miniToggleBtn) {
    miniToggleBtn.addEventListener("click", function () {
      document.body.classList.toggle("mini-mode");
    });
  }

  document.addEventListener("keydown", function (event) {
    const tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    switch (event.code) {
      case "Space":
        event.preventDefault();
        togglePlayPause();
        break;
      case "ArrowRight":
        audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || audio.currentTime);
        break;
      case "ArrowLeft":
        audio.currentTime = Math.max(audio.currentTime - 5, 0);
        break;
      case "ArrowUp":
        audio.volume = Math.min(audio.volume + 0.05, 1);
        volume.value = audio.volume.toString();
        break;
      case "ArrowDown":
        audio.volume = Math.max(audio.volume - 0.05, 0);
        volume.value = audio.volume.toString();
        break;
      default:
        if (event.code === "KeyN") {
          nextSong();
        } else if (event.code === "KeyP") {
          prevSong();
        }
        break;
    }
  });

  // Build playlist UI
  songs.forEach(function (song, index) {
    const li = document.createElement("li");
    const titleSpan = document.createElement("span");
    titleSpan.className = "track-title";
    titleSpan.textContent = song.title + " - " + song.artist;

    const indicatorSpan = document.createElement("span");
    indicatorSpan.className = "playing-indicator";
    indicatorSpan.textContent = "";

    li.appendChild(titleSpan);
    li.appendChild(indicatorSpan);

    li.addEventListener("click", function () {
      playSong(index);
    });

    li.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      const useAsNext = window.confirm(
        "OK: Play this track next\nCancel: Add to end of queue"
      );
      if (useAsNext) {
        playQueue.unshift(index);
      } else {
        playQueue.push(index);
      }
    });

    playlistEl.appendChild(li);
    playlistItems[index] = li;
  });

  // Initial state
  updateUIForSong(currentSong);
  audio.volume = 0.5;
});
