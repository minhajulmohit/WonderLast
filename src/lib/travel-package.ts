export const travelPackageCategories = [
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Cruise",
] as const

export type TravelPackageCategory = (typeof travelPackageCategories)[number]

export type TravelPackageFormValues = {
  destinationName: string
  country: string
  category: TravelPackageCategory
  price: string
  duration: string
  departureDate: string
  imageUrl: string
  description: string
}

export const initialTravelPackageFormValues: TravelPackageFormValues = {
  destinationName: "",
  country: "",
  category: "Beach",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
}
