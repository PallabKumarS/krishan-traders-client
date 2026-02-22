export type TSell = {
  stocks: { quantity: number; stock: string }[] | [];
  soldTo:
    | {
        name?: string;
        email?: string;
        address?: string;

        phoneNumber: string;
      }
    | string;
  accountId: string;
};
