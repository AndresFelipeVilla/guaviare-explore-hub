import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-nature border-b border-primary/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-8 w-8 text-primary animate-glow-pulse" />
            <div>
              <h1 className="text-2xl font-bold text-primary">Guaviare Digital</h1>
              <p className="text-sm text-muted-foreground">Portal Institucional</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-primary hover:text-primary-glow">
              Inicio
            </Button>
            <Button variant="ghost" className="text-primary hover:text-primary-glow">
              Contacto
            </Button>
            <Button variant="nature" size="sm">
              Acceder
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;