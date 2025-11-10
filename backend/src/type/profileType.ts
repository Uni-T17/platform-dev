import { BookDetailsResponseType } from "./bookType";

export type CurrentUserProfileType = {
  userId: number;
  profileCard: {
    name: string;
    email: string;
    rating: number;
    memberSince: string;
    bio?: string | null;
    liveIn?: string | null;
  };
  creditsBalance: number;
  bookListed: number;
  exchanges: number;
  contactInfo: {
    phone?: string | null;
    address?: string | null;
    prefferedContact: string;
  };
};

export type PublicProfileType = {
  profileCard: {
    name: string;
    rating: number;
    liveIn?: string | null;
    bio?: string | null;
    memberSince: Date;
  };
  bookListed?: number;
  books: any;
  exchanges: number;
  contactInfo: {
    phone?: string | null;
    address?: string | null;
    prefferedContact: string;
  };
  totalReviews?: number;
  reviews?: publicReviewType[] | null;
};

type publicReviewType = {
  id: number;
  rating: number;
  description: string | null;
  reviewBy: string | null;
};
