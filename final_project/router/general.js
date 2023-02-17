const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    const userRepeat = users.filter((user) => user.username == username).length;

    if (username && password){
        if (userRepeat == 0){
            users.push({"username" : username , "password" : password})
            return res.status(200).json({message: "User successfully registred. Now you can login"});        }
        else{
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

//Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const ISBN = req.params.isbn;
    if (books[ISBN]){
        res.send(books[ISBN]);
    }
    res.status(404).json({message: "Book not found"})
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksArray = Object.entries(books);
  let authorBooks = {} ;
    for (const [key, book] of booksArray) {
        if (book.author == author){
            authorBooks[key] = book;
        }
    }
    if (Object.keys(authorBooks).length != 0){
        res.send(authorBooks)
    }else{
        res.status(404).json({message: "Book not found"}) 
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksArray = Object.entries(books);
  let titleBooks = {} ;
    for (const [key, book] of booksArray) {
        if (book.title == title){
            titleBooks[key] = book;
        }
    }
    if (Object.keys(titleBooks).length != 0){
        res.send(titleBooks)
    }else{
        res.status(404).json({message: "Book not found"}) 
    }});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  if (books[ISBN]){
      res.send(books[ISBN].reviews);
  }
  res.status(404).json({message: "Book not found"})
});

module.exports.general = public_users;
