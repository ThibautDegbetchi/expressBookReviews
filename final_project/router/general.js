const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const all_books = Object.values(books);
    return res.status(200).json({ "all_books": JSON.stringify(all_books) });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const book = Object.values(books).find(book => book.isbn === isbn);

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "no books with this ISBN" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const all_books=Object.values(books);
    let anBbook=[];
    all_books.forEach((book)=>{
       if(book.author===author){
        anBbook.push(book);
       }
    });
    if(anBbook){
        return res.status(200).json({"books": anBbook});
    }else{
        return res.status(404).json({"message":"no book with this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title= req.params.title;
    let book = Object.values(books).find(book=>book.title===title);
    if(book){
        return res.status(200).json({"book":book});
    }else{
        return res.status(404).json({"message":"no book with this title"});
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
