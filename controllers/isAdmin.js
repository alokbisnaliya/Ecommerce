const jwt = require('jsonwebtoken');

const isAdmin = (req,res,next)=>{
   try {
    let token = req.cookies.token
    let decoded = jwt.verify(token,'your_secret_key');
    if(decoded.role === 'admin'){
       next()
    }else{
       res.status(404).json("You Are not Authorised for this Route");
    }
   
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Internal error" });
   }
}


module.exports = isAdmin;