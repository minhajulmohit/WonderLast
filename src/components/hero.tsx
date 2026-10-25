import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const searchFields = [
  { label: "Location", value: "Address, City Or Zip" },
  { label: "Date/Duration", value: "Anytime / 3 Days" },
  { label: "Budget", value: "$0-$3000" },
  { label: "People", value: "5-10" },
];

export function Hero() {
  return (
    <section className="relative -mt-16 flex min-h-svh flex-col overflow-hidden lg:-mt-20">
      <Image
        src="/assets/Banner.png"
        alt="Aerial view of a turquoise coastal bay surrounded by pine-covered cliffs"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 pt-16 pb-6 text-center sm:px-8 lg:pt-20 lg:pb-10">
          <h1 className="font-heading text-[2.75rem] leading-[0.98] font-normal tracking-[-0.02em] text-[#f7f3ea] sm:text-5xl md:text-6xl lg:text-[5rem]">
            <span className="block">Discover Your</span>
            <span className="block">Next Adventure</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base lg:mt-7 lg:text-lg">
            Explore breathtaking destinations and create unforgettable memories
            with our curated travel experiences.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:mt-9">
            <Link
              href="#destinations"
              className="group inline-flex h-11 items-center gap-3 bg-brand px-6 text-xs font-semibold tracking-[0.14em] text-brand-foreground uppercase transition-colors hover:bg-brand/90"
            >
              Explore Now
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="#destinations"
              className="inline-flex h-11 items-center bg-white/15 px-6 text-xs font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              View Destination
            </Link>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 divide-y divide-black/10 border-t border-white/20 bg-white/85 backdrop-blur-md md:grid-cols-[repeat(4,1fr)_11rem] md:divide-x md:divide-y-0">
          {searchFields.map((field) => (
            <div key={field.label} className="px-4 py-3.5 text-left lg:px-6">
              <p className="text-sm font-semibold text-neutral-900">
                {field.label}
              </p>
              <p className="mt-0.5 text-xs text-neutral-600">{field.value}</p>
            </div>
          ))}
          <button
            type="button"
            className="flex min-h-16 items-center justify-center bg-brand px-6 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
