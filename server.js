`use strict`;
require(`dotenv`).config();
const express = require("express");
const axios = require("axios").default;
const cors = require(`cors`);
const app = express();
const port = 3000;
const movieData = require(`./MovieData/data.json`);
const apiKey = process.env.APIKEY;
app.use(cors());

//routes
//app.get("/", handelHomePage);
//app.get("/favorite", handelFavorite);
app.get("/trending", handeltrending);
app.get("/search", handelsearch);
app.get("/upcoming", handelupcoming);
app.get("/id", handelSearchId);


//functions

function handeltrending(req, res) {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
  axios
    .get(url)
    .then((result) => {
      //console.log(result.data.results);

      let trending = result.data.results.map((trend) => {
        return new Trending(
          trend.id,
          trend.title,
          trend.release_date,
          trend.poster_path,
          trend.overview
        );
      });
      res.send(trending);
    })
    .catch();
}

function handelsearch(req, res) {
  let movieName = req.query.movieName;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`;
  axios
    .get(url)
    .then((result) => {
      //console.log(result.data.results);
      console.log(result);
      res.json(result.data.results);
    })

    .catch((error) => {
      console.log(error);
      res.send("Not found");
    });
}

function handelupcoming(req, res) {
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
  axios
    .get(url)
    .then((result) => {
      console.log(result);
      //res.send("searching");
      res.json(result.data.results)
    })

    .catch((error) => {
      console.log(error);
      res.send("Not found");
    });
}

function handelSearchId(req, res) {
  let movieId = req.query.movieId;
  let url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&page=2`;

  axios
    .get(url)
    .then((result) => {
      res.json(result.data);
    })
    .catch((error) => {
      console.log(error);
      res.send("Not found");
    });
}


function Trending(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

// function handelHomePage(req, res) {
//   let output = [];
//   let newMovie = new Movie(
//     movieData.title,
//     movieData.poster_path,
//     movieData.overview
//   );
//   output.push(newMovie);
//   res.json(output);
// }

// function Movie(title, poster_path, overview) {
//   this.title = title;
//   this.poster_path = poster_path;
//   this.overview = overview;
// }
// function handelFavorite(req, res) {
//   res.send("Welcome to Favorite Page");
// }

// function handelFavorite(req, res) {
//   res.send("Welcome to Favorite Page");
// }



app.use(function (error, req, res, text) {
  res.type("taxt/plain");
  res.status(500);
  res.send("Sorry, something went wrong");
});

app.use(function (req, res, text) {
  res.status(404);
  res.type("text/plain");
  res.send("Not found");
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Example app listening on port  ${port}`);
});
