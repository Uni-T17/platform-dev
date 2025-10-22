"use client"

import { Card, CardContent, CardTitle } from "../ui/card";
import { BookDetailsSchema, BookDetailsType } from "@/lib/model/book-detail-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "./form-item";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import CustomSelect from "./form-select";
import { categoryOptions, conditionOptions } from "@/lib/model/option";
import ConditonCard from "./conditon-card";
import CustomTextArea from "./text-area";
import { Button } from "../ui/button";
import ImageSaving from "./image-saving";
import { primary_color } from "@/app/color";

export default function BookDetails() {

    const form = useForm<BookDetailsType>({
        resolver : zodResolver(BookDetailsSchema)
        
    })

    const onCancel =  () => { 
        form.reset()
    }

    const onSave = () => {
        console.log(form.getValues())
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
                            path="credit"
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
                            path="photo"
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
