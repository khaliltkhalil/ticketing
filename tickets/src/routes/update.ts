import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@kktickets123/common";
import { body } from "express-validator";
import { validateRequest, requireAuth } from "@kktickets123/common";
import { Publishers } from "../events/publishers/publishers";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is Required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    const currentUserId = req.currentUser!.id;

    if (currentUserId !== ticket.userId) {
      throw new NotAuthorizedError("Not authorized to update the ticket");
    }
    // Check if the ticket is reserved
    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    const { title, price } = req.body;
    ticket.title = title;
    ticket.price = price;

    await ticket.save();

    const ticketUpdatedPublisher = Publishers.getPublisher("ticket-updated");

    await ticketUpdatedPublisher.publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
