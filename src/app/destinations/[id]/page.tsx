import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Tag,
} from "lucide-react"
import type { TravelDestination } from "@/lib/travel-package"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EditDestinationDialog } from "@/components/edit-destination-dialog"
import { DeleteDestinationDialog } from "@/components/delete-destination-dialog"

export const metadata = {
  title: "Destination Details | Wanderlast",
}

const destinationApiUrl = "http://localhost:8000/destination"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseDestination(data: unknown, id: string): TravelDestination {
  const record = isRecord(data)
    ? (data.destination ?? data.data ?? data)
    : data

  if (!isRecord(record)) {
    throw new Error("The destination API returned an unexpected response.")
  }

  const destinationId = record._id ?? record.id ?? id
  const {
    destinationName,
    country,
    category,
    price,
    duration,
    departureDate,
    imageUrl,
    description,
  } = record

  if (
    typeof destinationName !== "string" ||
    typeof country !== "string" ||
    typeof category !== "string" ||
    (typeof price !== "string" && typeof price !== "number") ||
    typeof duration !== "string" ||
    typeof departureDate !== "string" ||
    typeof imageUrl !== "string" ||
    typeof description !== "string"
  ) {
    throw new Error("The destination API returned incomplete destination data.")
  }

  return {
    id: String(destinationId),
    destinationName,
    country,
    category,
    price: String(price),
    duration,
    departureDate,
    imageUrl,
    description,
  }
}

function formatPrice(price: string) {
  const numericPrice = Number(price)
  if (!Number.isFinite(numericPrice)) return `$${price}`

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericPrice)
}

function formatDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) return date

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate)
}

async function DestinationDetails({ id }: { id: string }) {
  let response: Response

  try {
    response = await fetch(
      `${destinationApiUrl}/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    )
  } catch (error) {
    return (
      <div
        role="alert"
        className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        Could not connect to the destinations API.{" "}
        {error instanceof Error ? error.message : "Please try again later."}
      </div>
    )
  }

  if (response.status === 404) notFound()
  if (!response.ok) {
    return (
      <div role="alert" className="text-sm text-red-700">
        Could not load this destination (server error {response.status}).
      </div>
    )
  }

  let destination: TravelDestination
  try {
    destination = parseDestination(await response.json(), id)
  } catch (error) {
    return (
      <div
        role="alert"
        className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        Could not read destination details.{" "}
        {error instanceof Error ? error.message : "Please try again later."}
      </div>
    )
  }

  const bookingSubject = encodeURIComponent(
    `Booking request: ${destination.destinationName}`
  )
  const bookingBody = encodeURIComponent(
    `I would like to book ${destination.destinationName} in ${destination.country}.\nPrice: ${formatPrice(destination.price)} per person.\nDuration: ${destination.duration}.\nDeparture date: ${formatDate(destination.departureDate)}.`
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to Destinations
        </Link>
        <div className="flex items-center gap-2">
          <EditDestinationDialog destination={destination} />
          <DeleteDestinationDialog destination={destination} />
        </div>
      </div>

      <div className="relative aspect-[2.15/1] w-full overflow-hidden bg-neutral-100 sm:aspect-[2.6/1]">
        {destination.imageUrl ? (
          <Image
            src={destination.imageUrl}
            alt={`${destination.destinationName}, ${destination.country}`}
            fill
            unoptimized
            priority
            sizes="(max-width: 768px) 100vw, 1100px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            No image available
          </div>
        )}
      </div>

      <div className="grid gap-8 pb-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
        <div className="space-y-6">
          <header>
            <p className="flex items-center gap-1.5 text-xs text-neutral-500">
              <MapPin className="size-3.5" aria-hidden="true" />
              {destination.country}
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-heading text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
                {destination.destinationName}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <Tag className="size-3.5" aria-hidden="true" />
                {destination.category}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-600">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-brand" aria-hidden="true" />
                {destination.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays
                  className="size-3.5 text-brand"
                  aria-hidden="true"
                />
                Departure: {formatDate(destination.departureDate)}
              </span>
            </div>
          </header>

          <section>
            <h2 className="font-heading text-xl font-medium text-neutral-900">
              Overview
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              {destination.description}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-medium text-neutral-900">
              Highlights
            </h2>
            <ul className="mt-3 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
              {[
                `${destination.category} travel experience`,
                `Explore ${destination.destinationName}, ${destination.country}`,
                `${destination.duration} package`,
                `Departure on ${formatDate(destination.departureDate)}`,
              ].map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <Card
          id="booking"
          className="h-fit gap-0 rounded-sm border-neutral-200 py-0 shadow-sm"
        >
          <CardContent className="p-5">
            <p className="text-xs text-neutral-500">Starting from</p>
            <p className="mt-0.5 text-2xl font-semibold text-brand">
              {formatPrice(destination.price)}
            </p>
            <p className="text-xs text-neutral-500">per person</p>

            <div className="mt-4 flex items-center gap-2 rounded-sm bg-neutral-50 px-3 py-2.5 text-xs text-neutral-700">
              <CalendarDays
                className="size-3.5 text-neutral-500"
                aria-hidden="true"
              />
              {formatDate(destination.departureDate)}
            </div>

            <Button
              render={
                <a
                  href={`mailto:info@wanderlast.com?subject=${bookingSubject}&body=${bookingBody}`}
                />
              }
              className="mt-3 h-10 w-full rounded-sm bg-brand text-sm text-brand-foreground hover:bg-brand/90"
            >
              Book Now
            </Button>

            <ul className="mt-4 space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <Check
                  className="size-3.5 text-emerald-600"
                  aria-hidden="true"
                />
                {destination.duration} package
              </li>
              <li className="flex items-center gap-2">
                <Check
                  className="size-3.5 text-emerald-600"
                  aria-hidden="true"
                />
                {destination.category} destination
              </li>
              <li className="flex items-center gap-2">
                <Check
                  className="size-3.5 text-emerald-600"
                  aria-hidden="true"
                />
                Departure {formatDate(destination.departureDate)}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DestinationDetailsLoading() {
  return (
    <p className="py-10 text-center text-sm text-neutral-500" role="status">
      Loading destination details...
    </p>
  )
}

async function DestinationDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DestinationDetails id={id} />
}

export default function DestinationDetailsPage(
  props: PageProps<"/destinations/[id]">
) {
  return (
    <main className="min-h-[calc(100svh-5rem)] bg-white">
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Suspense fallback={<DestinationDetailsLoading />}>
          <DestinationDetailsRoute params={props.params} />
        </Suspense>
      </section>
    </main>
  )
}
