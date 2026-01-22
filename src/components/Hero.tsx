import { Button } from "@/components/ui/button";
import heroGuacamayo from "@/assets/hero-guacamayo.png";

interface HeroProps {
  overline?: string;
  title: string;
  titleAccent: string;
  description: string;
  ctaPrimary: {
    text: string;
    onClick: () => void;
  };
  tags?: string[];
  imagePlaceholder?: string;
}

const Hero = ({
  overline = "Portal Institucional",
  title = "Conectando",
  titleAccent = "Guaviare",
  description = "Descubre la riqueza cultural, el turismo sostenible y la gestión institucional de nuestro departamento amazónico. Una plataforma integral para explorar y conectar con el corazón de la Amazonía colombiana.",
  ctaPrimary = {
    text: "Explorar Módulos",
    onClick: () => {
      const section = document.getElementById("modulos");
      section?.scrollIntoView({ behavior: "smooth" });
    },
  },
  tags = ["Turismo Cultural", "Gestión Institucional", "Patrimonio Natural", "Comunidades"],
  imagePlaceholder = "hero-visual",
}: Partial<HeroProps> = {}) => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-white to-primary/5">
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Content Column */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Overline */}
            <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              {overline}
            </p>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground">
              {title}{" "}
              <span className="text-primary inline-block relative">
                {titleAccent}
                <span className="absolute bottom-0 left-0 w-full h-2 bg-primary/20 -z-10 transform translate-y-1" />
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {description}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                onClick={ctaPrimary.onClick}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {ctaPrimary.text}
              </Button>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-4">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm font-medium text-foreground/70 border border-border rounded-full hover:border-primary/50 hover:text-primary transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Placeholder Column */}
          <div className="relative order-1 lg:order-2">


            {/* Clean Image */}

            <img
              src={heroGuacamayo}
              alt="Guacamayo - representación de la biodiversidad del Guaviare"
              className="w-full h-auto object-contain"
            />


          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;