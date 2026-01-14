const {Schema, model} = require('mongoose');

const CustomerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    owner:{ type: Schema.Types.ObjectId, ref: 'User' }
});

const Customer = model('Customer', CustomerSchema);

module.exports = Customer;