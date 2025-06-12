const express = require('express');
const router = express.Router();
const isLoggedIn = require('../routes/isLoggedIn')
const Shows = require('../models/Shows')

router.post('/add-show-to-mylist/:showID', isLoggedIn, async (req, res) => {
    try{

        const user = req.user
        user.showsMylist.push(req.params.showID);
        await user.save();
        res.json({success: true, user});

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})

router.post('/remove-show-to-mylist/:showID', isLoggedIn, async (req, res) => {
    try{

        const user = req.user
        user.showsMylist = user.showsMylist.filter(showID => showID != req.params.showID);
        await user.save();
        res.json({success: true, user});

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/showsMylist', isLoggedIn, async (req, res) => {
    try{

        const user = req.user
        const showsInMylist = await Shows.find({ _id: { $in: user.showsMylist } });

        res.json({success: true, showsInMylist});

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;