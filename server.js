`use strict`;

const express = require('express')
const app = express()
const port = 3001
const movieData = require(`./data.json`)


app.get('/', handelHomePage)

function handelHomePage(req, res ){
let output=[];
let newMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview)
output.push(newMovie);
res.json(output);
}


app.get('/favorite', handelFavorite)

function handelFavorite(req, res ){
  res.send("Welcome to Favorite Page")
}



app.listen(port, '127.0.0.1', () => {
    console.log(`Example app listening on port  ${port}`)
  })


 function Movie(title,poster_path,overview) {
   this.title= title;
   this.poster_path= poster_path;
   this.overview=overview; 
 } 