export type Book = {
  id: string;
  image: string;
  title: string;
  author: string;
  credits: number;
  description: string;
  condition: Condition;
  general: string;
  rating: number;
  category: Category;
  status: boolean;
  ownerId: string;
  ownerName: string;
};


export enum Category {
  None = "NONE",
  Other = "OTHER",
  NonFiction = "NONFICTION",
  TextBook = "TEXTBOOK",
  Biography = "BIOGRAPHY",
  Science = "SCIENCE",
  History = "HISTORY",
  Romance = "ROMANCE",
  Mystery = "MYSTERY",
  Fantasy = "FANTASY",
  SelfHelp = "SELFHELP",
  Business = "BUSINESS",
  Art = "ART",
  Cooking = "COOKING",
  Travel = "TRAVEL",
  Children = "CHILDREN",
  Young = "YOUNG",
  Adult = "ADULT",
  Philosophy = "PHILOSOPHY",
  Religion = "RELIGION",
  Health = "HEALTH",
  Education = "EDUCATION",
}

export enum Condition {
  LikeNew = "LIKENEW",
  VeryGood = "VERYGOOD",
  Good = "GOOD",
  Fair = "FAIR",
  Poor = "POOR",
}

