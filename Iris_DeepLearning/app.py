from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
import joblib

app = Flask(__name__)

# Load trained ANN model
model = tf.keras.models.load_model("iris_model.keras")

# Load fitted StandardScaler
scaler = joblib.load("iris_scaler.pkl")

# Iris flower classes
iris_classes = {
    0: "Iris Setosa",
    1: "Iris Versicolor",
    2: "Iris Virginica"
}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        # Get input values
        sepal_length = float(data["sepal_length"])
        sepal_width = float(data["sepal_width"])
        petal_length = float(data["petal_length"])
        petal_width = float(data["petal_width"])

        # Prepare input data
        input_data = np.array([[
            sepal_length,
            sepal_width,
            petal_length,
            petal_width
        ]])

        # Apply the same fitted scaler
        scaled_data = scaler.transform(input_data)

        # ANN prediction
        prediction = model.predict(scaled_data, verbose=0)

        predicted_class = int(np.argmax(prediction, axis=1)[0])

        confidence = float(np.max(prediction)) * 100

        result = {
            "flower": iris_classes[predicted_class],
            "confidence": round(confidence, 2),
            "status": "success"
        }

        return jsonify(result)

    except (ValueError, TypeError, KeyError):
        return jsonify({
            "status": "error",
            "message": "Please enter valid numerical values."
        }), 400

    except Exception:
        return jsonify({
            "status": "error",
            "message": "Prediction failed. Please check the model and input."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
