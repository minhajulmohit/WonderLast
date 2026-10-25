import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Cta() {
  return (
    <section
      id="book"
      aria-labelledby="cta-title"
      className="relative isolate overflow-hidden bg-neutral-950"
    >
      <Image
        src="/assets/CTA.png"
        alt="Aerial view of an airplane flying over a tropical island"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-16 lg:py-24">
        <h2
          id="cta-title"
          className="font-heading text-3xl font-normal tracking-[-0.02em] text-[#f7f3ea] sm:text-4xl lg:text-5xl"
        >
          Ready To Start Your Journey?
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
          Join thousands of travelers who have discovered the world with us
        </p>

        <Link
          href="#destinations"
          className="group mt-7 inline-flex h-11 items-center gap-3 bg-white px-6 text-xs font-semibold tracking-[0.14em] text-neutral-900 uppercase transition-colors hover:bg-white/90"
        >
          Book Your Trip Today
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  )
}
