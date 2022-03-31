export const dva = {
  config: {
    // onAction: createLogger(),
    onError(e: Error) {
      // message.error(e.message, 3);
      console.error(e)
    },
  },
};
