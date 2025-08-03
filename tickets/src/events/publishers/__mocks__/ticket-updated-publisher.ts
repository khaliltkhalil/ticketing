export class TicketCreatedPublisher {
  publish = jest.fn().mockImplementation(() => {
    return Promise.resolve();
  });
}
