const mongoose = require('mongoose');
const WorkSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true},
    imageUrl: {
        type:String,
        required: true},
    author: {
        type: String, 
        required: true},
    url: {
        type: String,
        required: true}
});
// = new mongoose.Schema({fname:String,lname:String})
const Work = mongoose.model("Work", WorkSchema);
module.exports = Work