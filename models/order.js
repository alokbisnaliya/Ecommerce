const mongoose = require('mongoose');

const orderSchema =  mongoose.Schema({
    Fullname:String,
    Email:String,
    Phone:Number,
    Address:String,
    user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    items: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          }],

      totalPrice: {
        type: Number,
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
      },
      orderStatus: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;