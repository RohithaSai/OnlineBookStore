const db = require("../models");
const Review = db.reviews;
const Book = db.books;
const User = db.user;

// Add review to Books.
exports.addReview = (req, res) => {
    let bookId = req.params.id;
    let userId = req.body.userId;
    let comment = req.body.comment;

    // Validate request
    if (!comment || comment === '') {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    User.findById(userId).then((user) => {
        if (!user) {
            return res.status(401).json({
                message: 'Sorry, but you\'re not allowed to comment on books'
            });
        }

        Book.findById(bookId).then((book) => {
            if (!book) {
                return res.status(400).json({
                    message: 'There is no book with the given id in our database.'
                });
            }
            const alreadyReviewed = book.reviews.find(
                (i) => i.userId.toString() === req.body.userId.toString()
              );
        
              if (alreadyReviewed) {
                return res.status(400).json({
                  success: false,
                  message: "User have already reviewed this book",
                });
              }

            Review.create({ comment: comment }).then((newComment) => {
                let re = {
                    comment: newComment.comment.toString(),
                    userId: userId
                }
                book.reviews.push(re);
                newComment.bookId = book._id;
                newComment.userId = userId;

                user.save();
                book.save();
                newComment.save().then(() => {
                    Review
                        .findById(newComment._id)
                        .then((comment) => {
                            return res.status(200).json({
                                message: 'Review posted successfully!'
                            });
                        });
                });
            }).catch((err) => {
                console.log(err);
                return res.status(400).json({
                    message: 'Something went wrong, please try again.'
                });
            });
        });
    });
}