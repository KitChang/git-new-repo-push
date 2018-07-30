export interface Request {
  id: string;
  transactionId: string;
  customer: string;
  creator: string;
  follower: string;
  products: [{
    product: string,
    qty: number,
    isOrdered: boolean,
    orderedQty: number,
    isRevoke: boolean
  }];
  isRevoke: boolean;
}
