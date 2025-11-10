"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { makeRequestSchema, RequestFormData } from "@/lib/model/request-schema";
import type { Book } from "@/lib/model/book";
import ContactInfoCard from "./contact-info-form";

type Props = {
  book: Book;
  myCredits: number; // current user credits
  defaults?: Partial<RequestFormData>; // prefill contact info from profile
  onCancel?: () => void;
  onSubmitted?: (data: RequestFormData) => void;
};

export default function RequestFormZod({
  book,
  myCredits,
  defaults,
  onCancel,
  onSubmitted,
}: Props) {
  console.log("Book object:", book);
  console.log("Book credits:", book.credits);

  const schema = React.useMemo(
    () => makeRequestSchema({ maxCredits: myCredits }),
    [myCredits]
  );
  const bookCredits = book.credits || 1;

  const form = useForm<RequestFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      offerCredits: bookCredits,
      phone: defaults?.phone ?? "+1-555-0123",
      email: defaults?.email ?? "alice@example.com",
      address: defaults?.address ?? "123 Main St, New York, NY 10001",
      preferredContact: defaults?.preferredContact ?? "Email",
      message: "",
    },
    mode: "onTouched",
  });

  const submit = (data: RequestFormData) => {
    console.log("REQUEST SUBMIT", { bookId: book.id, ...data });
    onSubmitted?.(data);
  };

  return (
    <div className="w-full max-w-xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="space-y-6"
          noValidate
        >
          {/* Offer Credits */}
          <FormField
            control={form.control}
            name="offerCredits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Offer Credits <span className="text-rose-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={`${book.credits}`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    {...field}
                    value={field.value ?? bookCredits}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="h-11 bg-green-50"
                  />
                </FormControl>
                <FormDescription>
                  <span className="text-slate-500">Listed price :</span>{" "}
                  <span className="font-medium">{bookCredits} credits</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Info Card*/}
          <ContactInfoCard />

          {/* Optional message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message to Owner (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add a message to the book owner…"
                    className="resize-none bg-green-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onCancel?.();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0F8B8D] hover:bg-[#0d7476]">
              Send Request
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
