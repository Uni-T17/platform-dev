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
import { BookOpen, Check, Loader2, LucideProps } from "lucide-react";
import { input_bg, primary_color } from "@/app/color";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { request, ApiError } from "@/lib/base-client";
import { POST_CONFIG } from "@/lib/rest-utils";
import {
  ConfirmPasswordRespone,
  OtpRespone,
  VerifyRespone,
} from "@/lib/output/response";
import { useUserIdStore } from "@/lib/model/user-id-store";
import { toast } from "sonner";

type AuthDialogProsps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showTrigger?: boolean;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

/** Turn any thrown value into a user-friendly message for a toast. */
function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function AuthDialog({
  open,
  onOpenChange,
  showTrigger = true,
  icon,
}: AuthDialogProsps) {
  const { setId } = useUserIdStore();

  const [signUpStep, setSignUpStep] = useState<"REQUEST" | "VERIFY" | "Details">(
    "REQUEST"
  );
  const [otpEmail, SetOtpEmail] = useState<string>("");
  const [rememberToken, setRememberToken] = useState<string>("");
  const [verifiedToken, setVerifiedToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const Icon = icon;

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
  });

  const requestOtpForm = useForm<RequestOtpForm>({
    resolver: zodResolver(RequestOtpSchema),
    defaultValues: { email: "" },
  });

  const varifyOtpForm = useForm<VarifyOtpForm>({
    resolver: zodResolver(VarifyOtpSchema),
  });

  const OnSignIn = async (form: SignInForm) => {
    setLoading(true);
    try {
      const response = await request("api/v1/login", {
        ...POST_CONFIG,
        body: JSON.stringify({ email: form.email, password: form.password }),
        credentials: "include",
      });

      const data: ConfirmPasswordRespone = await response.json();
      setId(data.newUserId);
      useAuthStore.getState().setIsAuth(true);
      toast.success("Welcome back!");
      onOpenChange(false);
      router.push("/books");
    } catch (error) {
      toast.error(errorMessage(error, "Sign in failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const OnSignUp = async (form: SignUpForm) => {
    setLoading(true);
    try {
      const response = await request("api/v1/confirm-password", {
        ...POST_CONFIG,
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          password: form.password,
          confirmPassword: form.confirmPassword,
          verifiedToken: verifiedToken,
        }),
        credentials: "include",
      });

      const data: ConfirmPasswordRespone = await response.json();
      setId(data.newUserId);
      useAuthStore.getState().setIsAuth(true);
      toast.success("Account created — welcome to BookEx!");
      onOpenChange(false);
      router.push("/books");
    } catch (error) {
      toast.error(errorMessage(error, "Could not create your account."));
    } finally {
      setLoading(false);
    }
  };

  /** Returns true when the OTP was requested successfully. */
  const OnRequestOtp = async (form: RequestOtpForm): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await request("api/v1/register", {
        ...POST_CONFIG,
        body: JSON.stringify({ email: form.email }),
      });

      const data: OtpRespone = await response.json();
      setRememberToken(data.rememberToken);
      toast.success("Verification code sent — check your inbox.");
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Could not send the code."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  /** Returns true when the OTP was verified successfully. */
  const OnVarifyOtp = async (form: VarifyOtpForm): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await request("api/v1/verify-otp", {
        ...POST_CONFIG,
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
          rememberToken: rememberToken,
        }),
      });

      const data: VerifyRespone = await response.json();
      setVerifiedToken(data.verifiedToken);
      toast.success("Email verified!");
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Invalid or expired code."));
      return false;
    } finally {
      setLoading(false);
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
            className={`${Icon ? "flex justify-between items-center gap-2" : ""}`}
          >
            {Icon && <Icon />}
            <span className="text-sm font-semibold">Sign In</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="w-full max-w-[450px]">
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
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  Sign In
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup">
            {signUpStep === "REQUEST" && (
              <Form {...requestOtpForm}>
                <form
                  onSubmit={requestOtpForm.handleSubmit(async (form) => {
                    const ok = await OnRequestOtp(form);
                    if (ok) {
                      SetOtpEmail(form.email);
                      setSignUpStep("VERIFY");
                    }
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
                    disabled={loading}
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Request OTP
                  </Button>

                  <div className="mt-4 border p-4 bg-green-100 rounded-md">
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
                    const ok = await OnVarifyOtp({ ...form });
                    if (ok) {
                      signUpForm.reset({
                        name: "",
                        email: otpEmail,
                        password: "",
                        confirmPassword: "",
                      });
                      setSignUpStep("Details");
                    }
                  })}
                >
                  <div className="mt-4 border p-4 bg-blue-100 rounded-md">
                    <span className="text-sm">
                      A verification code has been sent to:{" "}
                      <span className="block text-xl">{otpEmail}</span>
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
                    disabled={loading}
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Verify OTP
                  </Button>

                  <Button
                    type="button"
                    disabled={loading}
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
                  <div className="mt-4 border p-4 bg-green-100 rounded-md flex gap-4">
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
                    disabled={loading}
                  >
                    {loading && <Loader2 className="animate-spin" />}
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
