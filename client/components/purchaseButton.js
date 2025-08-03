"use client";
import { useRouter } from "next/navigation";
import useRequest from "../hooks/use-request";

const PurchaseButton = ({ ticketId }) => {
  const router = useRouter();
  const [doRequest, loading, errors] = useRequest({
    url: `/api/orders`,
    method: "post",
    body: { ticketId },
    onSuccess: (order) => {
      // Handle successful order creation, e.g., redirect to order details
      router.push(`/orders/${order.id}`);
    },
  });

  return (
    <div>
      {errors}
      <button
        onClick={doRequest}
        className="btn btn-primary"
        disabled={loading}
      >
        Purchase
      </button>
    </div>
  );
};

export default PurchaseButton;
