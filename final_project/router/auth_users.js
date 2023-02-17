const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

//const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
//}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    const reqUser = users.filter((user) => user.username == username && user.password == password)[0];

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (reqUser){
        req.session.username = username;
        req.session.authorization = jwt.sign({"data" : password}, "accesspwd", {expiresIn : 60*60});
        return res.status(200).send("User successfully logged in");
    }else{
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  if (book){
        const bookReview = req.query.review;
        const user = req.session.username;
        book.reviews[user] = bookReview;
        return res.status(200).json({message: "Review added"})
    }else{
        return res.status(404).json({message: "Book not found"})
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const ISBN = req.params.isbn;
    const book = books[ISBN];
    if (book){
          const user = req.session.username;
          delete book.reviews[user];
          return res.status(200).json({message: "Review deleted"})
      }else{
          return res.status(404).json({message: "Book not found"})
      }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
