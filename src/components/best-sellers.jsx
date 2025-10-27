import { Card, CardContent } from "@/components/ui/card"

export function BestSellers() {
  const products = [
    {
      name: "The Classic Burger",
      description: "Juicy beef patty with all the fixings",
      image: "/classic-burger-fries.png",
    },
    {
      name: "Assorted Sushi Platter",
      description: "Fresh and flavorful sushi selection",
      image: "/assorted-sushi.png",
    },
    {
      name: "Street Style Tacos",
      description: "Authentic tacos with a variety of fillings",
      image: "/street-tacos-on-plate.jpg",
    },
    {
      name: "Decadent Chocolate Cake",
      description: "Rich and moist chocolate cake",
      image: "/chocolate-layer-cake-slice.jpg",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16 bg-secondary/30">
      <h2 className="text-3xl font-bold mb-8">Best Sellers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.name} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
