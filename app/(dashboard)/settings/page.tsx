"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { useMediaKit, useUpdateDisplayName } from "@/lib/queries/mediakit.queries";
import { changeUserPassword } from "@/lib/auth";
import { useToastStore } from "@/store/useToastStore";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UsernameField } from "@/components/editor/sections/SettingsSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface NameFormValues {
  displayName: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function ProfileCard() {
  const user = useAuthStore((state) => state.user);
  const { data: mediaKit, isLoading } = useMediaKit(user?.uid ?? "");
  const updateDisplayName = useUpdateDisplayName();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<NameFormValues>({ defaultValues: { displayName: "" } });

  useEffect(() => {
    if (mediaKit) reset({ displayName: mediaKit.displayName });
  }, [mediaKit, reset]);

  function onSubmit(values: NameFormValues) {
    if (!mediaKit) return;
    updateDisplayName.mutate({ id: mediaKit.id, displayName: values.displayName });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !mediaKit ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <div className="flex max-w-md flex-col gap-5">
            <div>
              <Label>Email</Label>
              <Input value={user?.email ?? ""} readOnly disabled />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
              <Label htmlFor="displayName">Name</Label>
              <div className="flex gap-2">
                <Input id="displayName" {...register("displayName")} />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={!isDirty || updateDisplayName.isPending}
                >
                  {updateDisplayName.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
            <UsernameField />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PasswordCard() {
  const showToast = useToastStore((state) => state.showToast);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: PasswordFormValues) {
    setSubmitError(null);
    if (values.newPassword !== values.confirmPassword) {
      setSubmitError("New passwords don't match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await changeUserPassword(values.currentPassword, values.newPassword);
      reset();
      showToast("Password updated.", "success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4">
          <div>
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword", { required: "Current password is required" })}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", { required: "Please confirm your new password" })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/settings");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-charcoal-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <DashboardHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <ProfileCard />
        <PasswordCard />
      </main>
    </div>
  );
}
