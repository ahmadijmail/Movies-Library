`use strict`;
require(`dotenv`).config();
const url = "postgres://ahmadijmail:0000@localhost:5432/task13";
const express = require("express");
const axios = require("axios").default;
const bodyParser = require("body-parser");
const cors = require(`cors`);
const app = express();
const port = 3002;
const movieData = require(`./MovieData/data.json`);
const apiKey = process.env.APIKEY;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { Client } = require("pg");
const client = new Client(url);
app.use(cors());

//routes
//app.get("/", handelHomePage);
//app.get("/favorite", handelFavorite);
app.get("/trending", handeltrending);
app.get("/search", handelsearch);
app.get("/upcoming", handelupcoming);
app.get("/id", handelSearchId);
app.post("/addMovie", handeladd);
app.get("/getMovies", handelget);
app.use(handleError);

//functions

function handeladd(req, res) {
  const { movieID, movieName, movieLength, type, realsedate } = req.body;
  let sql = ` INSERT INTO Movies(movieID,movieName,movieLength,type,realsedate) VALUES($1,$2,$3,$4,$5) RETURNING *;`;
  let values = [movieID, movieName, movieLength, type, realsedate];

  client
    .query(sql, values)
    .then((result) => {
      console.log(result.rows);
      return res.status(200).json(result.rows);
    })
    .catch((err) => {
      handleError(err, req, res);
    });
}

function handelget(req, res) {
  let sql = `SELECT * from movies`;
  client
    .query(sql)
    .then((result) => {
      console.log(result);
      res.send(result.rows);
    })
    .catch((err) => {
      handleError(err, req, res);
    });
}

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
    .catch((err) => {
      handleError(err, req, res);
    });
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

    .catch((err) => {
      handleError(err, req, res);
    });
}

function handelupcoming(req, res) {
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
  axios
    .get(url)
    .then((result) => {
      console.log(result);
      //res.send("searching");
      res.json(result.data.results);
    })

    .catch((err) => {
      handleError(err, req, res);
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
    .catch((err) => {
      handleError(err, req, res);
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

client.connect().then(() => {
  app.listen(port, "127.0.0.1", () => {
    console.log(`Example app listening on port  ${port}`);
  });
});

function handleError(error, req, res) {
  res.status(500).send(error)
}