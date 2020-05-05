/*const { contextToHistogram } = require("./graphs/histogram.js");
const { contextToVectorscope } = require("./graphs/vectorscope.js");
const { desktopCapturer, remote } = require('electron');

const { writeFile } = require('fs');*/
import { contextToHistogram } from "./graphs/histogram.js";
import { contextToVectorscope } from "./graphs/vectorscope.js";
import { desktopCapturer, remote } from 'electron';

const { dialog, Menu } = remote;

// Global state
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Buttons
const videoElement = document.querySelector('video');

const canvasElement = document.querySelector('canvas#c');
var histoElement = document.querySelector("#histo");
var vectorElement = document.querySelector("#vectorscope");

let videoCtx = canvasElement.getContext('2d');
let histoCtx = histoElement.getContext('2d');
let vectorCtx = vectorElement.getContext('2d');

const startBtn = document.getElementById('startBtn');
let animationId = -1;

startBtn.onclick = e => {
  if (animationId < 0)
    animationId = setInterval(takeSnapshot, 1);
};

const precision = document.getElementById('precision');
const stopBtn = document.getElementById('stopBtn');

stopBtn.onclick = e => {
  clearInterval(animationId);
  animationId = -1;
};

const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

const inputSources = desktopCapturer.getSources({
  types: ['window', 'screen']
})
  .then(sources =>
    selectSource(sources[0]));

// Get the available video sources
async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      };
    })
  );


  videoOptionsMenu.popup();
}

// Change the videoSource window to record
async function selectSource(source) {

  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  };

  // Create a Stream
  const stream = await navigator.mediaDevices
    .getUserMedia(constraints);
  //console.log(stream);
  stream.onaddtrack = (track) => {
    // console.log(track);
  }

  // Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play();

  // Create the Media Recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };

  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;

  // Updates the UI
}

// Captures all recorded chunks
function handleDataAvailable(e) {
  console.log('video data available');
  recordedChunks.push(e.data);
}

// Saves the video file on stop
async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  if (filePath) {
    writeFile(filePath, buffer, () => console.log('video saved successfully!'));
  }

}

animationId = setInterval(takeSnapshot, 1);
function takeSnapshot() {
  var img = document.querySelector('img') || document.createElement('img');
  var width = videoElement.offsetWidth
    , height = videoElement.offsetHeight;

  canvasElement.width = width;
  canvasElement.height = height;

  videoCtx.drawImage(videoElement, 0, 0, width, height);

  let imgData = videoCtx.getImageData(0, 0, width, height).data; //[rgbargbargba...]

  contextToHistogram(imgData, histoElement, histoCtx, parseInt(precision.value))
  contextToVectorscope(imgData, vectorElement, vectorCtx, parseInt(precision.value))

  delete imgData;

  //img.src = canvasElement.toDataURL('image/png');
  //document.body.appendChild(img);
}
