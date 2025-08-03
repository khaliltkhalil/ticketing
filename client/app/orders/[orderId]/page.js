import createCustomAxios from "../../../api/custom-axios";
import { headers } from "next/headers";
import { OrderStatus as status } from "@kktickets123/common";
import OrderStatus from "../../../components/orderStatus";
import Checkout from "../../../components/checkout";
import axios from "axios";

const OrderShow = async ({ params }) => {
  const { orderId } = await params;
  const headersList = await headers();
  const customAxios = createCustomAxios(headersList);
  const { data: order } = await customAxios.get(`/api/orders/${orderId}`);

  if (!order) {
    return <div>Order not found</div>;
  }
  console.log(status.Cancelled, order.status, status.Complete);
  const options = {
    clientSecret: order.paymentIntent.clientSecret,
  };

  return (
    <div>
      <h1>Order Details</h1>
      <h4>Order ID: {order.id}</h4>
      <h4>Ticket ID: {order.ticket.id}</h4>
      <h4>Price: {order.ticket.price}</h4>
      <OrderStatus
        expiresAt={order.expiresAt}
        status={order.status}
        options={options}
      />
      {/* {order.status !== status.Cancelled &&
        order.status !== status.Complete && <Checkout options={options} />} */}
    </div>
  );
};
export default OrderShow;
