import "bootstrap/dist/css/bootstrap.css";
import { AuthProvider } from "../context/auth";
import { TicketsProvider } from "../context/ticket";
import { headers } from "next/headers";
import createCustomAxios from "../api/custom-axios";
import Header from "../components/header";

async function RootLayout({ children }) {
  const headersList = await headers();
  const customAxios = createCustomAxios(headersList);
  const { data } = await customAxios.get("/api/users/currentuser");

  return (
    <html lang="en" data-arp="">
      <body>
        <AuthProvider initialCurrentUser={data.currentUser}>
          <Header />
          <div className="container">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}

export default RootLayout;
