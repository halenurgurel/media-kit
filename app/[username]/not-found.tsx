import Link from "next/link";

export default function MediaKitNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-50 p-8 text-center">
      <h1 className="text-2xl font-semibold text-charcoal-900">This page doesn&apos;t exist</h1>
      <p className="max-w-sm text-sm text-charcoal-600">
        The media kit you&apos;re looking for isn&apos;t here — it may have been unpublished or the
        link may be incorrect.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-mauve-400 px-5 py-2 text-sm font-medium text-white hover:bg-mauve-600"
      >
        Go home
      </Link>
    </div>
  );
}
