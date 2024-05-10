import { audioUrls, audioVolume } from "./config.js";

const switchBtn = document.getElementById('audio-switch-btn');
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();
const mainThemeElem = document.querySelector('audio');
let volumePreference = Number(sessionStorage.getItem('volumePreference')) ?? audioVolume;
mainThemeElem.volume = volumePreference;
mainThemeElem.loop = true;
gainNode.gain.value = volumePreference;

if (volumePreference === 0) {
  switchBtn.innerHTML = `
    <img src="./images/sound-off.svg" alt="audio switch">
  `;
}

switchBtn.addEventListener('click', switchAudio);

export const loadedAudio = {};

export function playTheme() {
  mainThemeElem.play();
}

export function stopTheme() {
  mainThemeElem.pause();
  mainThemeElem.currentTime = 0;
}

export async function loadAudio() {
  for (const sound of audioUrls) {
    const res = await loadSound(sound[1]);
    loadedAudio[sound[0]] = res;
  }
}

async function loadSound(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.log(error);
  }
}

export function playAudio(audioBuffer) {
  const src = audioCtx.createBufferSource();
  src.buffer = audioBuffer;
  src.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  src.start();
}

export function switchAudio() {
  if (gainNode.gain.value === 0) {
    gainNode.gain.value = audioVolume;
    mainThemeElem.volume = audioVolume;
    switchBtn.innerHTML = `
      <img src="./images/sound-on.svg" alt="audio switch">
    `;
    switchBtn.setAttribute('aria-checked', 'true');
    playAudio(loadedAudio.click);
  } else {
    gainNode.gain.value = 0;
    mainThemeElem.volume = 0;
    switchBtn.innerHTML = `
      <img src="./images/sound-off.svg" alt="audio switch">
    `;
    switchBtn.setAttribute('aria-checked', 'false');
  }
  sessionStorage.removeItem('volumePreference');
  sessionStorage.setItem('volumePreference', gainNode.gain.value);
}
