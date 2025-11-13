"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Books } from "@/lib/model/dummy-data/book-props";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Wallet } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useAuthStore } from "@/lib/model/auth-store";
import ExchangedInformation from "@/components/custom/exchanged-information";
import RequestForm from "@/components/custom/request-form";
import { useEffect, useState } from "react";
import { request } from "@/lib/base-client";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuth, openAuth } = useAuthStore();

  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        // backend route: api/v1/user/books/get-book-details/:bookId
        const res = await request(`api/v1/user/books/get-book-details/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        // controller returns { message, resData: { book, bookOwner } }
        const b = json.resData?.book ?? json.data?.book ?? json.book ?? null;
        if (!b) {
          setError("Book not found");
          setBook(null);
        } else {
          setBook(b);
        }
      } catch (e: any) {
        console.error("Failed to load book details", e);
        setError(e?.message ?? "Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading book...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!book) return <p className="text-center mt-10">Book not found</p>;

  // replace with real credits when wired
  const myCredits = 15;

  return (
    <div className="mx-24">
      <div>
        <Button
          onClick={() => router.back()}
          className=" mb-4 flex items-center gap-2 bg-[#fafafa] hover:bg-[#F2B77E] text-black font-semibold shadow-sm border border-gray-200 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Button>
      </div>

      <div className="grid place-items-center">
        <div className="grid md:grid-cols-2 gap-2 lg:gap-4">
          {/* LEFT */}
          <div className="w-sm  flex justify-center">
            <AspectRatio
              ratio={4 / 5}
              className="w-full rounded-2xl overflow-hidden"
            >
              <img
                src={book.image?.startsWith("http") ? book.image : `/${book.image}`}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>

          {/* RIGHT */}
          <div className=" w-full  md:w-1/2 space-y-5">
            <div>
              <h1 className="text-md md:text-md font-bold text-gray-900">
                {book.title}
              </h1>
              <p className="text-md text-gray-600">by {book.author}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                {book.condition}
              </Badge>
              <Badge className="bg-gray-100 text-gray-700">
                {book.category}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800">
                {book.price ?? book.credits ?? "-"} credits
              </Badge>
            </div>

            {!!book.rating && (
              <div className="flex flex-wrap items-center gap-2 text-slate-700 text-[15px]">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                <span className="font-semibold">{book.rating.toFixed(1)}</span>
                <span className="text-gray-600">• Listed by</span>
                <Link
                  href={`/profile/${book.ownerId}`}
                  className="text-teal-700 font-medium hover:underline"
                >
                  {book.ownerName}
                </Link>
              </div>
            )}

            <div>
              <h2 className="font-semibold text-md text-gray-900">
                Description
              </h2>
              <p className="text-gray-700 text-md">{book.description}</p>
            </div>

            <div className="space-y-3">
              <ExchangedInformation showRequestButton={false} />

              {/* Request button / form */}
              {!showRequestForm ? (
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      if (!isAuth) {
                        openAuth();
                        return;
                      }
                      setShowRequestForm(true);
                    }}
                    className="bg-teal-600 text-white"
                  >
                    Request this book
                  </Button>
                </div>
              ) : (
                <div className="mt-4">
                  {submitError && (
                    <div className="text-red-600 mb-2">{submitError}</div>
                  )}
                  {submitSuccess && (
                    <div className="text-green-600 mb-2">{submitSuccess}</div>
                  )}

                  <RequestForm
                    book={{
                      id: book.id.toString(),
                      image: book.image,
                      title: book.title,
                      author: book.author,
                      credits: book.price ?? 1,
                      description: book.description ?? "",
                      condition: book.condition,
                      general: book.general ?? "",
                      rating: book.rating ?? 1,
                      category: book.category,
                      status: book.avaiableStatus ?? true,
                      ownerId: book.ownerId?.toString() ?? "0",
                      ownerName: book.ownerName ?? "",
                    }}
                    myCredits={myCredits}
                    onCancel={() => {
                      setShowRequestForm(false);
                    }}
                    onSubmitted={async (data) => {
                      setSubmitting(true);
                      setSubmitError(null);
                      setSubmitSuccess(null);
                      try {
                        const payload: any = {
                          bookId: Number(book.id),
                          requestedPrice: Number(data.offerCredits),
                          message: data.message ?? null,
                        };

                        // Attach contact info if provided in the form so the backend
                        // can use it when buyer profile contact information is missing.
                        if (data.phone) payload.phone = data.phone;
                        if (data.address) payload.address = data.address;
                        if (data.email) payload.email = data.email;
                        if (data.preferredContact) payload.preferredContact = data.preferredContact;

                        await request("api/v1/user/books/request-book", {
                          method: "POST",
                          credentials: "include",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        });

                        setSubmitSuccess("Request sent successfully.");
                        setShowRequestForm(false);
                      } catch (e: any) {
                        console.error("Failed to send request", e);
                        // Normalize error to a string so we don't try to render objects
                        let message = "Failed to send request";
                        try {
                          if (!e) message = "Failed to send request";
                          else if (typeof e === "string") message = e;
                          else if (e.message) {
                            if (Array.isArray(e.message)) message = e.message.join(", ");
                            else message = String(e.message);
                          } else if (Array.isArray(e)) message = e.join(", ");
                          else message = JSON.stringify(e);
                        } catch (_) {
                          message = "Failed to send request";
                        }
                        setSubmitError(message);
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
