const { response } = require("express");
const express = require("express");
const router = express.Router();

const Work = require("../models/work");

// GET (all) Works route
router.get('/', async (req, res) => {
    const works = await Work.find();
    res.json(works)
});

// POST new Work
router.post('/addwork', async (req, res) => {
    const newWork = new Work(req.body);
    const savedWork = await newWork.save()
    res.json(savedWork)
});

// DELETE a Work by ID
router.delete('/delete/:id', async (req, res) => {
    const toDelete_Work = await Work.findByIdAndDelete({ _id : req.params.id });
    res.json(toDelete_Work)
});

// UPDATE a Work by ID
router.put('/update/:id', async (req, res) => {
    const toUpdate_Work = await User.findByIdAndUpdate(
        { _id : req.params.id }, 
        { $set: req.body }
    );
    res.json(toUpdate_Work)
});




module.exports = router