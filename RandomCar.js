const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RandomCarSchema = new mongoose.Schema({
  1: String,
  2: String,
  3: String,
  4: String,
  5: String,
  6: String,
  7: String,
  8: String,
  9: String,
});

const RandomCar = mongoose.model("RandomCar", RandomCarSchema);

module.exports = RandomCar;
