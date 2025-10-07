import BookCard from "@/components/custom/book-card";
import { Category, Condition } from "@/lib/model/book";

export default function Home() {
  return (
    <div className="p-4">
      <BookCard
        book={{
          image:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200",
          name: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          credits: 3,
          description:
            "A novel set in the Jazz Age exploring wealth and illusion.",
          condition: Condition.Good,
          general: "Classic literature about love and tragedy.",
          rating: 4.5,
          category: Category.Fiction.toString(),
          reviewer: "Alice Johnson",
        }}
      />
    </div>
  );
}
