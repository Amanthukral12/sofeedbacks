"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
const SignIn = () => {
  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const debouncedUserName = useDebounceValue(userName, 300);

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUserNameUniue = async () => {
      if (debouncedUserName) {
        setIsCheckingUserName(true);
        setUserNameMessage("");
        try {
          const resposne = await axios.get(
            `/api/check-username-unique?userName=${debouncedUserName}`
          );
          setUserNameMessage(resposne.data.message);
        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponse>;
          setUserNameMessage(
            AxiosError.response?.data.message || "Error checking userName"
          );
        } finally {
          setIsCheckingUserName(false);
        }
      }
    };
    checkUserNameUniue();
  }, [debouncedUserName]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      toast({
        title: "Sucess",
        description: response.data.message,
      });
      router.replace(`/verify/${userName}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  return <div>page</div>;
};

export default SignIn;
