const express = require('express');
const router = express.Router();
const {
    showCustomers,
    createCustomer,
    updateCustomer,
    editCustomer,
    validateCustomer,
    deleteCustomer


} = require('../controllers/customer.controller');

router.get('/', showCustomers);

router.get('/create', (req, res) => {
    res.render('pages/customers', {
        title: 'Create Customer - EcoLuxe Invoice',
        formAction:'create',
        type: 'form',
        errors: req.flash('errors'),
        customer: req.flash('data')[0]
    });
});

router.post('/create', validateCustomer, createCustomer);

router.get('/:id/edit', editCustomer);
router.post('/:id/edit', validateCustomer, updateCustomer);
router.post('/:id/delete', deleteCustomer);

module.exports = router;
    