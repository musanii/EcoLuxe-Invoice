const express = require('express');
const router = express.Router();
const {
showInvoices,
createInvoice, 
validateInvoice,
getCustomers,
editInvoice,
updateInvoice,
deleteInvoice
} = require('../controllers/invoice.controller');

router.get('/create', getCustomers, (req, res) => {
const { customers } = req;
res.render('pages/invoices', {
title: 'Create Invoice',
formAction: 'create',
type: 'form',
customers,
invoice: req.flash('data')[0],
errors: req.flash('errors'),
});
});
router.post('/create', validateInvoice, createInvoice);
router.get('/', showInvoices);
router.get('/:id/edit', getCustomers, editInvoice);
router.post('/:id/edit', validateInvoice, updateInvoice);
router.post('/:id/delete', deleteInvoice);
module.exports = router;