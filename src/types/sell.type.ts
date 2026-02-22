export type TSell = {
  stocks: { quantity: number; stock: string }[] | [];
  sellingPrice: number;
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
