const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { search } = req.query;
    let allListings;
    if (search) {
        const regex = new RegExp(search, 'i');
        allListings = await Listing.find({ title: regex });
    } else {
        allListings = await Listing.find({});
    }
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    console.log(newListing);

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for update does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.RenderIndexPage = async (req, res) => {
    let { Search, category } = req.query;

    try {
        if ((!Search || Search.trim() === '') && (!category || category.trim() === '')) {
            let data = await listing.find();
            return res.render('listings/index.ejs', { data });
        }

        let query = {};

        //  case-insensitive 
        if (Search && Search.trim() !== '') {
            query.$or = [
                { location: { $regex: Search, $options: 'i' } },
                { country: { $regex: Search, $options: 'i' } }
            ];
        }

        if (category && category.trim() !== '') {
            query.category = { $regex: `^${category}$`, $options: 'i' }; // exact match, case-insensitive
        }

        let results = await listing.find(query);

        if (results.length === 0) {
            req.flash('error', 'Sorry Listing not Available');
            return res.redirect('/listings');
        }

        res.render('listings/index.ejs', { data: results });
    } catch (error) {
        console.error('Error rendering listings:', error);
        req.flash('error', 'Something went wrong');
        res.redirect('/listings');
    }
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
