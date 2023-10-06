const { Schema, model } = require("mongoose");
const transactionSchema = new Schema({
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    },
    currency: {
        type: String,
        default: 'NGN'
    },
    referenceNumber: {
        type: String
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    }
})
const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;