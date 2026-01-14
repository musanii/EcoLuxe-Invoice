const Customer = require('../libs/models/customer.model');
const Invoice = require('../libs/models/invoice.model');
const { body, validationResult } = require('express-validator');

const validateCustomer = [
    body('name', 'Name must not be empty').notEmpty(),
    body('email', 'Email must not be empty').notEmpty(),
    body('email', 'Email must be valid').isEmail(),
    body('phone', 'Phone must be a valid phone number').optional({ checkFalsy: true }).isMobilePhone(),
    body('address', 'Address must not be empty').optional({ checkFalsy: true }).notEmpty(),
];  


const showCustomers = async (req, res) => {
    const query = { owner: req.session.userId };
    const { search } = req.query;
    if (search) {
query['$or'] = [
{ name: { $regex: search, $options: 'i' } },
{ email: { $regex: search, $options: 'i' } },
{ phone: { $regex: search, $options: 'i' } },
{ address: { $regex: search, $options: 'i' } },
]
}
    const customers = await Customer.find(query);
    res.render('pages/customers', {
        title: 'Customers - EcoLuxe Invoice',
        type:'data',
        customers,
        info: req.flash('info')[0]
    });
};

const createCustomer = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {

        const errors = validationErrors.array();
        req.flash('errors', errors);
        req.flash('data', req.body);
        return res.redirect('create');
    }

   const newCustomer = req.body;
    newCustomer.owner = req.session.userId;
    await Customer.create(newCustomer);
    req.flash('info', 
        {
            message: 'Customer created successfully!',
            type: 'success'
        });
    return res.redirect('/dashboard/customers');
};

const editCustomer = async (req, res) => {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    res.render('pages/customers', {
        title: 'Edit Customer - EcoLuxe Invoice',
        type:'form',
        formAction:'edit',
        customer:req.flash('data')[0] || customer,
        errors:req.flash('errors')
    });
};


const updateCustomer = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array();
        req.flash('errors', errors);
        req.flash('data', req.body);
        return res.redirect('edit');
    }

    const customerId = req.params.id;
    const customerData = req.body;

    await Customer.findByIdAndUpdate(customerId, customerData);
    req.flash('info', {
        message: 'Customer updated successfully!',
        type: 'success'
    });
    return res.redirect('/dashboard/customers');
};

const deleteCustomer = async (req, res) => {
    const customerId = req.params.id;
    // Before deleting the customer, you might want to handle related invoices here
    await Invoice.deleteMany({ customer: customerId });
    await Customer.findByIdAndDelete(customerId);
    req.flash('info', {
        message: 'Customer deleted successfully!',
        type: 'success'
    });
    return res.redirect('/dashboard/customers');
};

module.exports = {
    validateCustomer,
    showCustomers,
    createCustomer,
    editCustomer,
    updateCustomer,
    deleteCustomer
};  