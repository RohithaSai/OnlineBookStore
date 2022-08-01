module.exports = app => {
    const reviews = require("../controllers/review.controller.js");

    var router = require("express").Router();

    // Add review to new Book
    router.post("/:id", reviews.addReview);

    app.use("/api/reviews", router);
}