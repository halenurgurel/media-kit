"use client";

import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpWithEmail } from "@/lib/auth";
import { useUsernameAvailability } from "@/lib/queries/auth.queries";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface RegisterFormValues {
  email: string;
  password: string;
  username: string;
}

// Instagram usernames: letters, numbers, periods, and underscores only.
const USERNAME_PATTERN = /^[a-z0-9._]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: { email: "", password: "", username: "" },
  });

  const username = watch("username");
  const hasInvalidChars = username.length > 0 && !USERNAME_PATTERN.test(username);
  const isPatternValid = !hasInvalidChars && username.length >= 3 && username.length <= 30;

  const debouncedUsername = useDebouncedValue(username, 500);
  const {
    data: isUsernameAvailable,
    isFetching: isCheckingUsername,
    isError: usernameCheckErrored,
  } = useUsernameAvailability(isPatternValid ? debouncedUsername : "");

  const usernameIsChecked =
    isPatternValid && debouncedUsername === username && !isCheckingUsername && !usernameCheckErrored;

  function handleUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    const sanitized = e.target.value.replace(/@/g, "").toLowerCase();
    setValue("username", sanitized, { shouldValidate: true, shouldDirty: true });
  }

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null);
    if (hasInvalidChars || (usernameIsChecked && isUsernameAvailable === false)) {
      return;
    }
    setIsSubmitting(true);
    try {
      await signUpWithEmail(values.email, values.password, values.username);
      router.push("/dashboard");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 p-8">
      <Card className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold text-charcoal-900">Create your account</h1>
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

          <div>
            <Label htmlFor="username">Instagram Username</Label>
            <p className="mb-1.5 text-xs text-charcoal-600">
              Your media kit will be available at site.com/yourusername
            </p>
            <Input
              id="username"
              type="text"
              autoComplete="off"
              placeholder="@nailsbyhalee"
              maxLength={30}
              {...register("username", {
                required: "Instagram username is required",
                minLength: { value: 3, message: "Must be at least 3 characters" },
                maxLength: { value: 30, message: "Must be 30 characters or fewer" },
                pattern: {
                  value: USERNAME_PATTERN,
                  message: "Only letters, numbers, . and _ allowed",
                },
              })}
              onChange={handleUsernameChange}
            />
            {hasInvalidChars ? (
              <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <span aria-hidden>✕</span> Only letters, numbers, . and _ allowed
              </p>
            ) : errors.username ? (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            ) : usernameIsChecked && isUsernameAvailable === true ? (
              <p className="mt-1 flex items-center gap-1 text-sm text-green-600">
                <span aria-hidden>✓</span> Username available
              </p>
            ) : usernameIsChecked && isUsernameAvailable === false ? (
              <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <span aria-hidden>✕</span> Username already taken
              </p>
            ) : isPatternValid && usernameCheckErrored ? (
              <p className="mt-1 text-sm text-red-600">
                Couldn&apos;t check availability. Please try again.
              </p>
            ) : isPatternValid ? (
              <p className="mt-1 text-sm text-charcoal-400">Checking availability…</p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pr-10"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-charcoal-600 hover:text-charcoal-900"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              hasInvalidChars ||
              (usernameIsChecked && isUsernameAvailable === false)
            }
            className={cn(isSubmitting && "opacity-70")}
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-charcoal-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-mauve-800 hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
