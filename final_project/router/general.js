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

const axios = require('axios');

// URL of the endpoint that returns the list of books
const booksUrl = 'https://thibautdegbe-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'; // Replace with your actual URL

async function getBooks() {
  try {
    const response = await axios.get(booksUrl);
    console.log('Books:', response.data);
    // Handle the list of books here
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}
getBooks();

// const bookDetailsUrl = booksUrl+'/isbn/:isbn'; 

// function getBookByISBN(isbn) {
//   axios.get(`${bookDetailsUrl}${isbn}`)
//     .then(response => {
//       console.log('Book Details:', response.data);
//     })
//     .catch(error => {
//       console.error('Error fetching book details:', error);
//     });
// }

// const isbn = '978-0-345678-95-5';
// getBookByISBN(isbn);


// const booksByAuthorUrl = booksUrl+"/author/:author"; 

// function getBooksByAuthor(author) {
//   axios.get(`${booksByAuthorUrl}?author=${encodeURIComponent(author)}`)
//     .then(response => {
//       console.log('Books by Author:', response.data);
//     })
//     .catch(error => {
//       console.error('Error fetching books by author:', error);
//     });
// }

// 
// const author = 'Jane Austen'; 
// getBooksByAuthor(author);
// const booksByTitleUrl = booksUrl+'/title/:title'; 

// async function getBooksByTitle(title) {
//   try {
//     const response = await axios.get(`${booksByTitleUrl}?title=${encodeURIComponent(title)}`);
//     console.log('Books by Title:', response.data);
//   } catch (error) {
//     console.error('Error fetching books by title:', error);
//   }
// }


// const title = 'Pride and Prejudice'; 
// getBooksByTitle(title);
module.exports.general = public_users;
