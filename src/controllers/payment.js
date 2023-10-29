const { v4: uuidv4 } = require("uuid");

const { startPayment, completePayment } = require("../services/payment");
const { insertOne, updateOne, findOne } = require("../repository/index");
const xwapitDB_collections = require("../repository/collections");
const { credit } = require("./wallet");
const startWalletFunding = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const { amount, email } = req.body;
    if (!amount || !email) {
      res.status(400).json({
        status: false,
        message: "Amount and email are required",
      });
      return;
    }

    const initialiseTransaction = await startPayment(amount, email);
    const newPayment = {
      payment_id: uuidv4(),
      user_id,
      amount,
      payment_status: "pending",
      payment_reference: initialiseTransaction.data.data.reference,
    };
    await insertOne(xwapitDB_collections.payment, newPayment);
    delete initialiseTransaction.data.data.access_code;
    res.status(200).json({
      status: true,
      message: "Transaction initialized successfully",
      data: initialiseTransaction.data.data,
    });
  } catch (error) {
    next(error);
  }
};

const completeWalletFunding = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { reference } = req.body;
    if (!reference || !user_id) {
      res.status(400).json({
        status: false,
        message: "All fields are required",
      });
      return;
    }
    const comfirmPaymentStatus = await findOne(xwapitDB_collections.payment, {
      reference: reference,
    });
    if (comfirmPaymentStatus.payment_status === "fufilled")
      throw new Error("Invalid Transaction");
    const completeTransaction = await completePayment(reference);
    if (completeTransaction.data.data.status != "success") {
      res.status(400).json({
        status: false,
        message: "Invalid transaction reference",
      });
    }
    await updateOne(
      xwapitDB_collections.payment,
      { reference: reference },
      { payment_status: "fufilled" }
    );
    const amountInNaira = Number(completeTransaction.data.data.amount) / 100;

    await credit(amountInNaira, user_id);
    res.status(200).json({
      status: true,
      message: "Your Wallet has been funded successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  startWalletFunding,
  completeWalletFunding,
};
