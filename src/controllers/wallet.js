const walletModel = require("../models/wallet")
const userModel = require('../models/user')
const transactionModel =require("../models/transaction")
const { findQuery, insertOne,  findOne, updateOne } = require("../repository");

const credit = async (amountPassed, user_id,) => {
    const amount = Math.abs(Number(amountPassed))
    const userDetails = await getUserWallet(user_id)
    const initialbalance = Number(userDetails.amount_after)
    const newbalance = initialbalance + amount  //amount_after
    await updateWallet(user_id, initialbalance, newbalance)
    
    return
}
const debit = async(amountPassed, user_id, ) => {
    const amount = Math.abs(Number(amountPassed))
    const userDetails = await getUserWallet(user_id)
    const initialbalance = Number(userDetails.amount_after)
    if (initialbalance < amount) {
        return [false, "Insufficient balance"]
    } 
    const newbalance = initialbalance - amount  //amount_after
    await updateWallet(user_id, initialbalance, newbalance)
   
    return true
}

const transaction = (type, description, amount, user_id, transaction_status) => { 
    return transactionModel.create({
        transaction_id: uuidv4(),
        user_id: user_id,
        transaction_type: type,
        amount: amount,
        comments: description,
        transaction_status: transaction_status
    })

}
const getUserWallet = (user_id) => {
    return walletModel.findOne({
        where: {
            user_id: user_id
        }
    })
}
const updateWallet = (user_id, initial, after) =>{ 
    return  walletModel.updateOne({
        amount_before: initial,
        amount_after: after
    }, {
        where: {
            user_id: user_id
        }
    })
}
module.exports={credit,debit ,transaction};