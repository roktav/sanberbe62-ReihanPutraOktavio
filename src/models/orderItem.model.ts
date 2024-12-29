import mongoose, { Types } from "mongoose";

export interface IOrder extends Document {
  grandTotal: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdBy: Types.ObjectId;
}

const Schema = mongoose.Schema;

const OrderSchema = new Schema<IOrder>(
  {
    grandTotal: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Nama model referensi
      required: true,
    },
  },
  {
    timestamps: true, // Untuk otomatis menambahkan 'createdAt' dan 'updatedAt'
  }
);

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
