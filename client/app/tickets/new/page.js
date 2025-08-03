"use client";
import { useState } from "react";
import useRequest from "../../../hooks/use-request";
import { useRouter } from "next/navigation";

const NewTicket = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [doRequest, loading, errors] = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => {
      // Redirect or perform any other action after successful ticket creation
      router.push("/");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    doRequest();
  };

  return (
    <div className="container mt-4">
      <h1>Create a New Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            className="form-control"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            id="price"
            className="form-control"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => {
              // Allow only numbers with up to two decimal places
              const val = e.target.value;
              if (/^\d*\.?\d{0,2}$/.test(val)) {
                setPrice(val);
              }
            }}
            required
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          Create
        </button>
      </form>
    </div>
  );
};

export default NewTicket;
