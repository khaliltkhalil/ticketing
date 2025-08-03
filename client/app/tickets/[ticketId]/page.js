import createCustomAxios from "../../../api/custom-axios";
import { headers } from "next/headers";
import PurchaseButton from "../../../components/purchaseButton";

const TicketShow = async ({ params }) => {
  const { ticketId } = await params;
  const headerList = await headers();
  const customAxios = createCustomAxios(headerList);
  const { data: ticket } = await customAxios.get(`/api/tickets/${ticketId}`);

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <PurchaseButton ticketId={ticket.id} />
    </div>
  );
};

export default TicketShow;
