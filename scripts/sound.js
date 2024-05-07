import { audioUrls, audioVolume } from "./config.js";

const switchBtn = document.getElementById('audio-switch-btn');
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();
let mainTheme;
gainNode.gain.value = audioVolume;

switchBtn.addEventListener('click', switchAudio);

export const loadedAudio = {};

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

export function playAudio(audioBuffer, playLoop) {
  const src = audioCtx.createBufferSource();
  src.buffer = audioBuffer;
  src.connect(gainNode);
  if (playLoop) {
    src.loop = true;
    mainTheme = src;
  }
  gainNode.connect(audioCtx.destination);
  src.start();
}

export function stopAudio() {
  mainTheme.stop();
}

export function switchAudio() {
  if (gainNode.gain.value === 0) {
    gainNode.gain.value = audioVolume;
    switchBtn.innerHTML = `
      <img src="./images/sound-on.svg" alt="audio switch">
    `;
    playAudio(loadedAudio.click);
  } else {
    gainNode.gain.value = 0;
    switchBtn.innerHTML = `
      <img src="./images/sound-off.svg" alt="audio switch">
    `;
  }
}
