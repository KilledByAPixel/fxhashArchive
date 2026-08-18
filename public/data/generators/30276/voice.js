let audioChunks = [];
let audioBlob; 
let audio; 
let audioArray; 

let start; 
let progress; 
let timer;

let voiceLength = 15000;

let promises = []; 
let duration;
let sampleRate;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();

const reader = new FileReader();
reader.onloadend = () => {
    let arrayBuffer = reader.result;
    audioContext.decodeAudioData(arrayBuffer)
        .then(audioBuffer => {
            sampleRate = audioBuffer.sampleRate;
            duration = audioBuffer.duration;
            analyzeAudioBuffer(audioBuffer);
        })
        .catch(error => console.error('Error decoding audio data', error));
};

let n_fragments = 30;
let volumeData = [];              
let frequencyData = [];
let spectralData = [];
let spectralSum = 0;

let volumeParam = new Uint8Array(n_fragments);
let spectralParam = new Uint8Array(n_fragments);
let frequencyParam = new Uint8Array(n_fragments*1024);

if ($fx.context === "minting" && navigator.mediaDevices) {
    recordVoice();   
} else {
    document.getElementById('controls').style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';    
}

function recordVoice() {
    const constraints = { audio: true };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);

            document.getElementById("record").onclick = () => {
                clearInterval(progress);
                document.getElementById("progress-bar").style.width = 0 + "%";

                start = Date.now(); 
                progress = setInterval(updateBar, 25);
                
                audioChunks = [];
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");

                document.getElementById("record").style.background = "red";
                document.getElementById("record").style.color = "black";

                timer = setTimeout(() => {
                    if (mediaRecorder.state !== "inactive") {
                        mediaRecorder.stop();
                        document.getElementById("record").style.background = "";
                        document.getElementById("record").style.color = "";
                    }
                }, voiceLength);                
            };

            document.getElementById("stop record").onclick = () => {
                mediaRecorder.stop();
                clearTimeout(timer)
                console.log(mediaRecorder.state);
            };

            document.getElementById("play").onclick = () => {
                playRecording();
            };
        
            document.getElementById("pause").onclick = () => {
                pauseRecording();
            };

            document.getElementById("stop").onclick = () => {
                stopRecording();
            };

            mediaRecorder.onstop = (e) => {
                clearInterval(progress);

                audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                audioChunks = [];

                const audioURL = URL.createObjectURL(audioBlob);
                audio = new Audio(audioURL);
                console.log("recorder stopped");

                document.getElementById("record").style.background = "";
                document.getElementById("record").style.color = ""

                volumeData = [];              
                frequencyData = [];
                spectralData = [];
                reader.readAsArrayBuffer(audioBlob);
            };

            mediaRecorder.ondataavailable = (e) => {
                audioChunks.push(e.data);
            };

        })
        .catch((err) => {
            console.error(`The following error occurred: ${err}`);
        }); 
}

function playRecording() {
    if (audio && audio.paused) {
        audio.play();
    } else {
        console.warn("No recording available to play.");
    }
}

function pauseRecording() {
    if (audio) {
      audio.pause();
    } else {
      console.warn("No recording available to pause.");
    }    
}

function stopRecording() {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

function updateBar() {
    elapsedTime = Date.now() - start;  
    let progressPercentage = (elapsedTime / voiceLength) * 100;  
    progressPercentage = Math.min(progressPercentage, 100);
    document.getElementById("progress-bar").style.width = progressPercentage + "%";
}

function analyzeAudioBuffer(audioBuffer) {
  promises.length = 0; 
  let channelData = audioBuffer.getChannelData(0);
  let segmentSize = Math.floor(channelData.length / n_fragments);
  for (let i = 0; i < n_fragments; i++) {
    let start = i * segmentSize;
    let end = start + segmentSize;
    let segmentData = channelData.slice(start, end);

    volumeData.push(computeRMS(segmentData));

    let offlineContext = new OfflineAudioContext(1, segmentSize, sampleRate);
    let offlineAnalyser = offlineContext.createAnalyser();
    let source = offlineContext.createBufferSource();

    let fragmentBuffer = offlineContext.createBuffer(1, segmentSize, sampleRate);
    fragmentBuffer.copyToChannel(segmentData, 0);

    source.buffer = fragmentBuffer;
    source.connect(offlineAnalyser);
    offlineAnalyser.connect(offlineContext.destination);
    
    offlineAnalyser.fftSize = 2048;
    let frequencyBinCount = offlineAnalyser.fftSize / 2;
    let fragmentFrequency = new Uint8Array(frequencyBinCount);

    promises.push(
      new Promise(resolve => {
        offlineContext.oncomplete = (event) => {
          offlineAnalyser.getByteFrequencyData(fragmentFrequency);
          frequencyData.push(fragmentFrequency);
          let spectral = computeSpectralCentroid(fragmentFrequency, sampleRate, offlineAnalyser.fftSize);
          spectralSum += spectral;
          spectralData.push(spectral);
          resolve();
        };
        source.start(0);
        offlineContext.startRendering();
      })
    );
  }

  Promise.all(promises).then(() => {
    volumeParam = floatArrayToUint8Array(volumeData,volumeParam);
    spectralParam = floatArrayToUint8Array(spectralData,spectralParam);

    for (let i = 0; i < n_fragments; i++) {
        frequencyParam.set(frequencyData[i],i*1024)
    }

    $fx.emit("params:update", {
        voice1: volumeParam,
        voice2: spectralParam,
        voice3: frequencyParam,
        recorded: true,
    });

  });  
}

function computeSpectralCentroid(frequencyData, sampleRate, fftSize) {
  let numerator = 0;
  let denominator = 0;
  const binSize = sampleRate / fftSize; // Frequency value of each bin
  
  for (let i = 0; i < frequencyData.length; i++) {
    let binFrequency = i * binSize; // Frequency of the current bin
    let binMagnitude = frequencyData[i]; // Magnitude of the current bin
    numerator += binFrequency * binMagnitude;
    denominator += binMagnitude;
  }
  
  if (denominator === 0) return 0; // Avoid division by zero
  return numerator / denominator;
}

function computeRMS(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
  }
  return Math.sqrt(sum / data.length);
}

function floatArrayToUint8Array(floatArray, uint8Array) {
    let min = Math.min(...floatArray);
    let max = Math.max(...floatArray);
    for (let i = 0; i < floatArray.length; i++) {
        let n = (floatArray[i] - min) / (max - min);
        uint8Array[i] = Math.round(n * 255);
    }
    return uint8Array;
}