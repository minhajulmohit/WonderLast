"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react"
import type { TravelDestination } from "@/lib/travel-package"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

type DeleteDestinationDialogProps = {
  destination: Pick<TravelDestination, "id" | "destinationName">
}

const apiUrl = "http://localhost:8000/destination"

export function DeleteDestinationDialog({
  destination,
}: DeleteDestinationDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(nextOpen: boolean) {
    if (isDeleting) return
    setError(null)
    setOpen(nextOpen)
  }

  async function handleDelete() {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(
        `${apiUrl}/${encodeURIComponent(destination.id)}`,
        { method: "DELETE" }
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

      setOpen(false)
      router.replace("/destinations")
      router.refresh()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this travel package. Please try again."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-8 rounded-sm border-red-200 px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
        )}
      >
        <Trash2 className="size-3.5" aria-hidden="true" />
        Delete
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/65 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[min(21rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-neutral-200 bg-white p-5 shadow-xl outline-none sm:w-[21rem] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="size-4" aria-hidden="true" />
              </span>
              <Dialog.Title className="font-heading text-base font-medium text-neutral-900">
                Delete Travel Package
              </Dialog.Title>
            </div>
            <Dialog.Close
              aria-label="Close delete confirmation"
              disabled={isDeleting}
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
            >
              <X className="size-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="mt-3 text-xs leading-5 text-neutral-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-neutral-700">
              &quot;{destination.destinationName}&quot;
            </span>
            ? This action cannot be undone and will permanently remove this
            travel package from the system.
          </Dialog.Description>

          {error ? (
            <p role="alert" className="mt-3 text-xs text-red-600">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close
              disabled={isDeleting}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 rounded-sm px-3 text-xs"
              )}
            >
              Cancel
            </Dialog.Close>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-9 rounded-sm bg-red-500 px-3 text-xs text-white hover:bg-red-600"
            >
              {isDeleting ? (
                <LoaderCircle
                  className="size-3.5 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Trash2 className="size-3.5" aria-hidden="true" />
              )}
              {isDeleting ? "Deleting..." : "Delete Package"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
