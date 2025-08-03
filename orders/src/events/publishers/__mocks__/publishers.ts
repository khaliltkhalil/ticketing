export class Publishers {
  private static publishers: { [key: string]: any } = {
    "order-created": {
      publish: jest.fn().mockImplementation((data) => {
        return Promise.resolve();
      }),
    },
    "order-cancelled": {
      publish: jest.fn().mockImplementation((data) => {
        return Promise.resolve();
      }),
    },
  };
  static getPublisher(publisherName: string) {
    return this.publishers[publisherName] || null;
  }
}
