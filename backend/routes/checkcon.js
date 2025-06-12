const express = require('express');
const status = require('statuses');
const router = express.Router();

router.get('/check-con', (req, res) => {
    res.json({status: 'ok'});
});

module.exports = router;