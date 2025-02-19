const express = require('express');
const router = express.Router();
const usermodel = require('../models/user');
const productmodel = require('../models/products');
const ordermodel = require('../models/order');

router.get('/', async (req, res) => {
  try {
    const user = await usermodel.findById(req.user._id)
    .populate({
        path: 'orders',
        populate: {
            path: 'items', 
            model: 'Product' // 
        }
    });
    
    if(!user){
        res.status(500).json({msg:"no"})
    }
    // user.orders.forEach(order=>{
    //     let itemArray =[]; //to send users all products in a ARRAY
    //      order.items.forEach(item=>{
    //         itemArray.push(item)
    //         console.log(itemArray)
    //     })
    // }) 
    
    res.render('profile',{user});
    
  } catch (error) {
     console.error(error);
      res.status(500).json({ msg: "Internal Server Error" });
  }
});


// router.get('/tt', async (req,res)=>{
//     const user = await usermodel.findOne()
// })

module.exports = router;
