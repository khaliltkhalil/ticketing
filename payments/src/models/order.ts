import { OrderStatus } from "@kktickets123/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttr {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttr): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const { _id, __v, ...rest } = ret;
        return { ...rest, id: ret._id };
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttr) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    status: attrs.status,
    price: attrs.price,
    version: attrs.version,
  });
};
const Order = mongoose.model<OrderAttr, OrderModel>("Order", orderSchema);
export { Order };
