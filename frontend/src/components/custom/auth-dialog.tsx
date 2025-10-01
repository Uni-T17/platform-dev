"use client"

import { primary_color } from "@/app/color";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Form, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { OnSignIn, OnSignUp, SignInForm, SignInSchema, SignUpForm, SignUpSchema } from "@/lib/model/auth-schema";
import CustomInput from "./form-item";

type AuthDialogProsps = {
    open : boolean
    onOpenChange : (open : boolean) => void;
    showTrigger ?: boolean
}

export default function AuthDialog({open, onOpenChange, showTrigger = true} : AuthDialogProsps) {

    const signInForm = useForm<SignInForm>({
        resolver : zodResolver(SignInSchema)
    })

    const signUpForm = useForm<SignUpForm>({
        resolver : zodResolver(SignUpSchema)
    })

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button style={{background : primary_color}} className="me-10 " >
                        <span className="font-semibold">Sign In</span>
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent >
                
                    <DialogHeader className="items-center">
                        <DialogTitle>Welcome to BookEx</DialogTitle>
                    </DialogHeader>

                    
                        <Tabs defaultValue="signin">
                            <TabsList className="w-full rounded-md">
                                <TabsTrigger value="signin">Sign In</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="signin">
                                <Form {...signInForm}>
                                    <form onSubmit={signInForm.handleSubmit(OnSignIn)}>
                                        <CustomInput 
                                            control={signInForm.control}
                                            path="email"
                                            label="Email"
                                            placeholder="Enter your email"
                                            className="mb-4"
                                         />

                                         <CustomInput 
                                            control={signInForm.control}
                                            path="password"
                                            label="Password"
                                            placeholder="Enter your password"
                                            className="mb-4"
                                         />

                                        <Button className="w-full" style={{backgroundColor : primary_color}} type="submit">Sign In</Button>
                                    </form>
                                </Form>
                            </TabsContent>

                            <TabsContent value="signup">
                                <Form {...signUpForm}>
                                    <form onSubmit={signUpForm.handleSubmit(OnSignUp)}>
                                        <CustomInput 
                                            control={signUpForm.control}
                                            path="name"
                                            label="Full Name"
                                            placeholder="Enter your full name"
                                            className="mb-4"
                                         />

                                         <CustomInput 
                                            control={signUpForm.control}
                                            path="email"
                                            label="Email"
                                            placeholder="Enter your email"
                                            className="mb-4"
                                         />

                                         <CustomInput 
                                            control={signUpForm.control}
                                            path="password"
                                            label="Password"
                                            placeholder="Create a password"
                                            className="mb-4"
                                         />

                                         <CustomInput 
                                            control={signUpForm.control}
                                            path="confirmPassword"
                                            label="Confirm Password"
                                            placeholder="Confirm your password"
                                            className="mb-4"
                                         />

                                        <Button className="w-full" style={{backgroundColor : primary_color}} type="submit">Create Account</Button>
                                    </form>
                                </Form>
                            </TabsContent>
                        </Tabs>
                    
            </DialogContent>
        </Dialog>
    )
}