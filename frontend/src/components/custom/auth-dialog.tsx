"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Form, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import {SignInForm, SignInSchema, SignUpForm, SignUpSchema } from "@/lib/model/auth-schema";
import CustomInput from "./form-item";
import { useAuthStore } from "@/lib/model/auth-store";
import { BookOpen, LucideProps } from "lucide-react";
import { input_bg, primary_color } from "@/app/color";

type AuthDialogProsps = {
    open : boolean
    onOpenChange : (open : boolean) => void;
    showTrigger ?: boolean
    icon ?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
}

export default function AuthDialog({open, onOpenChange, showTrigger = true, icon} : AuthDialogProsps) {
    const Icon = icon; 

    const signInForm = useForm<SignInForm>({
        resolver : zodResolver(SignInSchema)
    })

    const signUpForm = useForm<SignUpForm>({
        resolver : zodResolver(SignUpSchema)
    })

    const OnSignIn = (form : SignInForm) => {
        useAuthStore.getState().setIsAuth(true)
        console.log(form)
    }

    const OnSignUp = (form : SignUpForm) => {
        useAuthStore.getState().setIsAuth(true)
        console.log(form)
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button style={{background : primary_color}} className={`me-10 ${Icon ? "flex justify-between items-center gap-2" : ""}`} >
                        {Icon && <Icon /> }
                        <span className="text-sm font-semibold">Sign In</span>
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="w-[450px]">
                
                    <DialogHeader className="items-center">
                        <DialogTitle className="flex gap-1 items-center">
                            <BookOpen color={primary_color}/> Welcome to BookEx
                        </DialogTitle>
                    </DialogHeader>

                    
                        <Tabs defaultValue="signin">
                            <TabsList style={{backgroundColor : input_bg}} className="w-full rounded-sm">
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
                                            type="password"
                                            label="Password"
                                            placeholder="Enter your password"
                                            className={`mb-4`}
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
                                            type="password"
                                            label="Password"
                                            placeholder="Create a password"
                                            className="mb-4"
                                         />

                                         <CustomInput 
                                            control={signUpForm.control}
                                            path="confirmPassword"
                                            type="password"
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