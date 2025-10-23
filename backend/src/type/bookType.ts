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

enum Category {
  NONE,
  OTHER,
  NONFICTON,
  TEXTBOOK,
  BIOGRAPHY,
  SCIENCE,
  HISTORY,
  ROMANCE,
  MYSTERY,
  FANTASY,
  SELFHELP,
  BUSINESS,
  ART,
  COOKING,
  TRAVEL,
  CHILDREN,
  YOUNG,
  ADULT,
  PHYLOSOPHY,
  RELIGION,
  HEALTH,
  EDUCATION,
}

enum Condition {
  LIKENEW,
  VERYGOOD,
  GOOD,
  FAIR,
  POOR,
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
