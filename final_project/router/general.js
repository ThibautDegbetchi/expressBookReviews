const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const {username,password}=req.body;
    if(username!=="" || password !==""){
        let user=users.find(u=>u.username===username);
        if(!user){
           user= users.push({
                "username": username,
                "password":password
            });
            return res.status(200).json({user});
        }else{
            return res.status(409).json({"message":"user already exist"});
        }
    }else{
        res.status(401).json({"message":"Username or password not submited"});
    }
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
        return res.status(200).json({"isbn":book.isbn,"author":book.author,"title":book.title,"reviews":book.reviews});
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

    const reorderedBook = {
        title: book.title,
        ...book
    };
    if(book){
        return res.status(200).json({"book":reorderedBook});
    }else{
        return res.status(404).json({"message":"no book with this title"});
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn=req.params.isbn;
    let book= Object.values(books).find(book=>book.isbn===isbn);

    if(book){
        book={"reviews":book.reviews, ...book};
        return res.status(200).json({"book":book});
    }else{
        return res.status(400).json({"message":"no book found"});
    }

});

module.exports.general = public_users;
