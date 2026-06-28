import { useState } from "react";
import { useEbooks } from "../hooks/useEbooks";
import EbookGrid from "../components/ebooks/EbookGrid";
import EbookModal from "../components/ebooks/EbookModal";
import Loader from "../components/ui/Loader";
import { Sparkles, BookOpen } from "lucide-react";

export default function HomePage() {
  const { ebooks, loading, error } = useEbooks();
  const [selectedEbook, setSelectedEbook] = useState(null);

  return (
    <div className="space-y-16 pb-16 pt-4 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      {/* Hero Showcase banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gray-900/60 text-white border border-white/10 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-transparent"></div>
        </div>

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-6 py-12 md:grid-cols-2 md:px-12 md:py-16">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase border border-amber-400/20">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
              Editor's Pick
            </div>
            
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white leading-tight">
              Beyond the Horizon
            </h1>
            
            <p className="text-base text-gray-300 max-w-lg leading-relaxed">
              An exquisite exploration of humanity's next chapter. Bridges the gap between our technological trajectory and the quest for meaning. Perfect for creators, designers, and builders of tomorrow.
            </p>
            
            <div className="flex items-center gap-2.5 text-sm text-gray-400">
              <span className="font-semibold text-white">Evelyn St. Claire</span>
              <span>•</span>
              <span className="text-xs uppercase tracking-widest font-mono text-gray-300">Philosophy</span>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center">
            <div className="group relative h-80 w-56 overflow-hidden rounded-2xl shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"
                alt="Beyond the Horizon Preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main catalog Section */}
      <section className="space-y-8">
        <div className="text-left space-y-1 mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
            <BookOpen className="h-4 w-4 text-amber-400" />
            Curated Library Catalog
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Browse Boutique Ebooks
          </h2>
        </div>

        {loading ? (
          <div className="py-20">
            <Loader size="lg" text="Fetching cloud ebooks catalog..." />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">
            Failed to load ebooks: {error.message || "Unknown error occurred"}
          </div>
        ) : (
          <EbookGrid ebooks={ebooks} onSelect={setSelectedEbook} />
        )}
      </section>

      {/* Detail overlay */}
      {selectedEbook && (
        <EbookModal
          ebook={selectedEbook}
          onClose={() => setSelectedEbook(null)}
        />
      )}
    </div>
  );
}
