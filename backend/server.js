// import modules
require('dotenv').config();
const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");

const projectRoutes = require("./routes/projects");
const adminRoutes = require("./routes/admin");


// express app
const app = express();

//setting view engine to ejs
app.set("view engine", "ejs");



// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
});
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5000", credentials: true }));

// routes
app.use("/api/projects", projectRoutes)
app.use("/api/admin", adminRoutes)


// db
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB CONNECTED"))
    .catch((err) => console.log("DB CONNECTION ERROR", err));



const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.send("Api running");
    })
}

// listener for request
app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
);