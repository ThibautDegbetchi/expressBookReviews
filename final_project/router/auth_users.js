const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return username!==""? true:false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    
    let a=false;
    users.forEach((user)=>{
        if(user.username===username && user.password === password){
            a = true;
        }
    });
    return a;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username,password} = req.body;

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
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// add a book review

regd_users.post("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username; 

    if (!isValid(username)) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    let book = Object.values(books).find(book => book.isbn === isbn);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.reviews) {
        book.reviews = {};
    }

    book.reviews[username] = {
        reviewer: username,
        rating: 5, 
        comment: review
    };

    return res.status(200).json({
        message: 'Review added/updated successfully',
        reviews: book.reviews
    });
});

// delete a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
