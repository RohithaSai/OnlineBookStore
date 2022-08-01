module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        },
        comment: String,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Review = mongoose.model("Review", schema);
    return Review;
  };
  