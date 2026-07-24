"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useEditorStore } from "@/store/useEditorStore";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import type { Service, ServiceCurrency } from "@/types/mediakit";

const CURRENCIES: ServiceCurrency[] = ["USD", "EUR", "TRY"];

interface ServicesFormValues {
  services: Service[];
}

function emptyService(): Service {
  return { id: crypto.randomUUID(), name: "", price: 0, currency: "USD", isHidden: false };
}

export function ServicesSection() {
  const draft = useEditorStore((state) => state.draft);
  const updateField = useEditorStore((state) => state.updateField);

  const { register, control, watch, reset } = useForm<ServicesFormValues>({
    defaultValues: { services: draft.services },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "services" });

  useEffect(() => {
    reset({ services: draft.services });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.id]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (!name || !values.services) return;
      updateField("services", values.services);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateField]);

  return (
    <div className="flex max-w-lg flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <li key={field.id} className="flex flex-col gap-2 rounded-md border border-cream-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal-600">Service {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g. Instagram Reel"
                  {...register(`services.${index}.name` as const)}
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  min={0}
                  {...register(`services.${index}.price` as const, { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select {...register(`services.${index}.currency` as const)}>
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Toggle {...register(`services.${index}.isHidden` as const)} />
              <span className="text-sm text-charcoal-600">Hide price on public page</span>
            </div>
          </li>
        ))}
      </ul>

      <Button type="button" variant="secondary" className="self-start" onClick={() => append(emptyService())}>
        Add service
      </Button>
    </div>
  );
}
