const express = require('express');
let books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const booksArray = Object.values(books);


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body
  const exisitingUser = users.find(user=>user.username === username)

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if(exisitingUser){
        return res.status(401).json({ message: 'User already exists' });
    }
    users.push({username,password})
    return res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  return res.status(200).json({message: "Books retrieved successfully"});
});


function getBooks(){
    return new Promise((resolve, reject)=>{
        resolve(books)
    })
}
public_users.get('/',function(req,res){
    getBooks()
    .then((books)=>{
        res.send(JSON.stringify(books,null,4));
        return res.status(200).json({message:"Success"})
    })
    .catch((error)=>{
        return res.status(500).json({message:"Error",error})
    })
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
  return res.status(200).json({message:`Book with ISBN value ${isbn} successfully  retrieved`});
 });


function getBooksByISBN(isbn){
    return new Promise((resolve, reject)=>{
        const book = books[isbn]
        if (book) {
            resolve(book);
        } else {
            reject(`Book with ISBN ${isbn} not found`);
        }
    })
}
public_users.get('/isbn/:isbn',function(req,res){
    getBooksByISBN(req.params.isbn)
    .then((book)=>{
        res.send(JSON.stringify(book,null,4));
        return res.status(200).json({message:`Book with ISBN ${isbn} found`})
    })
    .catch((error)=>{
        return res.status(500).json({message:"Error",error})
    })
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  const author = req.params.author;
    const filtered_author = booksArray.filter((book)=> book.author === author)
  res.send(filtered_author)
  return res.status(200).json({message:`Book with author name ${author} successfully  retrieved`});
});

const getBookByAuthor = (author) =>{
    return new Promise((resolve, reject)=>{
        const book = booksArray[author];
        if(book){
            resolve(book)
        }else{
            reject(`Book with author ${author} not found`);
        }
    })
}

public_users.all('/author/:author',function(req,res){
    getBookByAuthor(req.params.author)
    .then((book)=>{
        res.send(JSON.stringify(book,null,4));
        return res.status(200).json({message:`Book with author ${author} found`})
    })
    .catch((error)=>{
        return res.status(500).json({message:"Error",error})
    })
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const filtered_title = booksArray.filter((book)=> book.title === title)
  res.send(filtered_title)
  return res.status(200).json({message:`Book with author name ${title} successfully  retrieved`});
});

const getBookByTitle = (title) =>{
    return new Promise((resolve, reject)=>{
        const book = booksArray[title];
        if(book){
            resolve(book)
        }else{
            reject(`Book with title ${title} not found`);
        }
    })
}

public_users.all('/title/:title',function(req,res){
    getBookByTitle(req.params.title)
    .then((book)=>{
        res.send(JSON.stringify(book,null,4));
        return res.status(200).json({message:`Book with title ${title} found`})
    })
    .catch((error)=>{
        return res.status(500).json({message:"Error",error})
    })
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
  return res.status(200).json({message: "Reviews gotten successfully"});
});

module.exports.general = public_users;