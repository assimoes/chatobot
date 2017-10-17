const mongoose = require('mongoose');
const config = require('../config');
mongoose.connect(config.mongodb.address,  {useMongoClient: true});
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    github: String,
    address: Object
});

var User = mongoose.model('User', UserSchema);

CreateUser = (user, cb) =>  {

    console.log(user);
    var _user = new User(user);    
    _user.save((err) => {
        if (err) return (cb(err, null));
        return cb(null, user);
    });
};

GetUser = (username, cb) => {
    User.findOne({name: username}, (err, user) => {
        return cb(err, user);
    });
};

GetUserFromGithub = (user, cb) => {
    User.findOne({github: user}, (err, user) => {
        return cb(err, user);
    });   
}

RemoveUser = (username, cb) => {
    User.remove({user: username}, (err) => {
        return cb(err);
    });
}


module.exports = {
    CreateUser,
    GetUser,
    GetUserFromGithub
};
