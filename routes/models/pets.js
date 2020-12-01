const mongoose = require("mongoose");
const petSchema = new mongoose.Schema({
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner"
  }
});

module.exports = mongoose.model("Pet", petSchema);