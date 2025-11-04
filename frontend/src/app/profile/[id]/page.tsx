"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function PublicProfilePage() {
  const { userId } = useParams(); // e.g. "42" from /profile/42

  return (
    <section className="mb-4 max-w-5xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">User Profile</h1>
    </section>
  );
}
