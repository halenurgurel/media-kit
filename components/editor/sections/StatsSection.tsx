"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEditorStore } from "@/store/useEditorStore";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import type { CreatorStats } from "@/types/mediakit";

export function StatsSection() {
  const draft = useEditorStore((state) => state.draft);
  const updateField = useEditorStore((state) => state.updateField);

  const { register, watch, reset } = useForm<CreatorStats>({
    defaultValues: draft.stats,
  });

  useEffect(() => {
    reset(draft.stats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.id]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (!name) return;
      updateField(`stats.${name}`, values[name as keyof CreatorStats]);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateField]);

  return (
    <div className="flex max-w-md flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="avgLikes">Avg. likes</Label>
          <Input id="avgLikes" type="number" min={0} {...register("avgLikes", { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="avgComments">Avg. comments</Label>
          <Input
            id="avgComments"
            type="number"
            min={0}
            {...register("avgComments", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="avgReach">Avg. reach</Label>
          <Input id="avgReach" type="number" min={0} {...register("avgReach", { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="monthlyImpressions">Monthly impressions</Label>
          <Input
            id="monthlyImpressions"
            type="number"
            min={0}
            {...register("monthlyImpressions", { valueAsNumber: true })}
          />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-charcoal-900">Audience demographics</h3>
      <div>
        <Label htmlFor="audienceLocation">Location</Label>
        <Input
          id="audienceLocation"
          placeholder="e.g. 70% Turkey, 20% US"
          {...register("audienceLocation")}
        />
      </div>
      <div>
        <Label htmlFor="audienceAge">Age range</Label>
        <Input id="audienceAge" placeholder="e.g. 18–34 (65%)" {...register("audienceAge")} />
      </div>
      <div>
        <Label htmlFor="audienceGender">Gender split</Label>
        <Input id="audienceGender" placeholder="e.g. Female 72%" {...register("audienceGender")} />
      </div>
    </div>
  );
}
