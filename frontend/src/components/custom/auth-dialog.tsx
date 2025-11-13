"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import {
  RequestOtpForm,
  RequestOtpSchema,
  SignInForm,
  SignInSchema,
  SignUpForm,
  SignUpSchema,
  VarifyOtpForm,
  VarifyOtpSchema,
} from "@/lib/model/auth-schema";
import CustomInput from "./form-item";
import { useAuthStore } from "@/lib/model/auth-store";
import { BookOpen, Check, LucideProps } from "lucide-react";
import { input_bg, primary_color } from "@/app/color";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BASEURL } from "@/lib/url";
import { request } from "@/lib/base-client";
import { POST_CONFIG, RestClientException } from "@/lib/rest-utils";
import { ConfirmPasswordRespone, OtpRespone, VerifyRespone } from "@/lib/output/response";
import { useUserIdStore } from "@/lib/model/user-id-store";

type AuthDialogProsps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showTrigger?: boolean;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export default function AuthDialog({
  open,
  onOpenChange,
  showTrigger = true,
  icon,
}: AuthDialogProsps) {

  const {setId} = useUserIdStore();

  const [signUpStep, setSignUpStep] = useState<"REQUEST" | "VERIFY" | "Details">("REQUEST");
  const [otpEmail, SetOtpEmail] = useState<string>("");
  const [rememberToken, setRememberToken] =  useState<string>("");
  const [verifiedToken, setVerifiedToken] =  useState<string>("");

  const router = useRouter();
  const Icon = icon;

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
  });

  const requestOtpForm = useForm<RequestOtpForm>({
    resolver: zodResolver(RequestOtpSchema),
  });

  const varifyOtpForm = useForm<VarifyOtpForm>({
    resolver: zodResolver(VarifyOtpSchema),
  });

  const OnSignIn = async (form: SignInForm) => {

    console.log(form)

    try {

      const response = await request("api/v1/login", {
      ...POST_CONFIG,
      body: JSON.stringify({
         email : form.email,
         password : form.password
        }),
      credentials : "include"
       })

      const data : ConfirmPasswordRespone =await response.json()
      setId(data.newUserId);
      console.log(data.newUserId)
      useAuthStore.getState().setIsAuth(true);
      router.push("/books");

    } catch(error) {
        if (error instanceof RestClientException) {
        console.error("Request error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const OnSignUp =async (form: SignUpForm) => {

    try {

      const response = await request("api/v1/confirm-password", {
      ...POST_CONFIG,
      body: JSON.stringify({
         email: form.email,
         name : form.name,
         password : form.password,
         confirmPassword : form.confirmPassword,
         verifiedToken : verifiedToken
        }),
      credentials : "include"
       })

      const data : ConfirmPasswordRespone =await response.json()
      console.log(data.newUserId)
      useAuthStore.getState().setIsAuth(true);

    } catch(error) {

    }
  
  };

  const OnRequestOtp = async (form: RequestOtpForm) => {
    console.log(form);

    try {

      const response = await request("api/v1/register", {
      ...POST_CONFIG,
      body: JSON.stringify({ email: form.email })
       })

      const data : OtpRespone =await response.json()
      setRememberToken(data.rememberToken)

    } catch(error) {

    }
  };

  const OnVarifyOtp = async (form: VarifyOtpForm) => {

    try{

      const response = await request("api/v1/verify-otp", {
        ...POST_CONFIG,
        body : JSON.stringify({
          email : form.email,
          otp : form.otp,
          rememberToken : rememberToken
        })
      })

      const data : VerifyRespone = await response.json()
      setVerifiedToken(data.verifiedToken)

    }catch (error) {

    }
  };

  useEffect(() => {
    if (!open) {
      setSignUpStep("REQUEST");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            style={{ background: primary_color }}
            className={`me-10 ${
              Icon ? "flex justify-between items-center gap-2" : ""
            }`}
          >
            {Icon && <Icon />}
            <span className="text-sm font-semibold">Sign In</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="w-[450px]">
        <DialogHeader className="items-center">
          <DialogTitle className="flex gap-1 items-center">
            <BookOpen color={primary_color} /> Welcome to BookEx
          </DialogTitle>

          <DialogClose asChild>
            <button onClick={() => onOpenChange(false)} type="button"></button>
          </DialogClose>
        </DialogHeader>

        <Tabs defaultValue="signin">
          <TabsList
            style={{ backgroundColor: input_bg }}
            className="w-full rounded-sm"
          >
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

                <Button
                  className="w-full"
                  style={{ backgroundColor: primary_color }}
                  type="submit"
                >
                  Sign In
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup">
            {signUpStep === "REQUEST" && (
              <Form {...requestOtpForm}>
                <form
                  onSubmit={requestOtpForm.handleSubmit((form) => {
                    OnRequestOtp(form);
                    SetOtpEmail(form.email);
                    setSignUpStep("VERIFY");
                  })}
                >
                  <CustomInput
                    control={requestOtpForm.control}
                    path="email"
                    label="Email Address"
                    placeholder="Enter your email"
                  />

                  <h1 className="text-sm mt-3">
                    {" "}
                    We&apos;ll send you a verification code to confirm your
                    email.
                  </h1>

                  <Button
                    type="submit"
                    style={{ backgroundColor: primary_color }}
                    className="w-full mt-3"
                  >
                    Request OTP
                  </Button>

                  <div className="mt-4 border-1 p-4 bg-green-100 rounded-md">
                    <span className="text-sm">
                      Welcome bonus: Get 10 credits when you join! List your
                      first book to earn even more.
                    </span>
                  </div>

                  <h1 className="text-sm pt-4 ms-2">
                    Join thousands of readers sharing books in our community!
                  </h1>
                </form>
              </Form>
            )}

            {signUpStep === "VERIFY" && (
              <Form {...varifyOtpForm}>
                <form
                  onSubmit={varifyOtpForm.handleSubmit(async (form) => {
                    signUpForm.reset({
                      name: "",
                      email: otpEmail,
                      password: "",
                      confirmPassword: "",
                    });

                    OnVarifyOtp({ ...form });
                    console.log("OK submit", form);
                    setSignUpStep("Details");
                  })}
                >
                  <div className="mt-4 border-1 p-4 bg-blue-100 rounded-md">
                    <span className="text-sm">
                      A verification code has been sent to:{" "}
                      <h1 className="text-xl">{otpEmail}</h1>
                    </span>
                  </div>

                  <input
                    type="hidden"
                    {...varifyOtpForm.register("email")}
                    value={otpEmail}
                    readOnly
                  />

                  <CustomInput
                    control={varifyOtpForm.control}
                    path="otp"
                    label="Enter Verification Code"
                    className="mt-3"
                    placeholder="Enter 6-digit code"
                    type="number"
                  />

                  <Button
                    type="submit"
                    style={{ backgroundColor: primary_color }}
                    className="w-full mt-3"
                  >
                    Verify OTP
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      setSignUpStep("REQUEST");
                      SetOtpEmail("");
                      varifyOtpForm.reset();
                    }}
                    className="bg-white text-black border w-full mt-3  hover:bg-[oklch(0.8_0.12_65)]"
                  >
                    Change Email
                  </Button>
                </form>
              </Form>
            )}

            {signUpStep === "Details" && (
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(OnSignUp)}>
                  <div className="mt-4 border-1 p-4 bg-green-100 rounded-md flex gap-4">
                    <Check />
                    <h1 className="text-sm items-center">
                      {" "}
                      Email verified! Complete your profile to finish
                      registration.
                    </h1>
                  </div>

                  <CustomInput
                    control={signUpForm.control}
                    path="email"
                    label="Email"
                    className="mb-4 mt-4"
                    readonly
                  />

                  <CustomInput
                    control={signUpForm.control}
                    path="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    className="mb-4 mt-4"
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

                  <Button
                    className="w-full"
                    style={{ backgroundColor: primary_color }}
                    type="submit"
                  >
                    Create Account
                  </Button>
                </form>
              </Form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
