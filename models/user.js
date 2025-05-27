const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

// Register and export the model
module.exports = mongoose.model("user", userSchema);
