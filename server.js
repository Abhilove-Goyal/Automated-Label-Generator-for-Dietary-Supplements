const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const filePath = path.join(__dirname, 'data.json'); // Correct file path

// Ensure the file exists
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([])); // Create file with empty array
}

// Endpoint to save form data in JSON file
app.post('/saveData', (req, res) => {
  const formData = req.body;

  // Read existing data from file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Failed to read data' });
    }

    let existingData = [];
    if (data) {
      try {
        existingData = JSON.parse(data);
        if (!Array.isArray(existingData)) {
          existingData = [existingData]; // Ensure it's an array
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return res.status(500).json({ message: 'Invalid JSON data' });
      }
    }

    // Add new form data
    existingData.push(formData);

    // Write updated data back to file
    fs.writeFile(filePath, JSON.stringify(existingData, null, 4), (err) => {
      if (err) {
        console.error('Error saving data:', err);
        return res.status(500).json({ message: 'Failed to save data' });
      }
      res.json({ message: 'Data saved successfully' });
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});