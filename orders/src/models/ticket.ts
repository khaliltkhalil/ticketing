import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@kktickets123/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttr {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttr): TicketDoc;
  findTicket(data: { id: string; version: number }): Promise<TicketDoc | null>;
}
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const { _id, ...rest } = ret;
        return { ...rest, id: ret._id };
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs: TicketAttr) => {
  return new Ticket({ _id: attrs.id, title: attrs.title, price: attrs.price });
};
ticketSchema.statics.findTicket = function (data: {
  id: string;
  version: number;
}) {
  // This method will find a ticket by id and version
  return Ticket.findOne({
    _id: data.id,
    version: data.version - 1, // Ensure we are processing the correct version
  });
};

ticketSchema.methods.isReserved = async function () {
  // This method will check if the ticket is reserved
  // find an order that has this ticket and is not cancelled
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $ne: OrderStatus.Cancelled,
    },
  });
  return !!existingOrder; // returns true if an order exists, false otherwise
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);
export { Ticket };
