// app/home/page.tsx
import { HeroSection } from '../components/HeroSection'
import { ResourcesGrid } from '../components/ResourcesGrid'



export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Explore Learning Paths And Tech Resources</h2>
        <ResourcesGrid />
      </section>
    </>
  )
}
