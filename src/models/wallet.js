const { Schema, model } = require("mongoose");

const walletSchema = Schema({
    balance: {
        type: Number,
        required: true,
        default: 0
      },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users",
      },
      transactions: [{
        date: {
          type: Date,
          default: Date.now
        },
        amount: Number,
        description: String
      }],
      currency: {
        type: String,
        default: 'NGN'
      },
      isActive: {
        type: Boolean,
        default: true
      }
    
     
})
const Wallet = model('Wallet', walletSchema);
module.exports= Wallet