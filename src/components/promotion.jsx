import { Button } from "@/components/ui/button"

export function Promotions() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Promotions</h2>
      <div className="bg-[#f5e6d3] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <img src="/illustrated-burger-drawing.jpg" alt="Burger illustration" className="w-full max-w-sm mx-auto" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl font-bold mb-4">20% Off Your First Order</h3>
          <p className="text-muted-foreground mb-6">Use code WELCOME20 at checkout</p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">Order Now</Button>
        </div>
      </div>
    </section>
  )
}
