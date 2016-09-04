const mongoose = require('mongoose');

const userSchema = mongoose.Schema({username: String, password: String });
var User = mongoose.model('User', userSchema);

module.exports = User;

// in mongo shell: use tomgrek_com, db.createCollection("users"),
// db.users.insert({_id:"...", username:"..",password:".."})
// for the first user you create, specify _id as a string
