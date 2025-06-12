const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
    name: String,
    overview: String,
    genres: [String],
    posterPath: String,
    backdropPath: String,
    releaseDate: Date,
    ratings: Number,
    seasons: [{
        seasons_number: Number,
        episodes: [{
            episode_number: Number,
            name: String,
            runtime: Number,
            overview: String,
            poster: String,
            downloadLink: String,
        }]
    }]
});

const Shows = mongoose.model('Shows', showSchema)

module.exports = Shows