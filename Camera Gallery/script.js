let video = document.querySelector('video');
let recordBtnContainer = document.querySelector('.record-btn-container');
let captureBtnContainer = document.querySelector('.capture-btn-container');
let recordBtn = document.querySelector('.record-btn');
let captureBtn = document.querySelector('.capture-btn');
let timeContainer = document.querySelector('.timer-container');
let mediaRecorder;
let transparentColor = 'transparent';
let chunks = [];
let constraints = {
    video: true,
    audio: true
}
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener('start', (e) => {
        chunks = [];
    });
    mediaRecorder.addEventListener('dataavailable', (e) => {
        chunks.push(e.data);
    });
    mediaRecorder.addEventListener('stop', (e) => {
        let blob = new Blob(chunks, {type: 'video/mp4'});
        if(db){
            let videoID = shortid();
            let dbTransactions = db.transaction("video", "readwrite");
            let videoStore = dbTransactions.objectStore("video");
            let videoEntry = {
                id: `vid-${videoID}`,
                blobData: blob
            }
            videoStore.add(videoEntry);
        }
        // let videoURL = URL.createObjectURL(blob);
        // let a = document.createElement('a');
        // a.href = videoURL;
        // a.download = 'stream.mp4';
        // a.click();
    })
})

recordBtnContainer.addEventListener('click', (e) => {
    if(!mediaRecorder){
      console.log("hi");
      return;  
    } 
    if(recordBtn.classList.contains('scale-record')){
        recordBtn.classList.remove('scale-record');
        mediaRecorder.stop();
        stopTimer();
        timeContainer.style.display = 'none';
    }
    else{
        recordBtn.classList.add('scale-record');
        mediaRecorder.start();
        startTimer();
        timeContainer.style.display = 'block';
    }
});

captureBtnContainer.addEventListener('click', (e) => {
    captureBtn.classList.add("scale-capture");
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 1000);
    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext('2d');
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);
    // img url & download
    let imageURL = canvas.toDataURL();
    if(db){
        let imageID = shortid();
        let dbTransactions = db.transaction("image", "readwrite");
        let imageStore = dbTransactions.objectStore("image");
        let imageEntry = {
            id: `img-${imageID}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }

    // let a = document.createElement('a');
    // a.href = imageURL;
    // a.download = 'image.png';
    // a.click();
})

let timerID;
let counter = 0;
let timer = document.querySelector('.timer');
function displayTimer(){
    let totalSeconds = counter;
    let hours = Number.parseInt(totalSeconds/3600);
    totalSeconds %= 3600;
    let minutes = Number.parseInt(totalSeconds/60);
    totalSeconds %= 60;
    let seconds = totalSeconds;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timer.innerText = `${hours}:${minutes}:${seconds}`;
    counter++;
}
function startTimer(){
   timerID = setInterval(displayTimer, 1000);
}
function stopTimer(){
    clearInterval(timerID);
    timer.innerText = '00:00:00';
}

let allFilters = document.querySelectorAll('.filter');
let filterLayer = document.querySelector('.filter-layer');
allFilters.forEach((filterEle) => {
    filterEle.addEventListener('click', (e) => {
        transparentColor = getComputedStyle(filterEle).getPropertyValue('background-color');
        filterLayer.style.backgroundColor = transparentColor
    })
})