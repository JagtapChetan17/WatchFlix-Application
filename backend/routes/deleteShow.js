const express = require('express');
const router = express.Router();
const Shows = require('../models/Shows');

router.get('/delete-show', async (req, res) => {
    try {
        const shows = await Shows.find();
        res.render('deleteShow',{shows});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.post('/delete-show/:id', async (req, res) => {
    try {
        const deleteShow = await Shows.findOneAndDelete({_id: req.params.id});
        const shows = await Shows.find();
        res.render('deleteShow',{shows, successMessage: 'Show deleted successfully!'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;