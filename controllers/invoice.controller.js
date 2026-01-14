const Customer = require("../libs/models/customer.model");
const Invoice = require("../libs/models/invoice.model");
const {USDollar} = require("../libs/formatter");

const { body, validationResult, query } = require("express-validator");

const validateInvoice = [
body('customer', 'Select the Customer').notEmpty(),
body('amount', 'Amount must not be empty').notEmpty(),
body('date', 'Due Date must not be empty').notEmpty(),
body('status', 'Select the Status').notEmpty(),
]

//show invoices
const showInvoices = async (req, res) => {
  const query = { owner: req.session.userId };
  const { search } = req.query;
  //call the method to populate customer data
  const invoices = await populateInvoices(Invoice.find(query),search);
  res.render("pages/invoices", {
    title: "Invoices",
    type: "data",
    invoices,
    USDollar,
    info: req.flash("info")[0],
  });
};

//populate invoices
const populateInvoices = (query, search) => {
  
const populateOptions = {
path: 'customer',
model: Customer,
select: '_id name',
};
if (search) {
populateOptions['match'] = { name: { $regex: search, $options: 'i' } };
}
return query.populate(populateOptions)
.then(invoices => invoices.filter(invoice => invoice.customer !== null));

}





//create Invoices
const createInvoice = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    req.flash("errors", errors);
    req.flash("data", req.body);
    return res.redirect("create");
  }
  const newInvoice = req.body;
  newInvoice.owner = req.session.userId;
  await Invoice.create(newInvoice);
  req.flash("info", {
    message: "Invoice created successfully!",
    type: "success",
  });
  return res.redirect("/dashboard/invoices");
};

//get customer data for invoice creation form
const getCustomers = async (req, res, next) => {
  const customerQuery = { owner: req.session.userId };
  const customers = await Customer.find(customerQuery);
  req.customers = customers;
  next();
};

//edit invoice
const editInvoice = async (req, res) => {
  const invoiceId = req.params.id;
  const invoice = await populateInvoices(Invoice.findById(invoiceId));
  const { customers } = req;
  res.render("pages/invoices", {
    title: "Edit Invoice - EcoLuxe Invoice",
    type: "form",
    formAction: "edit",
    customers,
    invoice: req.flash("data")[0] || invoice,
    errors: req.flash("errors"),
  });
};

//update invoice
const updateInvoice = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    req.flash("errors", errors);
    req.flash("data", req.body);
    return res.redirect("edit");
  }
  const invoiceId = req.params.id;
  const data = req.body;
  await Invoice.findByIdAndUpdate(invoiceId, data);
  req.flash("info", {
    message: "Invoice updated successfully!",
    type: "success",
  });
  return res.redirect("/dashboard/invoices");
};

//delete invoice
const deleteInvoice = async (req, res) => {
  const invoiceId = req.params.id;
  await Invoice.findByIdAndDelete(invoiceId);
  req.flash("info", {
    message: "Invoice deleted successfully!",
    type: "success",
  });
  return res.redirect("/dashboard/invoices");
};



module.exports = {
  showInvoices,
  validateInvoice,
  createInvoice,
  getCustomers,
  editInvoice,
  updateInvoice,
  deleteInvoice,
};
