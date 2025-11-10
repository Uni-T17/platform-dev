"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Books } from "@/lib/model/dummy-data/book-props";
import BookCard from "@/components/custom/book-card";
import { UserProfileDetails } from "@/lib/output/response";
import { CalendarIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
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
  const router = useRouter();
  const ownerBooks = Books.filter((b) => b.ownerId === id);

  // Mock review data
  const reviews = [
    {
      id: 1,
      reviewerName: "Emily Chen",
      rating: 5,
      timeAgo: "1 week ago",
      comment:
        "Technical books were in excellent condition. Very knowledgeable about the subjects.",
    },
    {
      id: 2,
      reviewerName: "Alex Rivera",
      rating: 4,
      timeAgo: "3 weeks ago",
      comment:
        "Good experience overall. Books arrived on time and as described.",
    },
    {
      id: 3,
      reviewerName: "Lisa Wang",
      rating: 5,
      timeAgo: "1 month ago",
      comment:
        "Professional and responsive. Great selection of programming books.",
    },
  ];

  const mockUserData: UserProfileDetails = {
    profileCard: {
      name: "Alice Johnson",
      email: "alice@example.com",
      rating: "4.8",
      memberSince: "2022",
      bio: "Love exchanging books and learning.",
      liveIn: "New York",
    },
    creditsBalance: 0,
    bookListed: 0,
    exchanges: 0,
    contactInfo: {
      phone: "",
      address: "",
      prefferedContact: "",
    },
  };
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
      <TopCard data={mockUserData} />
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Average Rating */}
        <Card className="border border-gray-200 gap-0 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-yellow-500 text-lg mr-2">
              <StarFilledIcon />
            </span>
            <span className="text-xl font-bold text-gray-900">
              {mockUserData.profileCard.rating}
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
            <span className="text-xl font-bold text-gray-900">15</span>
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
        <h1 className="text-xl font-semibold mb-6">
          Books Posted ({ownerBooks.length})
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownerBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
      {/* Recent Reviews Section */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">
          Recent Reviews ({reviews.length})
        </h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
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
