import { Book, Category, Condition } from "../book";

export const Books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    credits: 3,
    description: "Classic American literature in excellent condition.",
    condition: Condition.Good,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200",
    category: Category.Fiction,
    general: "A classic novel set in the Jazz Age.",
    ownerName: "Alice Johnson",
    ownerId: "42",
    status: true,
  },
];
