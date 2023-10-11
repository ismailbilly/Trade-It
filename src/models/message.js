const { model, Schema } = require("mongoose");

const messageSchema = new Schema(
  {
    message_id: {
      type: String,
      unique: true,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing_id: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    is_deleted: {
      type: boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);
module.exports = Message;
