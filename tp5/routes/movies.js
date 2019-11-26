const express = require('express');
const _ = require('lodash');
const router = express.Router();
const axios = require('axios');
const api_url = "http://www.omdbapi.com/";
const api_key = "27787ed4";

let movies = [];

/* GET tous les films ajoutés */
router.get('/', (req, res) => {
    // Get List of movie and return JSON
    res.status(200).json({ movies });
});

/* GET le film de l'id correspondant */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    // Find movie in DB
    const movie = _.find(movies, ["id", id]);
    // Return user
    res.status(200).json({
        message: 'Film found!',
        movie
    });
});

/* PUT un film en renseignant son titre (movie) */
router.put('/:title', (req, res) => {
    axios.get(`${api_url}?t=${req.params.title}&apikey=${api_key}`).then(function (response) {
        // response.data : sert à récupérer data de l'API
        const movie = {
            id: response.data.imdbID, // String
            movie: response.data.Title, // String
            yearOfRelease: response.data.Year, //Number
            duration: response.data.Runtime,// Number : en minutes
            actors: response.data.Actors, // [String, String]
            poster: response.data.Poster, // String : lien vers une image d'affiche
            boxOffice: response.data.BoxOffice, // Number : en USD$
            rottenTomatoesScore: response.data.imdbRating //Number

        };
        // Ajout au tableau movies
        movies.push(movie);
        res.status(200).json({movies})
    })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
});


/* DELETE un film en renseignant son id */
router.delete('/:id', (req, res) => {
    // Get the :id of the user we want to delete from the params of the request
    const { id } = req.params;

    // Remove from "DB"
    _.remove(movies, ["id", id]);

    // Return message
    res.json({
        message: `Just removed ${id}`
    });
});


/* UPDATE un film en renseignant son id */
router.post('/:id', (req, res) => {
    // Récup l'id du film à modifier
    const { id } = req.params;
    // Récup l'info à update
    const newNomMovie = req.body.movie;
    console.log(req.body);
    // trouve le film dans la database
    const userToUpdate = _.find(movies, ["id", id]);
    // Update
    userToUpdate.movie = newNomMovie;
    // Return message
    res.json({
        message: `Just updated ${id} with ${newNomMovie}`
    });
});

module.exports = router;
