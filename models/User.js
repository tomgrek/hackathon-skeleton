const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({username: String, password: String });

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', userSchema);

module.exports = User;

// in mongo shell: use tomgrek_com, db.createCollection("users"),
// db.users.insert({_id:"...", username:"..",password:".."})
// for the first user you create, specify _id as a string
