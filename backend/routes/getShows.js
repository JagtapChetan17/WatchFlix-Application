const express = require('express');
const router = express.Router();
const isLoggedIn = require('../routes/isLoggedIn')
const Shows = require('../models/Shows')

router.get('/getAllShows', async (req, res) => {
   try{
    const allShows = await Shows.find();
    res.json(allShows);
   } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
   }
});

router.get('/getAllShowsByGenre', async (req, res) => {
    try{
        const distinctGenres = await Shows.distinct('genres');
        
        const showsByGenre = await Promise.all(
            distinctGenres.map(async (genre) => {
                const shows = await Shows.find({ genres: genre })
                return { genre, shows }
            })
        )

        res.json(showsByGenre);
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

const getUniqueGenres = (shows) => {
    const genresSet = new Set();

    shows.forEach(show => {
        show.genres.forEach((genre) => {
            genresSet.add(genre);
        });
    });

    const uniqueGenres = [...genresSet];

    return uniqueGenres;
}

router.get('/getAllGenres', async (req, res) => {
    try{
        const allShows = await Shows.find();

        const uniqueGenres = getUniqueGenres(allShows);

        res.json(uniqueGenres);
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.get('/searchShows/:showName', async (req, res) => {
    try{
        const { showName } = req.params;

        const matchingShows = await Shows.find({ name: { $regex: showName, $options: 'i' } });

        res.json(matchingShows);
    }catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;