const express = require('express');
const router = express.Router();

function isAdminAuthenticated(req, res, next){
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next()
    }
    res.redirect('/admin/login')
}

router.get('/', isAdminAuthenticated, (req, res) => {
    res.render('dashboard')
})

router.get('/addMovieRoute', isAdminAuthenticated, (req, res) => {
    res.render('addMovieList')
})

router.get('/updateMovieRoute', isAdminAuthenticated, (req, res) => {
    res.redirect('/edit-movie-list')
})

router.get('/deleteMovieRoute', isAdminAuthenticated, (req, res) => {
    res.redirect('/delete-movie')
})

router.get('/addShowsRoute', isAdminAuthenticated, (req, res) => {
    res.render('addShowsList.hbs');
})

router.get('/updateShowsRoute', isAdminAuthenticated, (req, res) => {
    res.redirect('/edit-shows-list');
})

router.get('/deleteShowsRoute', isAdminAuthenticated, (req, res) => {
    res.redirect('/delete-show');
})


module.exports = router;