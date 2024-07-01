"use client";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(response);
    if (response?.error) {
      toast({
        title: "Login Failed",
        description: response.error,
        variant: "destructive",
      });
    }
    if (response?.url) {
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            soFeedbacks
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username/Email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w- animate-spin" /> Please wait
                </>
              ) : (
                "Signin"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            New member?
            <Link
              href={"/signup"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
