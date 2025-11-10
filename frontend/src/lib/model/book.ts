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
  Other = "OTHER",
  Fiction = "FICTION",
  NonFiction = "NON_FICTION",
  TextBook = "TEXT_BOOK",
  Biography = "BIOGRAPHY",
  Science = "SCIENCE",
  History = "HISTORY",
  Romance = "ROMANCE",
  Mystery = "MYSTERY",
  Fantasy = "FANTASY",
  SelfHelp = "SELF_HELP",
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
  LikeNew = "LIKE_NEW",
  VeryGood = "VERY_GOOD",
  Good = "GOOD",
  Fair = "FAIR",
  Poor = "POOR",
}

