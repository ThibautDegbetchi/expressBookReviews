const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    return username !== "" ? true : false;
}

const authenticatedUser = (username, password) => { //returns boolean

    let a = false;
    users.forEach((user) => {
        if (user.username === username && user.password === password) {
            a = true;
        }
    });
    return a;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// add a book review

regd_users.post("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  // Extract ISBN from the request parameters
    const review = req.query.review;  // Get the review from the query parameters
    const username = req.session.authorization?.username;  // Get the username from the session (assumed logged in)

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // Find the book by ISBN
    const bookId = parseInt(isbn); // Convert ISBN to match book key
    const book = books[bookId];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // If the book has no reviews object, initialize it
    if (!book.reviews) {
        book.reviews = {};
    }

    // Add or update the review for the current user
    book.reviews[username] = review;

    // Respond with a success message and the updated reviews
    return res.status(200).json({
        message: `The review for the book with ISBN ${isbn} has been added/updated`,
        //reviews: book.reviews
    });
});

// delete a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  // Extract ISBN from the request parameters
    const username = req.session.authorization?.username;  // Get the username from the session (assumed logged in)

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // Find the book by ISBN
    const bookId = parseInt(isbn);  // Convert ISBN to match book key
    const book = books[bookId];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the review exists for the logged-in user
    if (book.reviews[username]) {
        // Delete the user's review
        delete book.reviews[username];

        return res.status(200).json(`review for the ISBN ${isbn} posted by ${username} deleted`);
    } else {
        return res.status(404).json({ message: 'Review not found for the logged-in user' });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
