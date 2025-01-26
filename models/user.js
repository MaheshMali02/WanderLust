// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,  // Ensure email is unique
//     },
// });

// // Use the passport-local-mongoose plugin
// // The usernameField option tells passport-local-mongoose to use the email field as the username
// userSchema.plugin(passportLocalMongoose, {
//     usernameField: "email"  // This will use email as the username field in passport
// });


// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
    }
});

userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("User", userSchema);
