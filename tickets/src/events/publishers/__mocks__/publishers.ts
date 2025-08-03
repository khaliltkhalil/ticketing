export class Publishers {
  private static publishers: { [key: string]: any } = {
    "ticket-created": {
      publish: jest.fn().mockImplementation((data) => {
        return Promise.resolve();
      }),
    },
    "ticket-updated": {
      publish: jest.fn().mockImplementation((data) => {
        return Promise.resolve();
      }),
    },
  };
  static getPublisher(publisherName: string) {
    return this.publishers[publisherName] || null;
  }
}
