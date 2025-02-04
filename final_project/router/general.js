const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    const bookList = books;
    res.json(bookList); // Neatly format JSON output
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    const book = books[isbn];
    if (book) {
      res.json(book); // Send the book details as a JSON response
    } else {
      res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" }); // Handle unexpected errors
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    const author = req.params.author; // Retrieve author from request parameters
    const matchingBooks = [];

    // Get all book keys
    const bookKeys = Object.keys(books);

    // Iterate through books and find matches
    for (const key of bookKeys) {
      const book = books[key];
      if (book.author === author) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      res.json(matchingBooks); // Send matching books as a JSON response
    } else {
      res.status(404).json({ message: "No books found by that author" }); // Handle no books found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books" }); // Handle unexpected errors
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  try {
    const title = req.params.title; // Retrieve author from request parameters
    const matchingBooks = [];

    // Get all book keys
    const bookKeys = Object.keys(books);

    // Iterate through books and find matches
    for (const key of bookKeys) {
      const book = books[key];
      if (book.title === title) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      res.json(matchingBooks); // Send matching books as a JSON response
    } else {
      res.status(404).json({ message: "No books found by that author" }); // Handle no books found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving books" }); // Handle unexpected errors
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    const book = books[isbn];

    if (book) {
      const reviews = book.reviews;
      res.json(reviews); // Send the book reviews as a JSON response
    } else {
      res.status(404).json({ message: "Book not found" }); // Handle book not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reviews" }); // Handle unexpected errors
  }
});

// Use a promise to get the book list
let getBooks = new Promise((resolve, reject) => {
  resolve(books);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getBooks.then((books) => {
    res.json(books); // Neatly format JSON output
  }).catch((error) => {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  });
});

// Use a promise to get the book details based on ISBN
let getBooksDetails = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  getBooksDetails(isbn).then((book) => {
    res.json(book); // Send the book details as a JSON response
  }).catch((error) => {
    console.error(error);
    res.status(404).json({ message: "Book not found" }); // Handle book not found
  });
});

// Use a promise to get the book details based on author
let getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];
    const bookKeys = Object.keys(books);

    for (const key of bookKeys) {
      const book = books[key];
      if (book.author === author) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found by that author");
    }
  });
};

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Retrieve author from request parameters
  getBooksByAuthor(author).then((books) => {
    res.json(books); // Send matching books as a JSON response
  }).catch((error) => {
    console.error(error);
    res.status(404).json({ message: "No books found by that author" }); // Handle no books found
  });
});

// Use a promise to get all books based on title
let getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];
    const bookKeys = Object.keys(books);

    for (const key of bookKeys) {
      const book = books[key];
      if (book.title === title) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found by that title");
    }
  });
};

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // Retrieve author from request parameters
  getBooksByTitle(title).then((books) => {
    res.json(books); // Send matching books as a JSON response
  }).catch((error) => {
    console.error(error);
    res.status(404).json({ message: "No books found by that title" }); // Handle no books found
  });
});

module.exports.general = public_users;
