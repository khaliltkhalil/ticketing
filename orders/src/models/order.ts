import { OrderStatus } from "@kktickets123/common";
import mongoose from "mongoose";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttr {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  paymentIntent?: {
    id: string;
    clientSecret?: string;
  };
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  paymentIntent?: {
    id: string;
    clientSecret?: string;
  };
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
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    paymentIntent: {
      type: {
        id: String,
        clientSecret: String,
      },
      required: false,
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
  return new Order(attrs);
};
const Order = mongoose.model<OrderAttr, OrderModel>("Order", orderSchema);
export { Order };
