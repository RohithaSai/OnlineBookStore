const db = require("../models");
const Order = db.orders;
const Book = db.books;

// Create and Save a new Order
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username || req.body.amount === 0) {
    res.status(400).send({ message: "Cart can not be empty!" });
    return;
  }

  const book = req.body.orderItems.map(({ bookId }) => bookId);
  const quantity = req.body.orderItems.map(({ copies }) => copies);
  Book.find({ '_id': { $in: book } })
    .then(data => {
      const stockList = data.map(({ stock }) => stock);
      const zeroStockIndex = stockList.findIndex(item => item === 0);
      if (zeroStockIndex === -1) {
        const lessStockIndex = stockList.findIndex((item, index) => quantity[index] > item);
        if (lessStockIndex === -1) {
            req.body.orderItems.forEach((item, index) => {
              Book.findById(item.bookId)
                .then(bookData => {
                  if (!bookData)
                    res.status(404).send({ message: "Not found Book with id " + item.bookId });
                  else {
                    bookData.stock = bookData.stock - quantity[index];
                    bookData.save();
                    if (index === quantity.length - 1) {
                      // Create a Order
                      const order = new Order({
                        userId: req.body.userId,
                        username: req.body.username,
                        amount: req.body.amount,
                        orderItems: req.body.orderItems
                      });
                      // Save Order in the database
                      order
                        .save(order)
                        .then(info => {
                          res.send(info);
                        })
                        .catch(err => {
                          res.status(500).send({
                            message:
                              err.message || "Some error occurred while creating the Order."
                          });
                        });
                    }
                  }
                })
                .catch(err => {
                  res
                    .status(500)
                    .send({ message: "Error while retrieving the Books" });
                });
            })
        } else {
          res.status(404).send({ message: "Only " + data[lessStockIndex].stock + " books available with title " + data[lessStockIndex].title });
          return;
        }
      } else {
          res.status(404).send({ message: "Out Of Stock Book with title " + data[zeroStockIndex].title });
          return;
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error while retrieving the Books" });
    });
};

// Retrieve all Orders from the database with an id.
exports.findAll = (req, res) => {
  const id = req.params.id;
  var condition = id ? { username: { $regex: new RegExp(id), $options: "i" } } : {};
  Order.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Orders."
      });
    });
};

// Update a Order with the specified id and bookId in the request
exports.update = (req, res) => {
  const id = req.params.id;
  const bookId = req.body.bookId;
  Order.findById(id).then((data) => {
    if (!data) {
      res.status(404).send({
        message: `Cannot delete order with id=${id}. Maybe Order was not found!`
      });
    }
    const orderItemIndex = data.orderItems && data.orderItems.findIndex(
      (i) => i.bookId.toString() === bookId.toString()
    );
    if (orderItemIndex === -1) {
      return res.status(400).json({
        message: `Cannot return order with bookId=${bookId}. Maybe Order was not found!`
      });
    } else {
        data.orderItems[orderItemIndex].orderStatus = 'Returned';
        Book.findById(data.orderItems[orderItemIndex].bookId)
          .then(book => {
            if (!book)
              res.status(404).send({ message: "Not found Book with id " + id });
            else {
              book.stock = book.stock + data.orderItems[orderItemIndex].copies;
              data.save();
              book.save().then(() => {
                return res.send({
                  message: "Ordered item was returned successfully!"
                });
              });
            }
          })
          .catch(err => {
            res
              .status(500)
              .send({ message: "Error retrieving Book with id=" + id });
          });
      }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not update order with id=" + id
    });
  });
};

// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Order.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`
        });
      } else {
        
        res.send({
          message: "Order was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Order with id=" + id
      });
    });
};
