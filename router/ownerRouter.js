const express = require('express');
const router = express.Router();
const ownermodel = require('../models/owner')
const productmodel = require('../models/products');
const isAdmin = require('../controllers/isAdmin')
const orderModle = require('../models/order')
const usermodel = require('../models/user')

router.get('/', async (req, res) => {
    try {
        let admin = await ownermodel.findOne({_id: req.user._id });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const orders = await orderModle.find()
        const products = await productmodel.find();
        const allUsers = await usermodel.find();
        res.render('adminDashbord',{admin , orders,products,allUsers})

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal error" });
    }
});

router.get('/products/create',(req,res)=>{
  res.render('createProduct')
})


router.post('/create',isAdmin, async (req, res) => {
  const { image, name, price } = req.body;

  try {
   
    const newProduct = await productmodel.create({ image, name, price });

    let owner = await ownermodel.findOne({ _id: req.user._id });
    
    if (!owner) {
      console.log("No owner Found");
      return res.status(404).json({ error: "Owner not found" });
    }

    owner.products.push(newProduct._id.toString())
    await owner.save();

    res.redirect('/owners');

  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});




router.get('/products', isAdmin, async (req,res)=>{
  const products = await  productmodel.find()
  res.render('products',{products})
})


router.post('/products/delete-product/:id', async (req,res)=>{
     try {
       let workDone = false;
       let owner = await ownermodel.findOne({_id:req.user._id})
       if(!owner){
          res.status(403).json({msg:"you must login first"})
       }else{  
          let index = owner.products.indexOf(req.params.id.toString());
          owner.products.splice(index,1)
          await owner.save()
          workDone = true;
       }
       if(!workDone){
          res.status(403).json({msg: " can't delete properly"})       
       }         
       await productmodel.findOneAndDelete({_id:req.params.id})
       res.redirect('/owners/products')
    
      
     } catch (error) {
         console.log(error)
     }

})

router.get('/products/edit-product/:id', async (req,res)=>{
  try {

      let  product = await productmodel.findById({_id:req.params.id});
      res.render('editProduct',{product})

  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal Server Error" });
      
  }
})

router.post('/products/update/:id', async (req,res)=>{
  const {name,image,price} = req.body;
  const prod_id = req.params.id;
  try {
      let product = await productmodel.findByIdAndUpdate(
          prod_id,
          {
              name,
              image,
              price

          },
          { new: true }
      ) 
      res.redirect('/owners/products')

      
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal Server Error" });
      
  }
})



router.get('/orders', async (req, res) => {
  try {
    const orders = await orderModle.find().populate('items.product'); // Populating products

    if (orders.length > 0) {
      res.render('allOrders', { orders });
    } else {
      res.render('allOrders', { orders: [], items_name: [] });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post('/orders/status/:id', async (req, res) => {
  try {
     const { id } = req.params; 
     const { status } = req.body; 

     // Update the order status
     const order = await orderModle.findByIdAndUpdate(
        id, 
        { orderStatus: status },
        // { new: true } 
     );

     if (!order) {
        return res.status(404).json({ msg: "Order not found" });
     }

     res.redirect('/owners/orders'); // Redirect after update

  } catch (error) {
     console.error(error);
     res.status(500).json({ msg: "Internal Server Error" });
  }
});


router.get('/allUsers', async (req,res)=>{
  try {
    const allUsers = await usermodel.find();

    res.render('allUsers',{allUsers})
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
})  

router.get('/searchUser', async (req, res) => {
  try {
      const email = req.query.email;  //  Extract email from query parameters
    
      if (!email) {
          return res.render('searchedUser', { user: null, msg: "Please enter an email!" });
      }

      let user = await usermodel.findOne({ Email: email });

      if (user) {
          res.render('searchedUser', { user });  // ✅ Pass user object
      } else {
          res.render('searchedUser', { user: null, msg: "User not found!" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal Server Error" });
  }
});



module.exports = router;