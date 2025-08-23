"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./shared/FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-in" ? z.string().min(3) : z.string().optional,
    email: z.email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-in") {
        console.log("SignIn", values);
      } else {
        console.log("SignUp", values);
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10 ">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image src="/logo.svg" height={32} width={32} alt="logo" />
          <h2 className="text-primary-100">Prepwise</h2>
        </div>
        <h3>Practice job interview with AI </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 "
          >
            {!isSignIn &&
            <FormField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Enter your name"
            />
            }
           <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            type="email"
            />
            <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            />

            <Button type="submit">
              {isSignIn ? "SignIn" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {!isSignIn ? "No Account Yet?" : "Have an account already?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1 "
          >
            {!isSignIn ? "Sign In" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
