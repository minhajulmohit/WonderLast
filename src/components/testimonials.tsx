"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const testimonials = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/assets/person2.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/assets/person1.png",
  },
  {
    quote:
      "The Japan Cherry Blossom Tour Was A Dream Come True. Beautiful Scenery, Delicious Food, And Seamless Planning From Start To Finish.",
    name: "James Wilson",
    location: "Sydney, Australia",
    image: "/assets/person2.png",
  },
  {
    quote:
      "The Santorini Sunset Cruise Was Pure Magic. The Crew Was Friendly And The Views Were Out Of This World. We Can't Wait To Book Our Next Trip!",
    name: "Elena Rossi",
    location: "Rome, Italy",
    image: "/assets/person1.png",
  },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="bg-white py-16 md:py-24"
    >
      <Carousel
        opts={{ loop: true, align: "start" }}
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="testimonials-title"
              className="font-heading text-4xl font-normal tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.5rem]"
            >
              What Travelers Say
            </h2>
            <p className="mt-2 text-sm text-neutral-500 sm:text-base">
              Real experiences from our happy travelers
            </p>
          </div>

          <div className="flex shrink-0 gap-2 self-end sm:self-auto sm:pt-2">
            <CarouselPrevious
              size="icon-lg"
              className="static! border-neutral-200 bg-transparent text-neutral-400 hover:border-neutral-300 hover:text-neutral-700"
            />
            <CarouselNext
              size="icon-lg"
              className="static! border-neutral-200 bg-transparent text-neutral-400 hover:border-neutral-300 hover:text-neutral-700"
            />
          </div>
        </div>

        <CarouselContent className="mt-8 lg:mt-10">
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.name} className="sm:basis-1/2">
              <article className="flex h-full border border-neutral-200 bg-white">
                <div className="flex flex-1 flex-col p-5 lg:p-8">
                  <blockquote className="text-[13px] leading-relaxed text-neutral-700 lg:text-sm">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <div className="mt-auto pt-6">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-px w-4 shrink-0 bg-brand"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-brand/80">
                        {testimonial.name}
                      </span>
                    </div>
                    <p className="mt-1 pl-6 text-xs text-neutral-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="w-[38%] shrink-0 p-2 pl-0">
                  <div className="relative aspect-[218/264] w-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={`Portrait of ${testimonial.name}`}
                      fill
                      sizes="(min-width: 640px) 20vw, 38vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
