const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Endpoint to save form data in JSON file
app.post("/saveData", (req, res) => {
    const formData = req.body;

    // Save data to data.json file
    fs.writeFile("data.json", JSON.stringify(formData, null, 4), (err) => {
        if (err) {
            console.error("Error saving data:", err);
            return res.status(500).json({ message: "Failed to save data" });
        }
        res.json({ message: "Data saved successfully" });
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});




server.js