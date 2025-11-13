export type OtpRespone = {
  message: string;
  email: string;
  rememberToken: string;
  expiredAt: string;
};

export type VerifyRespone = {
  message: string;
  verifiedToken: string;
  email: string;
};

export type ConfirmPasswordRespone = {
  message: string;
  newUserId: number;
};

export type UserProfileRespone = {
  message: string;
  data: {
    userId : number
    profileCard: ProfileCard;
    userProfileDetails: UserProfileDetails;
  }
};

export type UserProfileDetailsWithId = UserProfileDetails & { userId: number };

export type UserProfileDetails = {
  profileCard: ProfileCard;
  creditsBalance: number;
  bookListed: number;
  exchanges: number;
};

export type ProfileCard = {
  name: string;
  email: string;
  rating: number;
  memberSince: string;
  bio: string | null;     
  liveIn: string | null;
};

export type ContactInfo = {
    phone : string | null
    address : string | null
    prefferedContact : string
}

export type CreditResponse = {
    message : string
    data : {
        balance : number
        totalEarned : number
        totalSpent : number
        exchanges : number
        rating : number
    }
}


export type ApiBook = {
  id: number
  title: string
  author: string
  category: string          
  condition: string         
  image: string             
  price: number             
  avaiableStatus: boolean
  createdAt: string
}

export type ApiResponse = {
  message: string
  isAunthenticated: boolean
  hasNextPage: boolean
  newCursor: number | null
  booksList: ApiBook[]
}