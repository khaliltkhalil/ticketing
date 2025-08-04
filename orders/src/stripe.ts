import Stripe from "stripe";
console.log(process.env.STRIPE_KEY);
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2025-07-30.basil",
});
