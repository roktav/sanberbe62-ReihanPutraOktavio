import mongoose, { Types } from "mongoose";

export interface orderDetail {
  productID: Types.ObjectId;
  orderID: Types.ObjectId;
  subTotal: number;
  qty: number;
  _id?: Types.ObjectId;
}

const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema<orderDetail>(
  {
    subTotal: {
      type: Schema.Types.Number,
      required: true,
    },
    qty: {
      type: Schema.Types.Number,
      required: true,
      min: [1, "Minimal qty adalah 1"],
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    orderID: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

const orderDetail = mongoose.model("Order Detail", OrderDetailSchema);

export default OrderDetailSchema;
