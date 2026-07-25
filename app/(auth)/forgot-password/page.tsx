"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await resetPassword(values.email);
      setIsSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to send reset email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 p-8">
      <Card className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-semibold text-charcoal-900">Reset your password</h1>
        <p className="mb-6 text-sm text-charcoal-600">
          Enter your account email and we&apos;ll send you a link to reset your password.
        </p>
        {isSent ? (
          <p className="rounded-md border border-mauve-200 bg-mauve-50 p-3 text-sm text-mauve-800">
            If an account exists for that email, a reset link is on its way. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-charcoal-600">
          <Link href="/login" className="font-medium text-mauve-800 hover:underline">
            Back to log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
