import createCustomAxios from "../../api/custom-axios";
import { headers } from "next/headers";
import Link from "next/link";

const OrdersPage = async () => {
  const headersList = await headers();
  const customAxios = createCustomAxios(headersList);
  let orders = [];
  try {
    const { data } = await customAxios.get("/api/orders");
    orders = data;
  } catch (err) {
    // handle error or keep orders empty
  }

  return (
    <div>
      <h1>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders to display.</p>
      ) : (
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>Ticket Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.ticket.title}</td>
                <td>{order.status}</td>
                <td>
                  <Link
                    href={`/orders/${order.id}`}
                    className="btn btn-primary"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersPage;
