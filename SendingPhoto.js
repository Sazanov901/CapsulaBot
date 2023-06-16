const mongoose = require("mongoose");
// const mongoose = require("mongoose");
const Schema = mongoose.Schema;

async function initialize() {
  await mongoose.connect(
    "mongodb+srv://OlegSazanov:InDigga222@vkbot-bmw-game.6nywbop.mongodb.net/Telegram_CapsulaBot"
  );
}

// module.exports = {
//   mongoose: mongoose,
// };

const SendPhoto = new mongoose.Schema({
  RecentPhoto: String,
  ChatId: String,
  SendingStatus: Boolean,
});
const LastPhoto = mongoose.model("LastPhoto", SendPhoto);

module.exports = LastPhoto;
