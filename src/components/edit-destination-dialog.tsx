"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { Check, LoaderCircle, Pencil, X } from "lucide-react"
import type { TravelDestination } from "@/lib/travel-package"
import {
  travelPackageCategories,
  type TravelPackageFormValues,
} from "@/lib/travel-package"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "cn"

type EditValues = TravelPackageFormValues

type EditDestinationDialogProps = {
  destination: TravelDestination
}

const apiUrl = "http://localhost:8000/destination"
const inputClass =
  "h-9 rounded-sm border-neutral-200 bg-[#f8f8f8] px-3 text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-brand focus-visible:ring-brand/20 md:text-sm"
const selectTriggerClass =
  "h-9! w-full rounded-sm border-neutral-200 bg-[#f8f8f8] px-3 text-sm text-neutral-900 shadow-none focus-visible:border-brand focus-visible:ring-brand/20"

function getInitialValues(destination: TravelDestination): EditValues {
  const category =
    travelPackageCategories.find((item) => item === destination.category) ??
    travelPackageCategories[0]

  return {
    destinationName: destination.destinationName,
    country: destination.country,
    category,
    price: destination.price,
    duration: destination.duration,
    departureDate: destination.departureDate.slice(0, 10),
    imageUrl: destination.imageUrl,
    description: destination.description,
  }
}

export function EditDestinationDialog({
  destination,
}: EditDestinationDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState(() => getInitialValues(destination))
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "error" | "success"
    message: string
  } | null>(null)

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.currentTarget
    setValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isSaving) return

    if (nextOpen) {
      setValues(getInitialValues(destination))
      setFeedback(null)
    }
    setOpen(nextOpen)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setFeedback(null)

    try {
      const response = await fetch(
        `${apiUrl}/${encodeURIComponent(destination.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            price: Number(values.price),
          }),
        }
      )

      if (!response.ok) {
        const responseText = await response.text()
        let message = responseText
        try {
          const body: unknown = JSON.parse(responseText)
          if (
            typeof body === "object" &&
            body !== null &&
            "message" in body &&
            typeof body.message === "string"
          ) {
            message = body.message
          }
        } catch {
          // Keep the response text when the server does not return JSON.
        }
        throw new Error(
          message || `The server returned an error (${response.status}).`
        )
      }

      setFeedback({
        type: "success",
        message: "Destination updated successfully.",
      })
      router.refresh()
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update this destination. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-8 rounded-sm border-neutral-200 px-3 text-xs"
        )}
      >
        <Pencil className="size-3.5" aria-hidden="true" />
        Edit
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/55 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sm border border-neutral-200 bg-white p-5 shadow-xl outline-none sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-heading text-xl font-medium text-neutral-900">
                Update Travel Package
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-neutral-500">
                Make changes to the travel package details below.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close edit dialog"
              disabled={isSaving}
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
            >
              <X className="size-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <form className="mt-5" onSubmit={handleSubmit}>
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel htmlFor="edit-destination-name" className="text-xs">
                  Destination Name
                </FieldLabel>
                <Input
                  id="edit-destination-name"
                  name="destinationName"
                  value={values.destinationName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="edit-country" className="text-xs">
                    Country
                  </FieldLabel>
                  <Input
                    id="edit-country"
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="edit-category" className="text-xs">
                    Category
                  </FieldLabel>
                  <Select
                    value={values.category}
                    onValueChange={(value) => {
                      const category = travelPackageCategories.find(
                        (item) => item === value
                      )
                      if (category) {
                        setValues((current) => ({
                          ...current,
                          category,
                        }))
                      }
                    }}
                  >
                    <SelectTrigger
                      id="edit-category"
                      className={selectTriggerClass}
                    >
                      <SelectValue />
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

              <div className="grid gap-3 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="edit-price" className="text-xs">
                    Price (USD)
                  </FieldLabel>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={values.price}
                    onChange={handleChange}
                    placeholder="e.g., 1299"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="edit-duration" className="text-xs">
                    Duration
                  </FieldLabel>
                  <Input
                    id="edit-duration"
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
                <FieldLabel htmlFor="edit-departure-date" className="text-xs">
                  Departure Date
                </FieldLabel>
                <Input
                  id="edit-departure-date"
                  name="departureDate"
                  type="date"
                  value={values.departureDate}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-image-url" className="text-xs">
                  Image URL
                </FieldLabel>
                <Input
                  id="edit-image-url"
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
                <FieldLabel htmlFor="edit-description" className="text-xs">
                  Description
                </FieldLabel>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="Describe the travel experience..."
                  className="min-h-24 resize-none rounded-sm border-neutral-200 bg-[#f8f8f8] px-3 py-2 text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-brand focus-visible:ring-brand/20"
                  required
                />
              </Field>
            </FieldGroup>

            {feedback ? (
              <p
                role={feedback.type === "error" ? "alert" : "status"}
                className={cn(
                  "mt-3 text-xs",
                  feedback.type === "error"
                    ? "text-red-600"
                    : "text-emerald-700"
                )}
              >
                {feedback.message}
              </p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-9 rounded-sm border-red-200 px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                )}
                disabled={isSaving}
              >
                Cancel
              </Dialog.Close>
              <Button
                type="submit"
                disabled={isSaving}
                className="h-9 rounded-sm bg-brand px-3 text-xs text-brand-foreground hover:bg-brand/90"
              >
                {isSaving ? (
                  <LoaderCircle
                    className="size-3.5 animate-spin"
                    aria-hidden="true"
                  />
                ) : feedback?.type === "success" ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : null}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
