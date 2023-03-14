const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique:true},
    idAdmin: {
        type:Boolean,
        required:true}
});
// = new mongoose.Schema({fname:String,lname:String})
const User = mongoose.model("User", UserSchema);
module.exports = User