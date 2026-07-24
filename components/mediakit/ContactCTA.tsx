interface ContactCTAProps {
  displayName: string;
  contactEmail?: string;
}

export function ContactCTA({ displayName, contactEmail }: ContactCTAProps) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-lg bg-[color:var(--theme-accent-light)] px-6 py-10 text-center">
      <h2 className="text-xl font-semibold text-[color:var(--theme-text)]">Work with me</h2>
      <p className="max-w-md text-sm text-[color:var(--theme-muted)]">
        Interested in a collaboration with {displayName || "me"}? Get in touch to talk brand deals,
        content, and partnerships.
      </p>
      {contactEmail ? (
        <a
          href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Let's work together, ${displayName}`)}`}
          className="mt-2 rounded-md bg-[color:var(--theme-accent)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Get in touch
        </a>
      ) : (
        <p className="mt-2 text-xs text-[color:var(--theme-muted)]">Contact details coming soon.</p>
      )}
    </section>
  );
}
