const express = require('express');
const router = express.Router();

const {showDashboard} = require('../controllers/dashboard.controller');

const customersRouter = require('./customer.route');

const invoicesRouter = require('./invoice.route');

router.get('/', showDashboard, (req, res) => {
    res.render('pages/dashboard',
         { title: 'Dashboard',

            info:req.flash('info')[0]
          });  
});
router.use('/customers', customersRouter);
router.use('/invoices', invoicesRouter);

module.exports = router;