const mongoose = require('mongoose')

const OwnerSchema = mongoose.Schema({
    Fullname:String,
    Email: String,
    Password : String,
    products: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Product'
     }],
    role: { type: String, default: 'admin' },
    picture:String,
    gstin:String

})

module.exports =mongoose.model("owner", OwnerSchema)