"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function SignUpForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const createUser = async (values: z.infer<typeof SignUpFormSchema>) => {
    try {
      const response = await axios.post("/api/users/register", values);

      if (response.status === 201) {
        toast.success("Account created successfully");
        router.push("/music");
      } else if (response.status === 409) {
        toast.error("Account already exists. Please sign in");
      } else {
        toast.error("Please try again later");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const isLoading = form.formState.isSubmitting;

  const handleGoogleLogin = () => {
    window.location.href = `/api/users/auth/google`;
  };

  return (
    <Form {...form}>
      <form className="my-8" onSubmit={form.handleSubmit(createUser)}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="Rana"
                      type="text"
                      {...field}
                      required
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Naidu"
                      type="text"
                      {...field}
                      required
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    {...field}
                    required
                  />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    {...field}
                    required
                  />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Create an account
          </Button>
          <button
            className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
            onClick={handleGoogleLogin}
            aria-label="Login with Google"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Login with Google
            </span>
            <BottomGradient />
          </button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
