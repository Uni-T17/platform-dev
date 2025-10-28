import { RequestedStatus } from "./statusType";

export type RequestType = {
  book: {
    id: number;
    title: string;
    author: string;
  };
  requestDetail: {
    requestId: number;
    requestedAt: Date;
    requestedStatus: string;
    requestedPrice: number;
    message?: string | null;
  };
  seller: {
    id: number;
    name: string;
  };
};
