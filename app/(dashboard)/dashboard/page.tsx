import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link href="/editor">
          <Button>Edit my media kit</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your media kit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            You haven&apos;t published a media kit yet. Head to the editor to get started.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
