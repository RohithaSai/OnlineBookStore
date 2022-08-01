module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      isbn: Number,
      title: String,
      author: String,
      description: String,
      genre: String,
      price: Number,
      stock: Number,
      reviews: [{
        type: mongoose.Schema.Types.Object,
        ref: 'Review'
      }]
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Book = mongoose.model("book", schema);
  return Book;
};
