import type { Metadata } from "next"
import { AddTravelPackageForm } from "@/components/add-travel-package-form"

export const metadata: Metadata = {
  title: "Add New Travel Package | Wanderlast",
}

export default function AddDestinationPage() {
  return (
    <div className="min-h-[calc(100svh-5rem)] bg-[#f7f7f7]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <h1 className="font-heading text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem]">
          Add New Travel Package
        </h1>

        <div className="mx-auto mt-8 w-full max-w-2xl rounded-sm border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:mt-10 lg:p-10">
          <AddTravelPackageForm />
        </div>
      </div>
    </div>
  )
}
