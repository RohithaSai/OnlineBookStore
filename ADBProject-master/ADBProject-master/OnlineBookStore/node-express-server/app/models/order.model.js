module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        userId: String,
        username: String,
        amount: Number,
        orderItems: [{
          bookId: String,
          title: String,
          copies: Number,
          orderStatus: String
        }],
        orderDate: {type: Date, default: Date.now}
      },
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Order = mongoose.model("order", schema);
    return Order;
  };
  