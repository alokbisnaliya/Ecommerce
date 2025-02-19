const express = require('express')
const router = express.Router();
const usermodel = require('../models/user');
const ordermodel = require('../models/order')

router.get('/', async (req,res)=>{
   try {
     const user = await usermodel.findById({_id:req.user._id}).populate("cart")
     let cartProduct = user.cart
     res.render('cart', {cartProduct})
    
   } catch (error) {
       console.error(error);
       res.status(500).json({ msg: "Server error" });
   }
})

router.post('/add-to-cart', async(req,res)=>{
      try {
        const {productId} = req.body;
        const user = await usermodel.findById({_id:req.user._id})
        if(!user.cart.includes(productId.toString())){
            user.cart.push(productId.toString());
            user.save();
        }else{
            return res.status(404).json({msg:"item Already added"})
        }
        res.redirect('/shop')
      
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
        
      }

});

router.post('/remove',async (req,res)=>{
  try {
   let {item_id} = req.body;
   let user = await usermodel.findById({_id:req.user._id});
   let index = user.cart.indexOf(item_id.toString());
   if(user){
     user.cart.splice(index,1)
     await user.save()
     res.redirect("/cart")
   }
  } catch (error) {
       console.error(error);
       res.status(500).json({ msg: "Server error" });
  }
});

router.get('/checkout', async (req,res)=>{
  try {
     const user = await usermodel.findById({_id: req.user._id}).populate("cart");
     if(user){
        let cart = user.cart;
        let totalprice = 0;
        cart.forEach(item => {
        
           totalprice += item.price
        });
        res.render('checkout',{totalprice})
     }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }

});

router.post('/place-order', async (req, res) => {
  const { Fullname, Email, Address, Phone, totalPrice } = req.body;

  try {
    if (!Fullname || !Email || !Address || !Phone) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Find user
    const user = await usermodel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Create new order
    const order = new ordermodel({
      Fullname,
      Email,
      Address,
      Phone,
      totalPrice,
      user: [user._id],
      
          
    });
    user.cart.forEach(prodId =>{
      order.items.push(prodId)
    })
    await order.save();

    user.orders.push(order._id);
    await user.save();

    return res.redirect('/shop')
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});



module.exports = router;