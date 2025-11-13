"use client"

import { BookDetailsSchema, BookDetailsType } from "@/lib/model/book-detail-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomSelect from "./form-select";
import { categoryOptions, conditionOptions } from "@/lib/model/option";
import ConditonCard from "./conditon-card";

import { request } from "@/lib/base-client"
import { POST_CONFIG } from "@/lib/rest-utils";
import ImageSaving from "./image-saving";
import { Button } from "../ui/button";
import { primary_color } from "@/app/color";
import { Card, CardContent } from "../ui/card";
import CustomInput from "./form-item";
import CustomTextArea from "./text-area";
import { Form } from "../ui/form";
import { useRouter } from "next/navigation";

export default function BookDetails() {

    const router = useRouter();
    
    const form = useForm<BookDetailsType>({
        resolver : zodResolver(BookDetailsSchema)
        
    })

    const onCancel =  () => { 
        form.reset()
    }

    const onSave = async () => {
        console.log(form.getValues())

        const values = form.getValues();

        const fd = new FormData();
        fd.append("title", values.title);
        fd.append("author", values.author);
        fd.append("isbn", values.isbn);
        // Normalize category to backend-expected canonical values
        const categoryMap: Record<string, string> = {
            NONFICTION: "NONFICTON",
            PHILOSOPHY: "PHYLOSOPHY",
        };
        const categoryInput = (values.category || "").toString().trim().toUpperCase();
        const categoryToSend = categoryMap[categoryInput] || categoryInput;
        console.log("Sending category:", categoryInput, "->", categoryToSend);
        fd.append("category", categoryToSend);
        fd.append("condition", values.condition);
        fd.append("description", values.description);
        fd.append("price", String(values.price));
        fd.append("avaiableStatus", "true");
        
        const bookVal = values.book as unknown as File | File[] | null | undefined;
        if (bookVal instanceof File) {
            fd.append("book", bookVal);
        } else if (Array.isArray(bookVal) && bookVal.length > 0) {
            fd.append("book", bookVal[0]);
        }


        const response = await request("api/v1/owner/books/create-new-book", {
                method : "POST",
                credentials : "include",
                body : fd
        }) 

            if(response.ok) {
                router.push("/profile")
            }
            console.log(await response.json())
        }
    

    return(
        <Card className="w-2/4">
            <CardContent>
                <h1 className="font-bold">Book Details</h1>
                <span>Fill out the information below to list your book for exchange.</span>

                <Form {...form}>
                    <form >
                        <div className="pt-7 flex justify-between gap-2">
                            <CustomInput 
                                control={form.control}
                                path="title"
                                label="Book Title *"
                                placeholder="Enter book title"
                                className="w-full"
                            />

                            <CustomInput 
                                control={form.control}
                                path="author"
                                label="Author *"
                                placeholder="Enter author name"
                                className="w-full"
                            />
                        </div>
                        <div className="pt-4 flex justify-between gap-2">
                            <CustomInput 
                                control={form.control}
                                path="isbn"
                                label="ISBN(Optional)"
                                placeholder="Enter ISBN"
                                className="w-full"
                            />

                            <CustomSelect
                                control={form.control}
                                path="category"
                                label="Category *"
                                options={categoryOptions}
                                placeholder="Select Category"
                                className="w-full"
                            />
                        </div>

                        <CustomInput 
                            control={form.control}
                            path="price"
                            label="Credit"
                            placeholder="Enter Selling Credit"
                            type="number"
                            className="mt-3 w-1/2 pb-8"
                        />

                        <span className="font-semibold">Conditions *</span>

                        <ConditonCard 
                            control={form.control}
                            path="condition"
                            options={conditionOptions}
                            className="flex justify-between w-1/3"
                        />

                        <CustomTextArea 
                            control={form.control}
                            path="description"
                            label="Description"
                            placeholder="Describe the book's condition, any highlighting, missing pages, etc."
                            className="mt-8"
                        />

                        <ImageSaving 
                            control={form.control}
                            path="book"
                            onSave={(file) => {
                                console.log("Saving file:", file.name)
                            }}
                        />


                        <div className="flex justify-between mt-4 gap-2">
                            <Button style={{backgroundColor : "white"}}  className="w-1/2 border-1">
                                <span className="text-black">Cancel</span>
                            </Button>

                            <Button style={{backgroundColor : primary_color}} onClick={form.handleSubmit(onSave)} className="w-1/2 border-1">
                                <span>List Book</span>
                            </Button>
                        </div>
                    
                    </form>
                </Form>
            </CardContent>
    
        </Card>
    )
}
