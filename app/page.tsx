import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Build a media kit that lands brand deals
      </h1>
      <p className="max-w-xl text-gray-500">
        Turn your Instagram stats, audience insights, and past collaborations into a
        beautiful, shareable media kit in minutes.
      </p>
      <div className="flex gap-4">
        <Link href="/register">
          <Button>Get started</Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary">Log in</Button>
        </Link>
      </div>
    </main>
  );
}
