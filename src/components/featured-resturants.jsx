import { Card, CardContent } from "@/components/ui/card"

export function FeaturedRestaurants() {
  const restaurants = [
    {
      name: "The Burger Joint",
      description: "Best burgers in town",
      image: "/modern-restaurant-interior-with-wooden-decor.jpg",
    },
    {
      name: "Sushi Central",
      description: "Fresh and authentic sushi",
      image: "/japanese-restaurant-interior-minimalist.jpg",
    },
    {
      name: "Taco Haven",
      description: "Delicious tacos and more",
      image: "/mexican-restaurant-tacos-on-table.jpg",
    },
    {
      name: "Sweet Treats Bakery",
      description: "Cakes, cookies, and pastries",
      image: "/bakery-croissants-and-pastries.jpg",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Featured Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
              <p className="text-sm text-muted-foreground">{restaurant.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
