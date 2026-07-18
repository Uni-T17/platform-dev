import WelcomeBox from "@/components/custom/welcome-box";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { primary_color } from "@/app/color";
import { BookOpen, Repeat, Coins } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    title: "List your books",
    body: "Add books you've finished reading and set them free into the community.",
  },
  {
    icon: Coins,
    title: "Earn credits",
    body: "Every book you share earns credits you can spend on your next read.",
  },
  {
    icon: Repeat,
    title: "Exchange & discover",
    body: "Spend credits to request books from other readers and grow your shelf.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <WelcomeBox />

      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold">How BookEx works</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-600">
          A simple, credit-based way to keep good books moving between readers.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#F1FBF9" }}
                >
                  <Icon color={primary_color} />
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild style={{ backgroundColor: primary_color }}>
            <Link href="/books">Browse books</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/books/new">List a book</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
