"use client";
import { useEffect, useState } from "react";
import { OrderStatus as OrderStatusEnum } from "@kktickets123/common";
import Checkout from "./checkout";

const OrderStatus = ({ expiresAt, status, options }) => {
  const msLeft = new Date(expiresAt) - new Date();
  const [timeLeft, setTimeLeft] = useState(msLeft > 0 ? msLeft / 1000 : 0);

  // Helper to format seconds as mm:ss
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const msLeft = new Date(expiresAt) - new Date();
      setTimeLeft(msLeft > 0 ? msLeft / 1000 : 0);
    };
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, []);

  if (
    status === OrderStatusEnum.Cancelled ||
    status === OrderStatusEnum.Complete
  ) {
    return <div>Order is {status}.</div>;
  }

  return (
    <div>
      {timeLeft > 0 ? (
        <div>
          <p>Time left to complete your order: {formatTime(timeLeft)}</p>
          <Checkout options={options} />
        </div>
      ) : (
        <p>Order expired</p>
      )}
    </div>
  );
};

export default OrderStatus;
