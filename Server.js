// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Ensure this line loads the .env file

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI; // or your MongoDB Atlas URI

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema and Model
const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailPhone: { type: String, required: true },
  message: { type: String, required: true },
  dateTime: {
    type: String, // Store formatted date and time as a single string
    default: () => {
      const istFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // 12-hour format with AM/PM
      });

      return istFormatter.format(new Date());
    },
  },
});

const Form = mongoose.model("Form", FormSchema);

// API Endpoint
app.post("/Form", async (req, res) => {
  try {
    const { name, emailPhone, message } = req.body;

    if (!name || !emailPhone || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newFormSubmission = new Form({ name, emailPhone, message });
    await newFormSubmission.save();

    res.status(200).json({ message: "Form submitted successfully." });
  } catch (error) {
    console.error("Error saving form submission:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

app.get("/Display", async (req, res) => {
  try {
    const Display = await Form.find(); // Fetch all documents in the "Form" collection
    res.json(Display); // Send the data as JSON response
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send(err.message);
  }
});


// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});