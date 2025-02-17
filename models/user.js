const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    Fullname:String,
    Email:String,
    Password:String,
    cart:[ {
         type: mongoose.Schema.Types.ObjectId, ref: 'Product',
         quantity: Number
    }],
    role: { type: String, default: 'user' },
    contact:String,
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
})

module.exports = mongoose.model('user',userSchema);