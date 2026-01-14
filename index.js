const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

require('dotenv').config();
require('./libs/dbConnect');
const userRouter = require('./routes/user.route');
const dashboardRouter = require('./routes/dashboard.route');

const { verifyUser } = require('./libs/middleware');

const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));   
app.use(
  session({
    secret: process.env.AUTH_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);                                       
app.use(flash());



app.use('/', userRouter);
app.use('/dashboard', verifyUser, dashboardRouter);




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get('*', (req, res) => {
res.status(404).render('index', { title: 'Not Found', message: '404 - Page Not Found' });
});