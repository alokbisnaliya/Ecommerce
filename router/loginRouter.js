const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ownermodel = require('../models/owner');
const usermodel = require('../models/user');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    try {
        const { Email, Password } = req.body;

        let user = await usermodel.findOne({ Email });
        if (!user) {
            user = await ownermodel.findOne({ Email });
        }

        // no user or admin found
        if (!user) {
            return res.status(400).json({ msg: "Invalid user" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const token = jwt.sign({ _id: user._id
            , role: user.role }, 'your_secret_key');
       
        res.cookie('token', token, { httpOnly: true, secure: true }); 
        res.redirect('/')

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
