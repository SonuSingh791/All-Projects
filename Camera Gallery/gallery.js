setTimeout(() => {
    if(db){
        //  Videos Retreaval
        let dbTransactions = db.transaction("video", "readonly");
        let videoStore = dbTransactions.objectStore("video");
        let videoRequest = videoStore.getAll(); // Event driven
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryContainer = document.querySelector(".gallery-container");
            videoResult.forEach((videoObj) => {
                let mediaContainerEle = document.createElement("div");
                mediaContainerEle.setAttribute("class", "media-container");
                mediaContainerEle.setAttribute("id", videoObj.id);
                let url = URL.createObjectURL(videoObj.blobData);
                mediaContainerEle.innerHTML = `
                <div class="media">
                    <video autoplay loop controls src="${url}"></video>
                </div>
                <div class="download">download</div>
                <div class="delete">Delete</div>
                `
                galleryContainer.appendChild(mediaContainerEle);

                let deleteBtn = mediaContainerEle.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener)
                let downloadBtn = mediaContainerEle.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            });
        }

        // Image retrieval

        let imageDBTransactions = db.transaction("image", "readonly");
        let imageStore = imageDBTransactions.objectStore("image");
        let imageRequest = imageStore.getAll(); // Event driven
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryContainer = document.querySelector(".gallery-container");
            imageResult.forEach((imageObj) => {
                let mediaContainerEle = document.createElement("div");
                mediaContainerEle.setAttribute("class", "media-container");
                mediaContainerEle.setAttribute("id", imageObj.id);
                let url = imageObj.url;
                mediaContainerEle.innerHTML = `
                <div class="media">
                    <img src="${url}" />
                </div>
                <div class="download">download</div>
                <div class="delete">Delete</div>
                `
                galleryContainer.appendChild(mediaContainerEle);
                let deleteBtn = mediaContainerEle.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener)
                let downloadBtn = mediaContainerEle.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);
            });
        }
    }
}, 100);

function deleteListener(e){
    let id = e.target.parentElement.getAttribute("id");
    console.log('delete')
    // DB removal
    if(id.slice(0,3) === "img"){
        let imageDBTransactions = db.transaction("image", "readwrite");
        let imageStore = imageDBTransactions.objectStore("image");
        imageStore.delete(id);
    }
    else if(id.slice(0,3)  === "vid"){
        let dbTransactions = db.transaction("video", "readwrite");
        let videoStore = dbTransactions.objectStore("video");
        videoStore.delete(id);
    }

    // UI removal

    e.target.parentElement.remove();
}
function downloadListener(e){
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        let dbTransactions = db.transaction("video", "readonly");
        let videoStore = dbTransactions.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let videoURL = URL.createObjectURL(videoResult.blobData);
            let a = document.createElement('a');
            a.href = videoURL;
            a.download = 'stream.mp4';
            a.click();
        }
    }
    else if(type === "img"){
        let imageDBTransactions = db.transaction("image", "readonly");
        let imageStore = imageDBTransactions.objectStore("image");
        let imageRequest = imageStore.get(id); // Event driven
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let a = document.createElement('a');
            a.href = imageResult.url;
            a.download = 'myImage.png';
            a.click();
        }
    }
}