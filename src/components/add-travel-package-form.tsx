"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "cn"

const inputClass =
  "h-10 rounded-sm border-neutral-200 bg-[#f8f8f8] px-3 text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-brand focus-visible:ring-brand/20 md:text-sm"

const textareaClass =
  "min-h-28 resize-none rounded-sm border-neutral-200 bg-[#f8f8f8] px-3 py-2 text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-brand focus-visible:ring-brand/20 md:text-sm"

const selectTriggerClass =
  "h-10! w-full rounded-sm border-neutral-200 bg-[#f8f8f8] px-3 text-sm text-neutral-900 shadow-none focus-visible:border-brand focus-visible:ring-brand/20"

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-neutral-700">
        {label}
      </Label>
      {children}
    </div>
  )
}

export function AddTravelPackageForm() {
  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <FormField label="Destination Name" htmlFor="destination-name">
        <Input
          id="destination-name"
          name="destinationName"
          placeholder="Bali Paradise"
          className={inputClass}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Country" htmlFor="country">
          <Input
            id="country"
            name="country"
            placeholder="Indonesia"
            className={inputClass}
          />
        </FormField>

        <FormField label="Category" htmlFor="category">
          <Select name="category" defaultValue="Beach">
            <SelectTrigger id="category" className={selectTriggerClass}>
              <SelectValue placeholder="Beach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beach">Beach</SelectItem>
              <SelectItem value="Mountain">Mountain</SelectItem>
              <SelectItem value="City">City</SelectItem>
              <SelectItem value="Adventure">Adventure</SelectItem>
              <SelectItem value="Cultural">Cultural</SelectItem>
              <SelectItem value="Cruise">Cruise</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Price (USD)" htmlFor="price">
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="e.g., 1299"
            className={cn(
              inputClass,
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            )}
          />
        </FormField>

        <FormField label="Duration" htmlFor="duration">
          <Input
            id="duration"
            name="duration"
            placeholder="e.g., 7 Days/6 Nights"
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Departure Date" htmlFor="departure-date">
        <Input
          id="departure-date"
          name="departureDate"
          type="date"
          className={inputClass}
        />
      </FormField>

      <FormField label="Image URL" htmlFor="image-url">
        <Input
          id="image-url"
          name="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          className={inputClass}
        />
      </FormField>

      <FormField label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the travel experience..."
          className={textareaClass}
        />
      </FormField>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-10 rounded-sm border-red-200 bg-white px-4 text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
          )}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Cancel
        </Link>
        <Button
          type="submit"
          className="h-10 rounded-sm bg-brand px-4 text-sm text-brand-foreground hover:bg-brand/90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Travel Package
        </Button>
      </div>
    </form>
  )
}
