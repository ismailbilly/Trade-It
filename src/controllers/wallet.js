const { v4: uuidv4 } = require("uuid");
const { findOne, insertOne } = require("../repository/index");
const xwapitDB_collections = require("../repository/collections");
const walletTransaction = require("../models/walletTransaction");
const { TRANSACTION_TYPE } = require("../enums/index");
const { getConversionAmountRate } = require("./conversion");
const getWalletBalance = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const walletBalance = await findOne(xwapitDB_collections.wallet, {
      user_id,
    });
    res.json({
      status: true,
      balance: walletBalance.amount_after,
      message: "wallet balance fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

const credit = async (amountPassed, user_id) => {
  const amount = Math.abs(Number(amountPassed));
  const userWallet = getUserWallet(user_id);
  const conversionRate = await getConversionAmountRate();
  const amountOfCoinFunded = amount / conversionRate;

  await transaction(
    TRANSACTION_TYPE.CREDIT,
    amountOfCoinFunded,
    conversionRate,
    userWallet.wallet_id,
    amount
  );
  const initialBalance = Number(userWallet.amount_after);
  const newBalance = initialBalance + amountOfCoinFunded; //amount_after
  await updateWallet(user_id, initialBalance, newBalance);
  await updateOne(
    xwapitDB_collections.wallet,
    { wallet_id: userWallet.wallet_id },
    { amount_before: initialBalance, amount_after: newBalance }
  );
};

const debit = async (amountOfCoinToBeDebited, user_id, comments) => {
  const amount = Math.abs(Number(amountOfCoinToBeDebited));
  const userDetails = await getUserWallet(user_id);
  const userWallet = getUserWallet(user_id);
  const initialBalance = Number(userWallet.amount_after);
  if (initialBalance < amount) {
    return [false, "Insufficient balance"];
  }
  const newBalance = initialBalance - amount; //amount_after
  await transaction(TRANSACTION_TYPE.DEBIT, amount, userWallet.wallet_id);
  await updateOne(
    xwapitDB_collections.wallet,
    { wallet_id: userWallet.wallet_id },
    { amount_before: initialBalance, amount_after: newBalance }
  );
};
const transaction = async (
  transaction_type,
  amount_of_coin,
  conversion_rate = "",
  wallet_id,
  amount = null
) => {
  const newTransaction = new walletTransaction({
    wallet_transaction_id: uuidv4(),
    wallet_id,
    amount,
    transaction_type,
    amount_of_coin,
    conversion_rate,
  });
  return insertOne(xwapitDB_collections.walletTransaction, newTransaction);
};

const getUserWallet = async (user_id) => {
  return findOne(xwapitDB_collections.wallet, { user_id });
};

module.exports = {
  credit,
  debit,
  getWalletBalance,
};
