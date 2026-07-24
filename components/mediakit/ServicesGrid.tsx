import type { Service } from "@/types/mediakit";

interface ServicesGridProps {
  services: Service[];
}

const currencySymbols: Record<Service["currency"], string> = {
  USD: "$",
  EUR: "€",
  TRY: "₺",
};

export function ServicesGrid({ services }: ServicesGridProps) {
  if (services.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-center text-xl font-semibold text-[color:var(--theme-text)]">
        Services &amp; Pricing
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-lg border border-[color:var(--theme-accent-light)] px-4 py-3"
          >
            <span className="text-sm font-medium text-[color:var(--theme-text)]">
              {service.name}
            </span>
            <span className="text-sm font-semibold text-[color:var(--theme-accent)]">
              {service.isHidden
                ? "Contact for pricing"
                : `${currencySymbols[service.currency]}${service.price.toLocaleString()}`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
