const express = require('express');
const _ = require('lodash');
const router = express.Router();
const axios = require('axios');
const api_url = "http://www.omdbapi.com/";
const api_key = "27787ed4";

let movies = [];

/* GET tous les films ajoutés */
router.get('/', (req, res) => {
    res.status(200).json({ movies });
});

/* GET le film de l'id correspondant */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const movie = _.find(movies, ["id", id]);
    res.status(200).json({
        message: 'Film found!',
        movie
    });
});

/* PUT un film en renseignant son titre (movie) */
router.put('/:title', (req, res) => {
    axios.get(`${api_url}?t=${req.params.title}&apikey=${api_key}`).then(function (response) {
        const movie = {
            id: response.data.imdbID, 
            movie: response.data.Title, 
            yearOfRelease: response.data.Year, 
            duration: response.data.Runtime,
            actors: response.data.Actors, 
            poster: response.data.Poster, 
            boxOffice: response.data.BoxOffice, 
            rottenTomatoesScore: response.data.imdbRating 

        };
        movies.push(movie);
        res.status(200).json({movies})
    })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
});


/* DELETE un film en renseignant son id */
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    _.remove(movies, ["id", id]);
    res.json({
        message: `Just removed ${id}`
    });
});


/* UPDATE un film en renseignant son id */
router.post('/:id', (req, res) => {
    const { id } = req.params;
    const newNomMovie = req.body.movie;
    console.log(req.body);
    const userToUpdate = _.find(movies, ["id", id]);
    userToUpdate.movie = newNomMovie;
    res.json({
        message: `Just updated ${id} with ${newNomMovie}`
    });
});

module.exports = router;
