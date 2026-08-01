const scanButton = document.getElementById("scanButton");

scanButton.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            }
        });

        showCamera(stream);

    } catch (error) {
        alert("Unable to access the camera.");
        console.error(error);
    }
});

function showCamera(stream) {

    let video = document.getElementById("camera");

    if (!video) {

        video = document.createElement("video");
        video.id = "camera";
        video.autoplay = true;
        video.playsInline = true;
        video.style.width = "100%";
        video.style.marginTop = "20px";
        video.style.borderRadius = "15px";

        document.querySelector("main").appendChild(video);
    }

    video.srcObject = stream;
}