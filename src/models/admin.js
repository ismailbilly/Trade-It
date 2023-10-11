const { model, Schema } = require("mongoose");

const adminSchema = new Schema(
  {
    admin_id: {
      type: String,
      unique: true,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permission: {
      // i don't know how i will put this
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = model("Admin", adminSchema);
module.exports = Admin;
