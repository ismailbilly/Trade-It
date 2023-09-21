const { model, Schema } = require("mongoose");

const cardSchema = new Schema(
  {
    card_id: {
      type: String,
      unique: true,
      required: true,
    },
    card_name: {
      type: String,
      unique: true,
      required: true,
    },
    card_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bank: {
      type: String,
      required: true,
    },
    expiry_date: {
      type: String, // i made it string because the card expiry date include only the maonth and year
      required: true,
      trim: true,
    },
    card_type: {
      type: String,
      enum: {
        values: ["visa", "verver", "mastercard"], // these are the 3 i know
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

const Card = model("Card", cardSchema);
module.exports = Card;
