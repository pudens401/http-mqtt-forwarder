// server.js
require("dotenv").config();
const express = require("express");
const mqtt = require("mqtt");

const app = express();
const PORT = 8080;


const mqttClient = mqtt.connect(process.env.MQTT_HOST);

// Log MQTT status
mqttClient.on("connect", () => {
    console.log("[MQTT] Connected");
});
mqttClient.on("error", (err) => {
    console.error("[MQTT] Error:", err);
});

// Helper for publishing
function publish(topic, msg, res, successMsg) {
    mqttClient.publish(topic, msg, { qos: 0 }, (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: "Failed to publish to MQTT"
            });
        }
        return res.json({
            success: true,
            message: successMsg
        });
    });
}

// -----------------------------
//      ROUTES
// -----------------------------

// Lamp ON
app.get("/lamp/on", (req, res) => {
    publish(
        "lampur/001/on",
        "1",
        res,
        "Lamp turned on"
    );
});

// Lamp OFF
app.get("/lamp/off", (req, res) => {
    publish(
        "lampur/001/off",
        "1",
        res,
        "Lamp turned off"
    );
});

// Brightness
app.get("/lamp", (req, res) => {
    let { brightness } = req.query;

    if (brightness === undefined) {
        return res.status(400).json({
            success: false,
            error: "Brightness query parameter is required: /lamp?brightness=1-100"
        });
    }

    brightness = Number(brightness);

    if (isNaN(brightness)) {
        return res.status(400).json({
            success: false,
            error: "Brightness must be a number"
        });
    }

    // Clamp 1–100
    if (brightness < 1) brightness = 1;
    if (brightness > 100) brightness = 100;

    publish(
        "lampur/001/brightness",
        String(brightness),
        res,
        `Brightness set to ${brightness}`
    );
});

// -----------------------------
//      START SERVER
// -----------------------------
app.listen(PORT, () => {
    console.log(`HTTP to MQTT forwarder running on port ${PORT}`);
});
