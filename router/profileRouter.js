const express = require('express')
const router = express.Router();
const ownermodel = require('../models/owner');
const usermodel = require('../models/user');

router.get('/', async (req,res)=>{
    let user = await usermodel.findOne({_id:req.user._id});
    if(!user){
        user = await ownermodel.findOne(({_id:req.user._id}))
    }
    if(!user){
        res.redirect('/login')
    }
    try {
        if(user.role === "admin"){
            res.redirect('/owners')
        }else if (user.role === "user") {
             res.redirect('/users')
        } 
        
    } catch (error) {
        console.log({error:"something went wrong"})
        
    }
})



module.exports = router;
