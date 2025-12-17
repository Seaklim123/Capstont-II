export function PopularCategories() {
  const categories = [
    { name: "Pizza", icon: "🍕" },
    { name: "Burgers", icon: "🍔" },
    { name: "Sushi", icon: "🍱" },
    { name: "Tacos", icon: "🌮" },
    { name: "Desserts", icon: "🍰" },
    { name: "Drinks", icon: "🥤" },
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((category) => (
          <button
            key={category.name}
            className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-secondary transition-colors"
          >
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-3xl">
              {category.icon}
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
