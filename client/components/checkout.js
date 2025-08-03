"use client";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RlKksRVF9kzevrpOF6l068kju7PIH96GUalKpEsrBR92aVLPdUfTywE0fYGTUeiRN51u0gXncub36rvcrztJRSc00IOQsRfGQ"
);

const Checkout = ({ options }) => {
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};
export default Checkout;
