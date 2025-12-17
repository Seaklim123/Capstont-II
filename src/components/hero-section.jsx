import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section className="relative h-[500px] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=500&width=1200&query=delicious+pizza+with+basil+on+dark+background)",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">Order Food Online</h2>
        <p className="text-white/90 text-lg mb-8 text-pretty">
          Get your favorite meals delivered right to your door with Foodie Express. Explore a wide range of cuisines and
          enjoy reliable service.
        </p>

        <div className="flex items-center gap-2 bg-white rounded-lg p-2 max-w-2xl mx-auto">
          <svg className="w-5 h-5 text-muted-foreground ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            type="text"
            placeholder="Enter your delivery address"
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">Find Food</Button>
        </div>
      </div>
    </section>
  )
}
