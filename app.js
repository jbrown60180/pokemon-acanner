const API_KEY = "696bc2a0-fca5-4c63-8861-60590a2c6a7d";
const API_URL = "https://api.pokemontcg.io/v2/cards";

const scanButton = document.getElementById("scanButton");
const captureButton = document.getElementById("captureButton");

const video = document.getElementById("camera");
const canvas = document.getElementById("snapshot");
const preview = document.getElementById("preview");

let stream;

scanButton.onclick = async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            }
        });

        video.srcObject = stream;
        video.style.display = "block";
        captureButton.style.display = "inline-block";
    } catch (err) {
        alert("Camera error: " + err.message);
        console.error(err);
    }
};

captureButton.onclick = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    preview.src = canvas.toDataURL("image/png");
    preview.style.display = "block";
};

async function testCardLookup() {
    try {
        const response = await fetch(`${API_URL}?q=name:pikachu`, {
            headers: {
                "X-Api-Key": API_KEY
            }
        });

        const data = await response.json();

        console.log(data);

        if (data.data.length > 0) {
            alert("Success! Found: " + data.data[0].name);
        } else {
            alert("No cards found.");
        }

    } catch (error) {
        console.error(error);
        alert("Error connecting to Pokémon TCG API.");
    }
}