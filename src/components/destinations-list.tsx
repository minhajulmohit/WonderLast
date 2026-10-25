"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  travelPackageCategories,
  type TravelDestination,
} from "@/lib/travel-package"

type DestinationsListProps = {
  destinations: TravelDestination[]
}

type PriceRange = "all" | "under-500" | "500-1500" | "over-1500"
type SortOrder = "featured" | "price-low" | "price-high" | "name"

function isPriceRange(value: string | null): value is PriceRange {
  return (
    value === "all" ||
    value === "under-500" ||
    value === "500-1500" ||
    value === "over-1500"
  )
}

function isSortOrder(value: string | null): value is SortOrder {
  return (
    value === "featured" ||
    value === "price-low" ||
    value === "price-high" ||
    value === "name"
  )
}

function getPrice(destination: TravelDestination) {
  const price = Number(destination.price)
  return Number.isFinite(price) ? price : Number.POSITIVE_INFINITY
}

function formatPrice(destination: TravelDestination) {
  const price = getPrice(destination)

  if (!Number.isFinite(price)) {
    return "Price unavailable"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}

function matchesPriceRange(
  destination: TravelDestination,
  priceRange: PriceRange
) {
  const price = getPrice(destination)

  switch (priceRange) {
    case "under-500":
      return price < 500
    case "500-1500":
      return price >= 500 && price <= 1500
    case "over-1500":
      return price > 1500
    default:
      return true
  }
}

export function DestinationsList({ destinations }: DestinationsListProps) {
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState<PriceRange>("all")
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured")

  const visibleDestinations = useMemo(() => {
    const filtered = destinations.filter(
      (destination) =>
        (category === "all" || destination.category === category) &&
        matchesPriceRange(destination, priceRange)
    )

    switch (sortOrder) {
      case "price-low":
        return [...filtered].sort((a, b) => getPrice(a) - getPrice(b))
      case "price-high":
        return [...filtered].sort((a, b) => getPrice(b) - getPrice(a))
      case "name":
        return [...filtered].sort((a, b) =>
          a.destinationName.localeCompare(b.destinationName)
        )
      default:
        return filtered
    }
  }, [category, destinations, priceRange, sortOrder])

  return (
    <div className="mt-8">
      <div className="grid gap-2 sm:grid-cols-3">
        <Select
          value={category}
          onValueChange={(value) => {
            if (value !== null) setCategory(value)
          }}
        >
          <SelectTrigger
            aria-label="Filter by category"
            className="h-10 w-full rounded-sm border-neutral-200 bg-white px-3 text-xs uppercase tracking-wide text-neutral-600"
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {travelPackageCategories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priceRange}
          onValueChange={(value) => {
            if (isPriceRange(value)) setPriceRange(value)
          }}
        >
          <SelectTrigger
            aria-label="Filter by price"
            className="h-10 w-full rounded-sm border-neutral-200 bg-white px-3 text-xs uppercase tracking-wide text-neutral-600"
          >
            <SelectValue placeholder="Price range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="under-500">Under $500</SelectItem>
            <SelectItem value="500-1500">$500 – $1,500</SelectItem>
            <SelectItem value="over-1500">Over $1,500</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value) => {
            if (isSortOrder(value)) setSortOrder(value)
          }}
        >
          <SelectTrigger
            aria-label="Sort destinations"
            className="h-10 w-full rounded-sm border-neutral-200 bg-white px-3 text-xs uppercase tracking-wide text-neutral-600"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: low to high</SelectItem>
            <SelectItem value="price-high">Price: high to low</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Showing {visibleDestinations.length}{" "}
        {visibleDestinations.length === 1 ? "destination" : "destinations"}
      </p>

      {visibleDestinations.length === 0 ? (
        <p className="mt-8 rounded-md border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500">
          {destinations.length === 0
            ? "No destinations available yet."
            : "No destinations match these filters."}
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDestinations.map((destination) => (
            <Card
              key={destination.id}
              className="gap-0 overflow-hidden rounded-sm p-0 shadow-none ring-0"
            >
              <div className="relative aspect-[1.75/1] overflow-hidden bg-neutral-100">
                {destination.imageUrl ? (
                  <Image
                    src={destination.imageUrl}
                    alt={`${destination.destinationName}, ${destination.country}`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                    No image available
                  </div>
                )}
                <span className="absolute right-2 top-2 rounded-sm bg-white/90 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-neutral-700">
                  {destination.category}
                </span>
              </div>

              <CardHeader className="gap-2 px-0 pb-1 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex min-w-0 items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{destination.country}</span>
                  </p>
                  <p className="shrink-0 text-sm font-semibold text-neutral-900">
                    {formatPrice(destination)}
                    <span className="ml-1 text-[10px] font-normal text-neutral-500">
                      /person
                    </span>
                  </p>
                </div>
                <CardTitle className="text-base font-medium text-neutral-900">
                  {destination.destinationName}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0 pb-0 pt-1">
                <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <CalendarDays className="size-3 shrink-0" aria-hidden="true" />
                  {destination.duration}
                </p>
                <p className="mt-2 line-clamp-2 min-h-8 text-xs leading-4 text-neutral-600">
                  {destination.description}
                </p>
                <Link
                  href={`/destinations/${encodeURIComponent(destination.id)}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
                  aria-label={`View ${destination.destinationName} details and booking options`}
                >
                  Book Now
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
