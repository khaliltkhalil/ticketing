import { requireAuth, validateRequest } from "@kktickets123/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Publishers } from "../events/publishers/publishers";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is Required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    const ticketCreatedPublisher = Publishers.getPublisher("ticket-created");
    await ticketCreatedPublisher.publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    console.log("Ticket created and event published", ticket);

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
