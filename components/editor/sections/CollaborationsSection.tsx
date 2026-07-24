"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useEditorStore } from "@/store/useEditorStore";
import { ImageUploader } from "@/components/editor/ImageUploader";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Collaboration } from "@/types/mediakit";

interface CollaborationsFormValues {
  collaborations: Collaboration[];
}

function emptyCollaboration(): Collaboration {
  return {
    id: crypto.randomUUID(),
    brandName: "",
    brandLogoUrl: "",
    description: "",
    resultMetric: "",
    date: "",
  };
}

export function CollaborationsSection() {
  const draft = useEditorStore((state) => state.draft);
  const updateField = useEditorStore((state) => state.updateField);

  const { register, control, watch, setValue, reset } = useForm<CollaborationsFormValues>({
    defaultValues: { collaborations: draft.collaborations },
  });
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "collaborations",
    keyName: "fieldKey",
  });

  useEffect(() => {
    reset({ collaborations: draft.collaborations });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.id]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (!name || !values.collaborations) return;
      updateField("collaborations", values.collaborations);
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
        <Droppable droppableId="collaborations">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <Draggable key={field.fieldKey} draggableId={field.fieldKey} index={index}>
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

                      <ImageUploader
                        currentImageUrl={draft.collaborations[index]?.brandLogoUrl}
                        label="Upload brand logo"
                        shape="square"
                        onUploaded={(url) =>
                          setValue(`collaborations.${index}.brandLogoUrl`, url, { shouldDirty: true })
                        }
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Brand name</Label>
                          <Input {...register(`collaborations.${index}.brandName` as const)} />
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input placeholder="e.g. Mar 2026" {...register(`collaborations.${index}.date` as const)} />
                        </div>
                        <div className="col-span-2">
                          <Label>Description</Label>
                          <Input {...register(`collaborations.${index}.description` as const)} />
                        </div>
                        <div className="col-span-2">
                          <Label>Result metric</Label>
                          <Input
                            placeholder="e.g. 52K views, 4.2% engagement"
                            {...register(`collaborations.${index}.resultMetric` as const)}
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

      <Button
        type="button"
        variant="secondary"
        className="self-start"
        onClick={() => append(emptyCollaboration())}
      >
        Add collaboration
      </Button>
    </div>
  );
}
