import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PopularCategories } from "@/components/popular-categories"
import { BestSellers } from "@/components/best-sellers"
import { Promotions } from "@/components/promotion"
import { FeaturedRestaurants } from "@/components/featured-resturants"
import { Footer } from "@/components/footer-component"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <PopularCategories />
        <BestSellers />
        <Promotions />
        <FeaturedRestaurants />
      </main>
      <Footer />
    </div>
  )
}
