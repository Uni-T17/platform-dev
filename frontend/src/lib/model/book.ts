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
  Other = "Other",
  Fiction = "Fiction",
  NonFiction = "NonFiction",
  TextBook = "TextBook",
  Biography = "Biography",
  Science = "Science",
  History = "History",
  Romance = "Romance",
  Mystery = "Mystery",
  Fantasy = "Fantasy",
  SelfHelp = "SelfHelp",
  Business = "Business",
  Art = "Art",
  Cooking = "Cooking",
  Travel = "Travel",
  Children = "Children",
  Young = "Young",
  Adult = "Adult",
  Philosophy = "Philosophy",
  Religion = "Religion",
  Health = "Health",
  Education = "Education",
}

export enum Condition {
  LikeNew = "LikeNew",
  VeryGood = "VeryGood",
  Good = "Good",
  Fair = "Fair",
  Poor = "Poor",
}
