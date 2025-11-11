import { RequestedStatus } from "./statusType";

export type RequestType = {
  book: {
    id: number;
    title: string;
    author: string;
  };
  requestDetail: {
    requestId: number;
    requestedAt: string;
    requestedStatus: string;
    requestedPrice: number;
    message?: string | null;
  };
  seller?: {
    id: number;
    name: string;
  };
  buyer?: {
    id: number;
    name: string;
    contactInfo: {
      email: string;
      phone: string | null;
      address: string | null;
      preferredContact: string;
    };
  };
};
