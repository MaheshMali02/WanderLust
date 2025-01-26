
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlast";
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    // Uncomment this line if you want to reset the database
    await Listing.deleteMany({});

    // Map through initData and ensure image field is a string (URL)
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "67952465ff464cc3d529dc5b",
        image: obj.image // Assuming obj.image is an object with a 'url' field
    }));
    console.log(initData.data);

    // Insert data into the DB
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
