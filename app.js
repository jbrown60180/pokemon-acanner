const scanButton = document.getElementById("scanButton");
const captureButton = document.getElementById("captureButton");

const video = document.getElementById("camera");
const canvas = document.getElementById("snapshot");
const preview = document.getElementById("preview");

let stream;

scanButton.onclick = async () => {

    stream = await navigator.mediaDevices.getUserMedia({
        video:{
            facingMode:"environment"
        }
    });

    video.srcObject = stream;

    video.style.display="block";

    captureButton.style.display="inline-block";

}

captureButton.onclick = ()=>{

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video,0,0);

    preview.src = canvas.toDataURL("image/png");

    preview.style.display="block";

}
