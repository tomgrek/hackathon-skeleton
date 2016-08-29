const mongoose = require('mongoose');

const nameSchema = mongoose.Schema({ _id: String, name: String });

var Name = mongoose.model('Name', nameSchema);

module.exports = Name;
