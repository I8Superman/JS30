"use strict";

// ELEMENTS:
const qs = (s) => document.querySelector(s);
const qsA = (s) => document.querySelectorAll(s);

// Video
const video = qs('.viewer');
// Playback button
const playPauseBtn = qs('.toggle');
// Progress bar and fill
const progressBar = qs('.progress')
const progressFill = qs('.progress__filled')
// Sliders (volume and playback speed)
const sliders = qsA('.player__slider')
// Skip btns:
const skipBtns = qsA('.skip')
// Fullscreen btn:
const fullscrBtn = qs('.fullscreen')

// FUNCTIONS:
let playback = false;
let timeProgress;

const updateBarProg = () => {
    const percentElapsed = (video.currentTime / video.duration * 100);
    progressFill.style.flexBasis = percentElapsed + '%'
}

// Toggle play/pause
const togglePlay = () => {
    const state = video.paused ? 'play' : 'pause';
    // As we combine with a string, we use []:
    video[state]();
};

const updateButton = (e) => {
    if (e.target.paused) {
        console.log('PAUSED')
        playPauseBtn.textContent = '►';
        playPauseBtn.style.fontSize = '14px';
    } else {
        console.log('PLAY')
        playPauseBtn.textContent = '\u2590\u2590';
        playPauseBtn.style.fontSize = '10px';
    }
}

// Click and go to in progress bar
const gotoTime = (e) => {
    const newPos = (e.offsetX / progressBar.offsetWidth) * video.duration;
    video.currentTime = newPos;
    updateBarProg()
}

// Click and or drag sliders
const adjustSlider = (e) => {
    const name = e.target.name
    const value = e.target.value;
    video[name] = value;
}

// Click backwards and forwards btns
const skipTime = (e) => {
    const timeSkipped = +e.target.dataset.skip;
    const timeElapsed = video.currentTime;
    video.currentTime = timeElapsed + timeSkipped;
}

const toggleFullScr = () => {
    video.requestFullscreen()
}

// LISTENERS:

// Click play/pause
playPauseBtn.addEventListener('click', togglePlay);
// Add play/pause events, as these may be triggered by other means than clicking 
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', updateBarProg)
// Click and/or drag progress bar
let mousedown = false; // A 'flag'
progressBar.addEventListener('click', gotoTime);
progressBar.addEventListener('mousemove', (e) => mousedown && gotoTime(e))
// Toggle the mousedown flag:
progressBar.addEventListener('mousedown', () => mousedown = true);
progressBar.addEventListener('mouseup', () => mousedown = false);
// Click slider
sliders.forEach((slider) => {
    slider.addEventListener('change', adjustSlider);
})
// For some reason, this only triggers when the
// mouse button is clicked at the same time...
sliders.forEach((slider) => {
    slider.addEventListener('mousemove', adjustSlider);
})
// Drag slider

// Click skip-btns
skipBtns.forEach(btn => {
    btn.addEventListener('input', skipTime);
});

// Enter fullscreen
fullscrBtn.addEventListener('click', toggleFullScr)