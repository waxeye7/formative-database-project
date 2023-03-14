const { response } = require("express");
const express = require("express");
const router = express.Router();
// below is where you edit variable names based on your variable/file structure names
const User = require("../models/user");

// GET (single) User by Username
router.get('/getuserbyusername/:username', async (req, res) => {
    const IDed_User = await User.find({ username: { $eq: req.params.username } });
    res.json(IDed_User)
});


module.exports = router