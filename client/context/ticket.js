"use client";
import { createContext, useContext, useState } from "react";

export const TicketsContext = createContext();

export function useTickets() {
  return useContext(TicketsContext);
}

export function TicketsProvider({ children, initialTickets }) {
  const [tickets, setTickets] = useState(initialTickets);
  return (
    <TicketsContext.Provider value={[tickets, setTickets]}>
      {children}
    </TicketsContext.Provider>
  );
}
