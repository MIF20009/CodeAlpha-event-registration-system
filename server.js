const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes"); // Assuming you named your routes file 'routes.js'
const app = express();

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/event-registration-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Serve static files (CSS, JS, HTML)
app.use(express.static(path.join(__dirname, "public"))); // 'public' folder for static files

// Use the routes you defined
app.use("/", routes);

// Serve the HTML files (login, events, etc.)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); // Your login page
});

app.get("/events.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "events.html")); // Events page (when user logs in)
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
