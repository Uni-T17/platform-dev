"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Eye, Clock, Check, X } from "lucide-react";
import { Badge } from "../ui/badge";

interface RequestDetail {
  id: string;
  book: {
    title: string;
    author: string;
  };
  requester: {
    name: string;
    email: string;
    phone: string;
  };
  status: "pending" | "accepted" | "declined";
  creditsOffered: number;
  requestDate: string;
  message: string;
}

function ViewDetail() {
  const [open, setOpen] = useState(false);

  // Mock data
  const mockRequest: RequestDetail = {
    id: "req-001",
    book: {
      title: "1984",
      author: "George Orwell",
    },
    requester: {
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "+1234567890",
    },
    status: "pending",
    creditsOffered: 3,
    requestDate: "2024-01-26",
    message:
      "Interested in this dystopian classic. I've been wanting to read this for a long time!",
  };

  const handleAccept = () => {
    console.log("Request accepted:", mockRequest.id);
    setOpen(false);
  };

  const handleDecline = () => {
    console.log("Request declined:", mockRequest.id);
    setOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-xs"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="flex items-center gap-1 bg-green-100 text-green-800 text-xs">
            <Check className="h-3 w-3" />
            Accepted
          </Badge>
        );
      case "declined":
        return (
          <Badge
            variant="destructive"
            className="flex items-center gap-1 text-xs"
          >
            <X className="h-3 w-3" />
            Declined
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Request Details
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-sm mt-1">
            Review the request information and contact details before accepting
            or declining.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Book Information */}
          <div className="border border-gray-200 bg-green-50 p-3 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {mockRequest.book.title}
            </h3>
            <p className="text-gray-600 mb-2 text-sm">
              by {mockRequest.book.author}
            </p>

            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(mockRequest.status)}
              <span className="text-gray-500 text-xs">
                Requested on {mockRequest.requestDate}
              </span>
            </div>
          </div>

          {/* Request Details */}
          <div className="border border-gray-200 bg-green-50 p-3 rounded-lg space-y-2">
            <div>
              <span className="font-medium text-gray-900 text-sm">
                Requester:{" "}
              </span>
              <span className="text-gray-700 text-sm">
                {mockRequest.requester.name}
              </span>
            </div>

            <div>
              <span className="font-medium text-gray-900 text-sm">
                Contact:{" "}
              </span>
              <span className="text-gray-700 text-sm">
                {mockRequest.requester.email}, {mockRequest.requester.phone}
              </span>
            </div>

            <div>
              <span className="font-medium text-gray-900 text-sm">
                Credits Offered:{" "}
              </span>
              <span className="text-green-600 font-medium text-sm">
                +{mockRequest.creditsOffered} credits
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="border border-gray-200 bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1 text-sm">
              Message from requester:
            </h4>
            <p className="text-gray-700 italic bg-white p-2 rounded-lg border border-gray-100 text-sm">
              &quot;{mockRequest.message}&quot;
            </p>
          </div>

          {/* Action Buttons - Only show if status is pending */}
          {mockRequest.status === "pending" && (
            <div className="flex gap-2 pt-3">
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm"
              >
                <Check className="h-3 w-3 mr-1" />
                Accept Request
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="flex-1 text-sm"
              >
                <X className="h-3 w-3 mr-1" />
                Decline
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDetail;
