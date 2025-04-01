// Load environment variables
require("dotenv").config();

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// Import your Planet model
const Planet = require("./models/planets");

// Create the Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Log database connection status
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
});

// Middleware
app.set("view engine", "ejs"); // So we can render .ejs files
app.use(express.urlencoded({ extended: true })); // To read form data
app.use(methodOverride("_method")); // To support PUT and DELETE

// ROUTES

// Home page
app.get("/", (req, res) => {
  // res.redirect("/planets");
  res.render("index.ejs");
});

// INDEX - show all planets
app.get("/planets", async (req, res) => {
  const planets = await Planet.find();
  res.render("planets/index.ejs", { planets });
});

// NEW - form to add new planet
app.get("/planets/new", (req, res) => {
  res.render("planets/new.ejs");
});

// CREATE - add new planet to DB
app.post("/planets", async (req, res) => {
  req.body.hasLife = req.body.hasLife === "on"; // checkbox logic
  await Planet.create(req.body);
  res.redirect("/planets");
});

// SHOW - show one planet
app.get("/planets/:id", async (req, res) => {
  const planet = await Planet.findById(req.params.id);
  res.render("planets/show.ejs", { planet });
});

// EDIT - show form to edit planet
app.get("/planets/:id/edit", async (req, res) => {
  const planet = await Planet.findById(req.params.id);
  res.render("planets/edit.ejs", { planet });
});

// UPDATE - apply changes
app.put("/planets/:id", async (req, res) => {
  req.body.hasLife = req.body.hasLife === "on";
  await Planet.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/planets/${req.params.id}`);
});

// DELETE - remove a planet
app.delete("/planets/:id", async (req, res) => {
  await Planet.findByIdAndDelete(req.params.id);
  res.redirect("/planets");
});

// Start the server after DB is connected
mongoose.connection.on("connected", () => {
  app.listen(3000, () => {
    console.log("Listening on port 3000 🌍");
  });
});

