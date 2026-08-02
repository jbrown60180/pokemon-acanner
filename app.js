const API_KEY = "696bc2a0-fca5-4c63-8861-60590a2c6a7d";
const API_URL = "https://api.pokemontcg.io/v2/cards";

const VISION_KEY = "AIzaSyAEJ6wn4pXm4bh3w0IXxdCmdNHoT6yPUb4";


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


captureButton.onclick = async () => {

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    preview.src = canvas.toDataURL("image/png");
    preview.style.display = "block";

    const imageBase64 = canvas
        .toDataURL("image/png")
        .split(",")[1];

    await recognizeCard(imageBase64);

};



async function recognizeCard(imageBase64) {

    try {

        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${VISION_KEY}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    requests: [
                        {
                            image: {
                                content: imageBase64
                            },

                            features: [
                                {
                                    type: "TEXT_DETECTION"
                                }
                            ]
                        }
                    ]
                })
            }
        );


        const data = await response.json();

        console.log(data);


        const cardText =
            data.responses[0]?.fullTextAnnotation?.text || "";


        alert("Vision read:\n\n" + cardText);


        if (cardText) {

            await findCard(cardText);

        } else {

            alert("No text found. Try a clearer picture.");

        }


    } catch(error) {

        console.error(error);

        alert("Vision error: " + error.message);

    }

}




async function findCard(cardText) {

    try {


        const lines = cardText
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

const possibleNames = lines.slice(0, 5);

const name = possibleNames[0];


        if (!name) {
            alert("Could not read card name.");
            return;
        }



        const response = await fetch(
            `${API_URL}?q=name:"${name}"`,

            {
                headers: {
                    "X-Api-Key": API_KEY
                }
            }

        );


        const data = await response.json();

        console.log(data);



        if (data.data && data.data.length > 0) {


            const card = data.data[0];


            const cardImage = document.getElementById("cardImage");
            const cardName = document.getElementById("cardName");
            const cardSet = document.getElementById("cardSet");
            const cardRarity = document.getElementById("cardRarity");
            const cardPrice = document.getElementById("cardPrice");


            cardImage.src = card.images.large;
            cardImage.style.display = "block";


            cardName.textContent =
                "🃏 " + card.name;


            cardSet.textContent =
                "📚 Set: " + card.set.name;


            cardRarity.textContent =
                "⭐ Rarity: " + (card.rarity || "Unknown");



            let price = "No price available";


            if (card.cardmarket && card.cardmarket.prices) {

                price =
                    "$" +
                    (card.cardmarket.prices.averageSellPrice || "0.00");

            }


            cardPrice.textContent =
                "💰 Price: " + price;


        } else {

            alert("Card not found in database.");

        }


    } catch(error) {

        console.error(error);

        alert("Card search error: " + error.message);

    }

}