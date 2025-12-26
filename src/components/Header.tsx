import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goHome = () => {
    if (location.pathname === "/") {
      // Si ya estás en la página de inicio → recarga la página
      window.location.reload();
    } else {
      // Si estás en otra ruta → navega hacia el inicio
      navigate("/");
    }
  };

  return (
    <header className="bg-gradient-nature border-b border-primary/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo clickable */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={goHome} // 👈 Usa la función inteligente
          >
            <MapPin className="h-8 w-8 text-primary animate-glow-pulse" />
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Red Cultural Guaviare
              </h1>
              <p className="text-sm text-muted-foreground">
                Portal Institucional
              </p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary-glow"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Inicio
            </Button>

            <Button
              variant="ghost"
              className="text-primary hover:text-primary-glow"
              onClick={() => {
                const section = document.getElementById("contacto");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contacto
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
