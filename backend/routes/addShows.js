require('dotenv').config();
const express = require('express');
const router = express.Router();
const Shows = require('../models/Shows');
const first = require('ee-first');

router.post('/fetch-shows', async (req, res) => {
   let search_term = req.body.searchTerm

   try {

        const url = `https://api.themoviedb.org/3/search/tv?query=${search_term}&include_adult=false&language=en-US&page=1`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: process.env.TMDB_AUTH_KEY
        }
    };

    const responseData = await fetch(url, options)
    const result = await responseData.json()
    
    if (result.results.length===0) {
        return res.status(404).json({ error: 'No shows found with the given search term' });
    }

    //res.json(result)
    res.render('addShowsList', {showsList: result.results});

   } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to featch Show details' });
   }
})

router.get('/addShows/:showId', async (req, res) => {
    const showID = req.params.showId

    try{
        const url = `https://api.themoviedb.org/3/tv/${showID}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: process.env.TMDB_AUTH_KEY
        }
    };

    const showsData = await fetch(url, options)
    const showsDetails = await showsData.json()
    const genreIds = showsDetails.genres.map(genre => genre.id);
    const genreNames = showsDetails.genres.map(genre => genre.name)
    showsDetails.productionCompanies = showsDetails.production_companies.map(company => company.name);

    showsDetails.genreIds = genreIds;
    showsDetails.genres = genreNames;

    const numOfSeasons = showsDetails.number_of_seasons
    showsDetails.seasons = []

    for (let i = 1; i <= numOfSeasons; i++) {
        const seasonUrl = `https://api.themoviedb.org/3/tv/${showID}/season/${i}?language=en-US`;
        const response = await fetch(seasonUrl, options)
        const seasonData = await response.json();
        const episodes = seasonData.episodes.map(episode => ({
            episode_number: episode.episode_number,
            name: episode.name,
            runtime: episode.runtime,
            overview: episode.overview,
            poster: "https://image.tmdb.org/t/p/original" + episode.still_path,
            downloadLink: ""
        }));

        showsDetails.seasons.push({
            season_number: seasonData.season_number,
            episodes: episodes
        });
    }

    const selectedShowDetails = {
        first_air_date: showsDetails.first_air_date,
        genres: showsDetails.genres,
        id: showsDetails.id,
        name: showsDetails.name,
        overview: showsDetails.overview,
        poster_path: "https://image.tmdb.org/t/p/original" + showsDetails.poster_path,
        backdrop_path: "https://image.tmdb.org/t/p/original" + showsDetails.backdrop_path,
        vote_average: showsDetails.vote_average,
        seasons: showsDetails.seasons
    };

    //res.json(showsDetails)

    res.render('addShows', {showsDetails: selectedShowDetails});

    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to featch Show details' });
    }
})

router.post('/add-show-details', async (req, res) => {

    try {
        const showsDetailsData = req.body;
        //console.log("Show Details",showsDetailsData);

        const newshowsDocument = new Shows({
            // genres: showsDetailsData.showDetails.genres.split(',').map(genre => genre.trim()),
            genres: showsDetailsData.showDetails.genres.replace('amp;','').split(',').map(genre => genre.trim()),
            overview: showsDetailsData.showDetails.overview,
            posterPath: showsDetailsData.showDetails.poster_path,
            backdropPath: showsDetailsData.showDetails.backdrop_path,
            releaseDate: new Date(showsDetailsData.showDetails.first_air_date),
            name: showsDetailsData.showDetails.name,
            ratings: Number(showsDetailsData.showDetails.vote_average),
            seasons: showsDetailsData.seasons.map(season => ({
                seasons_number: Number(season.season_number),
                episodes: season.episodes.map(episode => ({
                    episode_number: Number(episode.episode_number),
                    name: episode.name,
                    runtime: Number(episode.runtime),
                    overview: episode.overview,
                    poster: episode.poster,
                    downloadLink: episode.downloadLink
                }))
            }))
        });

        const savedShows = await newshowsDocument.save();

        console.log('Show details saved successfully:', savedShows);
        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to featch Show details' });
    }
})

module.exports = router;