const express = require("express");
const router = express.Router();
const productmodel = require('../models/products')

router.get('/', async (req,res)=>{
    try {
        const products = await productmodel.find();
        res.render('shop',{products})
        
    } catch (error) {
        console.log(error)
        
    }
})

router.post('/')



module.exports = router;