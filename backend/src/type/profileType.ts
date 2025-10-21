export type CurrentUserProfileType = {
  profileCard: {
    name: string;
    email: string;
    rating: number;
    memberSince: Date;
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
