const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// async function initialize() {
//   await mongoose.connect(
//     "mongodb+srv://OlegSazanov:InDigga222@vkbot-bmw-game.6nywbop.mongodb.net/test"
//   );
// }

// module.exports = {
//   mongoose: mongoose,
// };

const CarSchema = new mongoose.Schema({
  Name: String,
  Level: Number,
  Exp: Number,
  ConditionNumber: Number,
  Condition: String,
  Health: String,
  Money: Number,
  Class: String,
  Fuel: Number,
  CarPicture: String,
  ChatId: String,
  UserId: String,

  DateOfCreation: Date,
});

const Car = mongoose.model("Car", CarSchema);

module.exports = Car;
