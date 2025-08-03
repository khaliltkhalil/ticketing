"use client";
import { Elements } from "@stripe/react-stripe-js";
import PaymentStatus from "../../components/paymentStatus";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RlKksRVF9kzevrpOF6l068kju7PIH96GUalKpEsrBR92aVLPdUfTywE0fYGTUeiRN51u0gXncub36rvcrztJRSc00IOQsRfGQ"
);
const Page = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentStatus />
    </Elements>
  );
};

export default Page;
