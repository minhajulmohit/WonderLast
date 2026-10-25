import Image from "next/image"

const features = [
  {
    icon: "/assets/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/assets/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/assets/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
]

export function WhyChoose() {
  return (
    <section
      id="why-choose"
      aria-labelledby="why-choose-title"
      className="bg-[#e8f6f9] py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="why-choose-title"
            className="font-heading text-4xl font-normal tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.5rem]"
          >
            Why Choose Wanderlust
          </h2>
          <p className="mt-3 text-sm text-neutral-500 sm:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="bg-white p-6 sm:p-8 lg:p-10"
            >
              <Image
                src={feature.icon}
                alt=""
                width={48}
                height={48}
                className="size-11"
              />
              <h3 className="mt-6 text-lg font-medium text-neutral-900 lg:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
