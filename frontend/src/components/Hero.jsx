import { ChevronDown } from "lucide-react";
import heroImage from "../assets/hero-sweets.jpg";

const Hero = () => {
  const scrollToCategories = () => {
    const element = document.getElementById("categories");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Delicious assortment of sweets and desserts"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-background mb-6 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Indulge in Sweet
            <span className="block text-green-300">Perfection</span>
          </h1>

          <p
            className="text-lg md:text-xl text-background/90 mb-8 max-w-2xl mx-auto font-body animate-fade-up"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            Welcome to SweetMart — your destination for handcrafted desserts and
            confections. From creamy chocolates to fluffy pancakes, every bite
            is a moment of pure bliss.
          </p>

          {/* GREEN BUTTONS */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            {/* PRIMARY GREEN BUTTON */}
            <button
              onClick={scrollToCategories}
              className="px-8 py-4 bg-green-700 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:bg-green-800 active:bg-green-900 hover:shadow-lg hover:scale-105"
            >
              Explore Our Sweets
            </button>

            {/* OUTLINE GREEN BUTTON */}
            <button
              onClick={scrollToCategories}
              className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-green-700 text-green-700 bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-green-700 hover:text-white hover:shadow-md"
            >
              View Categories
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToCategories}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-background animate-bounce cursor-pointer"
      >
        <ChevronDown className="h-10 w-10" />
      </button>
    </section>
  );
};

export default Hero;
