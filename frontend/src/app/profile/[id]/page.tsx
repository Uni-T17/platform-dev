"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Books } from "@/lib/model/dummy-data/book-props";
import BookCard from "@/components/custom/book-card";
import { UserProfileDetails, ApiBook } from "@/lib/output/response";
import { CalendarIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { request } from "@/lib/base-client";
import {
  ArrowLeft,
  Book,
  BookOpenIcon,
  MapPinCheckIcon,
  MapPinIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicProfilePage() {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id ?? "";
  const router = useRouter();
  const [ownerBooks, setOwnerBooks] = useState<ApiBook[]>([]);
  const [data, setData] = useState<{
    profileCard: UserProfileDetails["profileCard"];
    books: ApiBook[];
    reviews?: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // load public profile
  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await request(`api/v1/user/profile/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        // backend returns { message, data: { profileCard, books, ... } }
        const d = json.data;
        setData(d);
        setOwnerBooks(d.books ?? []);
      } catch (e: any) {
        console.error("Failed to load public profile", e);
        setError(e?.message ?? "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);
  return (
    <div className="mx-28 max-w-7xl px-6 py-10">
      <div>
        <Button
          onClick={() => router.back()}
          className=" mb-4 flex items-center gap-2 bg-[#fafafa] hover:bg-[#F2B77E] text-black font-semibold shadow-sm border-none rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {loading ? (
        <div>Loading profile…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : data ? (
        <>
          <TopCard data={{ profileCard: data.profileCard, creditsBalance: 0, bookListed: data.books?.length ?? 0, exchanges: 0 }} />
        </>
      ) : (
        <div className="text-gray-500">Profile not found.</div>
      )}
  {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Average Rating */}
          <Card className="border border-gray-200 gap-0 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-yellow-500 text-lg mr-2">
              <StarFilledIcon />
            </span>
              <span className="text-xl font-bold text-gray-900">
                {data?.profileCard.rating ?? "-"}
              </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Average Rating</p>
        </Card>

        {/* Exchanges */}
        <Card className="border border-gray-200 gap-0 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-lg mr-2">
              <RefreshCcwIcon />
            </span>
            <span className="text-xl font-bold text-gray-900">{data?.profileCard ? (data?.reviews?.length ?? "-") : "-"}</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Exchanges</p>
        </Card>

        {/* Books Listed */}
        <Card className="border border-gray-200 gap-0 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-lg mr-2">
              <BookOpenIcon />
            </span>
            <span className="text-xl font-bold text-gray-900">
              {ownerBooks.length}
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Books Listed</p>
        </Card>
      </div>
      <div className="border border-gray-200 mb-8 rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-6">Books Posted ({ownerBooks.length})</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerBooks.map((book: ApiBook) => (
            <BookCard
              key={book.id}
              book={{
                id: book.id.toString(),
                image: book.image?.startsWith("http") ? book.image : `/${book.image}`,
                title: book.title,
                author: book.author,
                credits: Math.max(1, Math.round(book.price ?? 1)),
                description: (book as any).description ?? "",
                condition: book.condition as any,
                rating: 1,
                category: book.category as any,
                ownerName: data?.profileCard.name ?? "",
                ownerId: userId ?? "0",
                general: "",
                status: true,
              }}
            />
          ))}
        </div>
      </div>
      {/* Recent Reviews Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Recent Reviews ({data?.reviews?.length ?? 0})</h2>
        <div className="space-y-6">
          {(data?.reviews ?? []).map((review: any) => (
            <ReviewCard
              key={review.id}
              review={{
                reviewerName: review.reviewBy ?? "Unknown",
                rating: review.rating ?? 0,
                timeAgo: review.createdAt ?? "",
                comment: review.description ?? "",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Review Card Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ReviewCard({ review }: { review: any }) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="text-yellow-500">
        {index < rating ? <StarFilledIcon /> : "☆"}
      </span>
    ));
  };

  return (
    <div className="border-l-4 border-gray-200 pl-4">
      <div className="flex items-center text-md gap-3 mb-2">
        <h3 className="font-semibold  text-gray-900">{review.reviewerName}</h3>
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
        </div>
        <span className="text-gray-500 text-sm">{review.timeAgo}</span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
}

function TopCard({ data }: { data: UserProfileDetails }) {
  return (
    <Card className=" mb-8 border-gray-200  rounded-2xl p-4">
      <div className="flex items-start gap-6 p-0">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {data.profileCard.name.charAt(0)}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          {/* Name and Rating */}
          <div className="flex items-center gap-3 mb-0">
            <h1 className="text-lg font-medium text-gray-900">
              {data.profileCard.name}
            </h1>
            <div className="flex items-center gap-2 py-1 rounded-lg">
              <span className="text-yellow-500 text-lg">
                <StarFilledIcon />
              </span>
              <span className="font-semibold text-gray-800">
                {data.profileCard.rating}
              </span>
            </div>
          </div>

          {/* Location and Join Date */}
          <div className="flex text-sm font-medium items-center gap-6 mb-2 text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">
                <MapPinIcon />
              </span>
              <span>{data.profileCard.liveIn}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">
                <CalendarIcon />
              </span>
              <span>Joined {data.profileCard.memberSince}</span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-500 text-medium font-medium leading-relaxed max-w-4xl">
            {data.profileCard.bio}
          </p>
        </div>
      </div>
    </Card>
  );
}
