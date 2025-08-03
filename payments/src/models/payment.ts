import mongoose from "mongoose";

interface PaymentAttrs {
  paymentIntentId: string;
  orderId: string;
}

interface PaymentDoc extends mongoose.Document {
  paymentIntentId: string;
  orderId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    paymentIntentId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    paymentIntentId: attrs.paymentIntentId,
    orderId: attrs.orderId,
  });
};
const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);
export { Payment };
