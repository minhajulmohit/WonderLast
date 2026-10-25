"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/use-form";
import {
  initialTravelPackageFormValues,
  travelPackageCategories,
  type TravelPackageFormValues,
} from "@/lib/travel-package";
import { cn } from "cn";

const inputClass =
  "h-10 rounded-sm border-neutral-200 bg-[#f8f8f8] px-3 text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-brand focus-visible:ring-brand/20 md:text-sm";

const textareaClass =
  "min-h-28 resize-none rounded-sm border-neutral-200 bg-[#f8f8f8] px-3 py-2 text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-brand focus-visible:ring-brand/20 md:text-sm";

const selectTriggerClass =
  "h-10! w-full rounded-sm border-neutral-200 bg-[#f8f8f8] px-3 text-sm text-neutral-900 shadow-none focus-visible:border-brand focus-visible:ring-brand/20";

const travelPackagesApiUrl = "http://localhost:8000/add-destination";
type AddTravelPackageFormProps = {
  onSubmit?: (values: TravelPackageFormValues) => void | Promise<void>;
};

export function AddTravelPackageForm({ onSubmit }: AddTravelPackageFormProps) {
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const submitTravelPackage = async (values: TravelPackageFormValues) => {
    setFeedback(null);

    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        if (!travelPackagesApiUrl) {
          throw new Error(
            "Set NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL to your backend endpoint.",
          );
        }

        const response = await fetch(travelPackagesApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            price: Number(values.price),
          }),
        });

        if (!response.ok) {
          const responseMessage = await response.text();
          throw new Error(
            responseMessage ||
              `The server returned an error (${response.status}).`,
          );
        }
      }

      setFeedback({
        type: "success",
        message: "Travel package added successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to add the travel package. Please try again.",
      });
    }
  };

  const {
    values,
    isSubmitting,
    handleChange,
    handleSelectChange,
    handleSubmit,
  } = useForm({
    initialValues: initialTravelPackageFormValues,
    onSubmit: submitTravelPackage,
  });

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-5">
        <Field>
          <FieldLabel
            htmlFor="destination-name"
            className="text-sm font-medium text-neutral-700"
          >
            Destination Name
          </FieldLabel>
          <Input
            id="destination-name"
            name="destinationName"
            value={values.destinationName}
            onChange={handleChange}
            placeholder="Bali Paradise"
            className={inputClass}
            required
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel
              htmlFor="country"
              className="text-sm font-medium text-neutral-700"
            >
              Country
            </FieldLabel>
            <Input
              id="country"
              name="country"
              value={values.country}
              onChange={handleChange}
              placeholder="Indonesia"
              className={inputClass}
              required
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="category"
              className="text-sm font-medium text-neutral-700"
            >
              Category
            </FieldLabel>
            <Select
              name="category"
              value={values.category}
              onValueChange={handleSelectChange("category")}
            >
              <SelectTrigger id="category" className={selectTriggerClass}>
                <SelectValue placeholder="Beach" />
              </SelectTrigger>
              <SelectContent>
                {travelPackageCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel
              htmlFor="price"
              className="text-sm font-medium text-neutral-700"
            >
              Price (USD)
            </FieldLabel>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              onChange={handleChange}
              placeholder="e.g., 1299"
              className={cn(
                inputClass,
                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              )}
              required
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="duration"
              className="text-sm font-medium text-neutral-700"
            >
              Duration
            </FieldLabel>
            <Input
              id="duration"
              name="duration"
              value={values.duration}
              onChange={handleChange}
              placeholder="e.g., 7 Days/6 Nights"
              className={inputClass}
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel
            htmlFor="departure-date"
            className="text-sm font-medium text-neutral-700"
          >
            Departure Date
          </FieldLabel>
          <Input
            id="departure-date"
            name="departureDate"
            type="date"
            value={values.departureDate}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="image-url"
            className="text-sm font-medium text-neutral-700"
          >
            Image URL
          </FieldLabel>
          <Input
            id="image-url"
            name="imageUrl"
            type="url"
            value={values.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={inputClass}
            required
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="description"
            className="text-sm font-medium text-neutral-700"
          >
            Description
          </FieldLabel>
          <Textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Describe the travel experience..."
            className={textareaClass}
            required
          />
        </Field>

        {feedback ? (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            className={
              feedback.type === "error"
                ? "text-sm text-red-600"
                : "text-sm text-green-700"
            }
          >
            {feedback.message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 rounded-sm border-red-200 bg-white px-4 text-sm text-red-500 hover:bg-red-50 hover:text-red-600",
            )}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-sm bg-brand px-4 text-sm text-brand-foreground hover:bg-brand/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            {isSubmitting ? "Adding..." : "Add Travel Package"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
