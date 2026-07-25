"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useEditorStore } from "@/store/useEditorStore";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Platform, PlatformName } from "@/types/mediakit";

const PLATFORM_NAMES: PlatformName[] = ["instagram", "tiktok", "youtube", "twitter"];

interface PlatformsFormValues {
  platforms: Platform[];
}

function emptyPlatform(): Platform {
  return { name: "instagram", handle: "", followerCount: 0, engagementRate: 0 };
}

export function PlatformsSection() {
  const draft = useEditorStore((state) => state.draft);
  const updateField = useEditorStore((state) => state.updateField);

  const { register, control, watch, reset } = useForm<PlatformsFormValues>({
    defaultValues: { platforms: draft.platforms },
  });
  const { fields, append, remove, move } = useFieldArray({ control, name: "platforms" });

  useEffect(() => {
    reset({ platforms: draft.platforms });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.id]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (!name || !values.platforms) return;
      updateField("platforms", values.platforms);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateField]);

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  }

  return (
    <div className="flex max-w-lg flex-col gap-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="platforms">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(dragProvided) => (
                    <li
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className="flex flex-col gap-2 rounded-md border border-cream-200 bg-white p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          {...dragProvided.dragHandleProps}
                          className="cursor-grab text-charcoal-400"
                          aria-label="Drag to reorder"
                        >
                          ⠿
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <Label>Platform</Label>
                          <Select {...register(`platforms.${index}.name` as const)}>
                            {PLATFORM_NAMES.map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <Label>Handle</Label>
                          <Input
                            {...register(`platforms.${index}.handle` as const)}
                            placeholder="username"
                          />
                        </div>
                        <div>
                          <Label>Followers</Label>
                          <Input
                            type="number"
                            min={0}
                            {...register(`platforms.${index}.followerCount` as const, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div>
                          <Label>Engagement rate (%)</Label>
                          <Input
                            type="number"
                            min={0}
                            step="0.1"
                            {...register(`platforms.${index}.engagementRate` as const, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <Button type="button" variant="secondary" className="self-start" onClick={() => append(emptyPlatform())}>
        Add platform
      </Button>
    </div>
  );
}
