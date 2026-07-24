import Link from "next/link";

export function MediaKitFooter() {
  return (
    <footer className="flex justify-center border-t border-[color:var(--theme-accent-light)] py-6">
      <p className="text-xs text-[color:var(--theme-muted)]">
        Created with{" "}
        <Link href="/" className="font-medium text-[color:var(--theme-accent)] hover:underline">
          MediaKit Builder
        </Link>
      </p>
    </footer>
  );
}
