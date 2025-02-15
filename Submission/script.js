// Reference the <video> and the <source> elements
const video = document.getElementById('video'); 
const videoSource = document.getElementById('video-src');

// Mute the video to comply with autoplay policies
video.muted = true;

// Reference other DOM elements
const videoList = document.getElementById("video-list");
const searchInput = document.getElementById('search-input');

// Create a copy of the original video playlist
const originalList = [...videos];

// Initialize variables to track the current video index and shuffle state
let currentvideoIndex = 0;
let isShuffle = false;

/**
 * Task 1: Update Playlist
 */
function updatePlayList(playlist) {
    videoList.innerHTML = "";
    playlist.forEach((vid, index) => {
        const li = document.createElement("li");
        li.textContent = vid.title;
        li.dataset.index = index;
        videoList.appendChild(li);
    });
}

/**
 * Update the UI with the current video's information.
 */
function updateUI(currentvideoIndex, playlist) {
    document.getElementById('video-title').textContent = playlist[currentvideoIndex]["title"];
    document.getElementById('video-artist').textContent = playlist[currentvideoIndex]["artist-name"];
}

/**
 * Play the video at the current index from the provided playlist.
 */
function playvideo(playlist) {
    video.pause();
    videoSource.src = playlist[currentvideoIndex]["url"];    
    video.load();
    video.play().catch(error => {
      console.error("Autoplay prevented:", error);
    });
    updateUI(currentvideoIndex, playlist);
}

/**
 * Task 2: Video Selection from Playlist
 */
videoList.addEventListener('click', (e) => {
    if (e.target && e.target.nodeName === "LI") {
        currentvideoIndex = parseInt(e.target.dataset.index, 10);
        playvideo(isShuffle ? videos : originalList);
    }
});

/**
 * Task 3: Next Button Click
 */
document.getElementById('next-button').addEventListener('click', () => {
    const playlist = isShuffle ? videos : originalList;
    currentvideoIndex++;
    if (currentvideoIndex >= playlist.length) {
        currentvideoIndex = 0;
    }
    playvideo(playlist);
});

/**
 * Task 4: Previous Button Click
 */
document.getElementById('prev-button').addEventListener('click', () => {
    const playlist = isShuffle ? videos : originalList;
    currentvideoIndex--;
    if (currentvideoIndex < 0) {
        currentvideoIndex = playlist.length - 1;
    }
    playvideo(playlist);
});

/**
 * Added: Pause Button Click
 */
document.getElementById('pause-button').addEventListener('click', () => {
    video.pause();
});

/**
 * Task 5: Shuffling the Playlist
 */
function shuffleArray(array) {
    for (let i = 0; i < array.length; i++) {
        const randomIndex = Math.floor(Math.random() * array.length);
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
}

/**
 * Shuffle button event listener.
 */
document.getElementById('shuffle-button').addEventListener('click', (event) => {
    isShuffle = !isShuffle;
    if (isShuffle) {
        event.target.textContent = "Click to Unshuffle";
        shuffleArray(videos);
        updatePlayList(videos);
        currentvideoIndex = 0;
        playvideo(videos);
    } else {
        event.target.textContent = "Click to Shuffle";
        updatePlayList(originalList);
        currentvideoIndex = 0;
        playvideo(originalList);
    }
});

/**
 * Event listener to filter the playlist based on search input.
 */
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredvideos = originalList.filter((video) =>
        video.title.toLowerCase().includes(searchTerm)
    );
    updatePlayList(filteredvideos);
    if(filteredvideos.length > 0) {
        currentvideoIndex = 0;
        updateUI(currentvideoIndex, filteredvideos);
    }
});

// ----- Auto-Play a Random Video on Page Load -----
currentvideoIndex = Math.floor(Math.random() * originalList.length);
updatePlayList(originalList);
updateUI(currentvideoIndex, originalList);
playvideo(originalList);
