const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb package

// Path to the JSON file
const filePath = path.join(__dirname, 'flowers.json');

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:', err);
    return;
  }

  try {
    let flowers = JSON.parse(data);

    // Add _id field if not present
    flowers = flowers.map((flower) => {
      if (!flower._id) {
        flower._id = new ObjectId().toHexString(); // Use 'new' to instantiate ObjectId
      }
      return flower;
    });

    // Write the updated JSON back to the file
    fs.writeFile(filePath, JSON.stringify(flowers, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing to the JSON file:', writeErr);
      } else {
        console.log('Successfully added _id to each flower in the JSON file.');
      }
    });
  } catch (parseErr) {
    console.error('Error parsing the JSON file:', parseErr);
  }
});
