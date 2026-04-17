/**
 * HeroCarousel — Full-width auto-scrolling hero with diverse, inclusive beauty imagery.
 * Uses embla-carousel for smooth transitions, keyboard nav, swipe support.
 * Auto-advances every 4.5 seconds, pauses on hover.
 */
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";

/* Hero images — diverse, inclusive beauty editorial portraits */
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
import hero6 from "@/assets/hero-6.jpg";

/** Slide data with accessible alt text describing each person */
const slides = [
  { src: hero1, alt: "Young woman with natural curly hair and glowing dark brown skin" },
  { src: hero2, alt: "Young man with clear glowing skin and styled hair" },
  { src: hero3, alt: "Woman with wavy brown hair and warm olive skin tone" },
  { src: hero4, alt: "Elegant mature woman with silver gray hair and radiant skin" },
  { src: hero5, alt: "Young person with long dark hair and medium brown skin" },
  { src: hero6, alt: "Man with textured hair applying moisturizer to his face" },
];

export function HeroCarousel() {
  /* Autoplay plugin: 4.5s interval, stops on interaction */
  const autoplayPlugin = Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplayPlugin]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /** Sync selected dot with current slide */
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  /** Navigation helpers */
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section className="relative w-full overflow-hidden" aria-label="Hero carousel">
      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]">
              {/* Image with dark overlay for text readability */}
              <div className="relative h-[420px] sm:h-[480px] lg:h-[540px]">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="h-full w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  width={1920}
                  height={864}
                />
                {/* Gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero text + search overlaid on the carousel */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10 pointer-events-none">
        <div className="max-w-2xl space-y-4 pointer-events-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white drop-shadow-lg leading-tight">
            Discover Beauty That
            <span className="block text-primary-foreground/90"> Works for You</span>
          </h1>
          <p className="mx-auto max-w-md text-white/85 text-sm sm:text-base drop-shadow">
            Personalized product inspiration for every skin type, tone, texture, and routine.
          </p>
          <div className="pt-2">
            <SearchBar large />
          </div>
        </div>
      </div>

      {/* Previous / Next arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist" aria-label="Carousel navigation">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            role="tab"
            aria-selected={i === selectedIndex}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selectedIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
