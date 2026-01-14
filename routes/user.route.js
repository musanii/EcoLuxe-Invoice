const express = require('express');
const router = express.Router();
const { redirectIfAuthenticated } = require('../libs/middleware');
const {
    signup,
    validateSignup,
    login,
    validateLogin,
    logout
    } = require('../controllers/user.controller');
const { info } = require('autoprefixer');

router.get('/',(req, res) => {
    res.render('pages/index',{title:'EcoLuxe Invoice'})
});
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('pages/login',
        {
            title:'Sign in - EcoLuxe Invoice',
            user:req.flash('data')[0] || {},
            info:req.flash('info')[0],
            errors:req.flash('errors')
        });
});
router.post('/login',validateLogin, login);

    
router.get('/signup',redirectIfAuthenticated, (req, res) => {
    res.render('pages/signup',
        {
        title:'Sign Up - EcoLuxe Invoice',
        user:req.flash('data')[0] || {},
        info:req.flash('info')[0],
        errors:req.flash('errors')
        });
});
router.post('/signup',validateSignup, signup);

router.get('/logout', logout);

module.exports = router;