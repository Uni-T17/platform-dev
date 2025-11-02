export const CategoryValue = [
  "NONE",
  "OTHER",
  "NONFICTON",
  "TEXTBOOK",
  "BIOGRAPHY",
  "SCIENCE",
  "HISTORY",
  "ROMANCE",
  "MYSTERY",
  "FANTASY",
  "SELFHELP",
  "BUSINESS",
  "ART",
  "COOKING",
  "TRAVEL",
  "CHILDREN",
  "YOUNG",
  "ADULT",
  "PHYLOSOPHY",
  "RELIGION",
  "HEALTH",
  "EDUCATION",
];

export const ConditionValue = ["LIKENEW", "VERYGOOD", "GOOD", "FAIR", "POOR"];

export enum Category {
  NONE = "NONE",
  OTHER = "OTHER",
  NONFICTON = "NONFICTON",
  TEXTBOOK = "TEXTBOOK",
  BIOGRAPHY = "BIOGRAPHY",
  SCIENCE = "SCIENCE",
  HISTORY = "HISTORY",
  ROMANCE = "ROMANCE",
  MYSTERY = "MYSTERY",
  FANTASY = "FANTASY",
  SELFHELP = "SELFHELP",
  BUSINESS = "BUSINESS",
  ART = "ART",
  COOKING = "COOKING",
  TRAVEL = "TRAVEL",
  CHILDREN = "CHILDREN",
  YOUNG = "YOUNG",
  ADULT = "ADULT",
  PHYLOSOPHY = "PHYLOSOPHY",
  RELIGION = "RELIGION",
  HEALTH = "HEALTH",
  EDUCATION = "EDUCATION",
}

export enum Condition {
  LIKENEW = "LIKENEW",
  VERYGOOD = "VERYGOOD",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
}

export type CreateBookType = {
  title: string;
  author: string;
  isbn?: string | null;
  category: Category;
  condition: Condition;
  description?: string | null;
  image: string;
  price: number;
  ownerId: number;
};

export type BookDetailsResponseType = {
  book: BookResponseType;
  bookOwner: {
    ownerId: number;
    ownerName: string;
    ownerRatings: number;
    isOwner: boolean;
  };
};

export type BookResponseType = {
  id: number;
  title: string;
  author: string;
  isbn?: string | null;
  category: Category;
  condition: Condition;
  description?: string | null;
  image: string;
  price: number;
  avaiableStatus: boolean;
  createdAt?: String;
};
