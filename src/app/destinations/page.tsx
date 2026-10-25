import { Suspense } from "react"
import type { Metadata } from "next"
import { DestinationsList } from "@/components/destinations-list"
import type { TravelDestination } from "@/lib/travel-package"

export const metadata: Metadata = {
  title: "Explore Destinations | Wanderlast",
}

const destinationsApiUrl = "http://localhost:8000/destinations"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getDestinationRecords(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data
  }

  if (!isRecord(data)) {
    throw new Error("The destinations API returned an unexpected response.")
  }

  const records = data.destinations ?? data.data
  if (!Array.isArray(records)) {
    throw new Error("The destinations API response does not contain a list.")
  }

  return records
}

function parseDestinations(data: unknown): TravelDestination[] {
  return getDestinationRecords(data).map((record, index) => {
    if (!isRecord(record)) {
      throw new Error(`Destination at position ${index + 1} has invalid data.`)
    }

    const destinationName = record.destinationName
    const country = record.country
    const category = record.category
    const price = record.price
    const duration = record.duration
    const imageUrl = record.imageUrl
    const description = record.description
    const departureDate = record.departureDate
    const id = record._id ?? record.id

    if (
      typeof destinationName !== "string" ||
      typeof country !== "string" ||
      typeof category !== "string" ||
      typeof price !== "string" && typeof price !== "number" ||
      typeof duration !== "string" ||
      typeof imageUrl !== "string" ||
      typeof description !== "string" ||
      typeof departureDate !== "string"
    ) {
      throw new Error(`Destination at position ${index + 1} has invalid data.`)
    }

    return {
      id: typeof id === "string" ? id : String(id ?? index),
      destinationName,
      country,
      category,
      price: String(price),
      duration,
      departureDate,
      imageUrl,
      description,
    }
  })
}

async function DestinationsData() {
  let destinations: TravelDestination[] = []
  let fetchError: string | null = null

  try {
    const response = await fetch(destinationsApiUrl, { cache: "no-store" })
    if (!response.ok) {
      throw new Error(`Destinations API request failed (${response.status}).`)
    }

    destinations = parseDestinations(await response.json())
  } catch (error) {
    fetchError =
      error instanceof Error
        ? error.message
        : "Unable to load destinations. Please try again later."
  }

  if (fetchError) {
    return (
      <div
        role="alert"
        className="mt-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        Could not load destinations: {fetchError}
      </div>
    )
  }

  return <DestinationsList destinations={destinations} />
}

function DestinationsLoading() {
  return (
    <p className="mt-8 text-sm text-neutral-500" role="status">
      Loading destinations...
    </p>
  )
}

export default function DestinationsPage() {
  return (
    <main className="min-h-[calc(100svh-5rem)] bg-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <h1 className="font-heading text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
          Explore All Destinations
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Find your perfect travel experience from our curated collection.
        </p>
        <Suspense fallback={<DestinationsLoading />}>
          <DestinationsData />
        </Suspense>
      </section>
    </main>
  )
}
