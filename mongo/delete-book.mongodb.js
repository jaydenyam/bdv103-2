use("bookstore");

const bookId = "666666666666666666666666";

db.books.remove({ _id: new ObjectId(bookId) });

db.books.find().forEach(function (book) {
  print(book.name);
});