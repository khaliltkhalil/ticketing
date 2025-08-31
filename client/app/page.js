import createCustomAxios from "../api/custom-axios";
import { useAuth } from "../context/auth";
import { useTickets } from "../context/ticket";
import { headers } from "next/headers";
import Link from "next/link";

const Page = async () => {
  const headersList = await headers();
  const customAxios = createCustomAxios(headersList);
  const { data: tickets } = await customAxios.get("/api/tickets");

  const ticketList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href={`/tickets/${ticket.id}`} className="btn btn-primary">
          View
        </Link>
      </td>
    </tr>
  ));

  return (
    <div className="container mt-4">
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList.length > 0 ? (
            ticketList
          ) : (
            <tr>
              <td colSpan="2" className="text-center">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
