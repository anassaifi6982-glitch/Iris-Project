
const irisForm = document.getElementById("irisForm");

const predictBtn = document.getElementById("predictBtn");
const loading = document.getElementById("loading");

const result = document.getElementById("result");
const flowerName = document.getElementById("flowerName");
const confidence = document.getElementById("confidence");

const errorMessage = document.getElementById("errorMessage");


irisForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Hide previous results
    result.classList.add("hidden");
    errorMessage.classList.add("hidden");

    // Get input values
    const data = {
        sepal_length: Number(document.getElementById("sepal_length").value),
        sepal_width: Number(document.getElementById("sepal_width").value),
        petal_length: Number(document.getElementById("petal_length").value),
        petal_width: Number(document.getElementById("petal_width").value)
    };

    // Validate input
    if (Object.values(data).some(value => !Number.isFinite(value) || value <= 0)) {
        errorMessage.textContent = "Please enter valid positive measurements.";
        errorMessage.classList.remove("hidden");
        return;
    }

    // Show loading
    loading.classList.remove("hidden");
    predictBtn.disabled = true;
    predictBtn.textContent = "Predicting...";

    try {

        // Send data to Flask backend
        const response = await fetch("/predict", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });

        const output = await response.json();

        if (!response.ok || output.status !== "success") {
            throw new Error(output.message || "Prediction failed.");
        }

        // Display prediction
        flowerName.textContent = output.flower;

        confidence.textContent =
            "Confidence: " + output.confidence + "%";

        result.classList.remove("hidden");

    }

    catch(error) {

        errorMessage.textContent = error.message;
        errorMessage.classList.remove("hidden");

    }

    finally {

        loading.classList.add("hidden");
        predictBtn.disabled = false;
        predictBtn.textContent = "Predict Flower Species →";

    }

});
