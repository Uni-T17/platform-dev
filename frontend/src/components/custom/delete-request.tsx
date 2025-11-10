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
import { Trash2 } from "lucide-react";

function DeleteRequest() {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    console.log("Request deleted");
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 text-xs border-red-200 hover:bg-red-50 hover:border-red-300 px-3 py-1"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Delete Request
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base mt-2">
            Are you sure you want to delete this request? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleCancel} className="px-6">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteRequest;
