const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  distanceFromSun: Number, // in million km
  hasLife: Boolean,
  image: String, // URL of a planet image
});

const Planet = mongoose.model('Planet', planetSchema);

module.exports = Planet;
