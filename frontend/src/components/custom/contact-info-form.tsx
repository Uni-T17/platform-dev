"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./form-item";
import CustomSelect from "./form-select";
import { PersonIcon, StarIcon } from "@radix-ui/react-icons";
import { MapPinIcon, PencilIcon, PhoneIcon } from "lucide-react";

const schema = z.object({
  phone: z.string().min(7, "Invalid phone number"),
  address: z.string().min(5, "Invalid address"),
  preferred: z.enum(["email", "phone", "sms"]),
});

type ContactForm = z.infer<typeof schema>;

const options = [
  { id: "email", value: "Email" },
  { id: "phone", value: "Phone" },
];

export default function ContactInfoCard() {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "+1-555-0123",
      address: "123 Main St, New York, NY 10001",
      preferred: "email",
    },
  });

  const onSubmit = (data: ContactForm) => {
    console.log("save", data);
    setIsEditing(false);
  };

  if (!isEditing) {
    const { phone, address, preferred } = form.getValues();
    return (
      <div className="">
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-sm font-medium flex items-center gap-2">
            {" "}
            <PersonIcon />
            Contact Information <span className="text-rose-600">*</span>
          </h2>
          <Button
            className="text-sm font-medium border-none hover:border-gray-500"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon />
            Edit Contact Info
          </Button>
        </div>

        <Card className="p-4 text-sm font-medium max-w-3xl justify-center mx-auto ">
          <div className="space-y-3 text-slate-800 ">
            <div className="flex items-center gap-3   ">
              <span className="flex items-center gap-2">
                <PhoneIcon size={16} strokeWidth={1.75} /> {phone}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <MapPinIcon size={16} strokeWidth={1.75} /> {address}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <StarIcon /> Preferred: {preferred}
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-4 text-sm font-medium max-w-3xl justify-center mx-auto  ">
      <h2 className="text-medium font-medium flex items-center gap-2">
        <PersonIcon /> Contact Information
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
          <CustomInput<ContactForm>
            control={form.control}
            path="phone"
            label="Phone Number"
            placeholder="+1-555-0123"
          />
          <CustomInput<ContactForm>
            control={form.control}
            path="address"
            label="Address"
            placeholder="123 Main St, New York, NY 10001"
          />
          <CustomSelect<ContactForm>
            control={form.control}
            path="preferred"
            label="Preferred Contact Method"
            placeholder="Select one"
            options={options}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="min-w-40">
              Save Contact Info
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
