const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ownermodel = require('../models/owner');
const usermodel = require('../models/user');

router.get('/',(req,res)=>{
    res.render('register');
})


router.post('/', async (req, res) => {
    try {
        const { Email, Password, Fullname, role } = req.body;

        if (!Email || !Password || !Fullname) {
            return res.status(400).json({ msg: "All fields are required!" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(Password, salt);

        // Check if admin exists
        const ownerValue = await ownermodel.countDocuments();

       
        if (role === "admin") {
            if (ownerValue > 0) {
                return res.status(400).json({ msg: "Admin already exists!" });
            }

            // Create admin
            const admin = await ownermodel.create({
                Fullname,
                Email,
                Password: hashedpass,
                role: 'admin'
            });

            if (!admin) {
                return res.status(500).json({ msg: "Admin creation failed!" });
            }

            const token = jwt.sign({ _id: admin._id, role: admin.role }, 'your_secret_key');
            res.cookie('token', token);
            res.redirect('/login'); 

        } else {
           
            let existingUser = await usermodel.findOne({ Email });
            if (existingUser) {
                console.log("User already exists.");
                return res.status(400).json({ msg: "User already exists!" }); // Prevent duplicate user registration
            }

            // Create new user
            let newUser = await usermodel.create({
                Fullname,
                Email,
                Password: hashedpass,
                role: 'user'
            });

            if (!newUser) {
                return res.status(500).json({ msg: "User registration failed!" });
            }

            // Generate a JWT token for the user
            const token = jwt.sign({ _id: newUser._id, role: newUser.role }, 'your_secret_key');
            res.cookie('token', token);

            return res.redirect('/login');
        }
    } catch (err) {
        console.error("Registration Error:", err);
        return res.status(500).json({ msg: "Server error occurred during registration" });
    }
});

module.exports = router;
