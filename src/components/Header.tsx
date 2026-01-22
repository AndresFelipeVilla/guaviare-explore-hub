import { Button } from "@/components/ui/button";
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
            className="cursor-pointer"
            onClick={goHome}
          >
            <h1 className="text-2xl font-bold text-[#1f1f1f]">
              Red Cultural Guaviare
            </h1>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-[#1f1f1f] hover:bg-primary/5 font-semibold text-base px-6 py-5 transition-all duration-200"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Inicio
            </Button>

            <Button
              variant="ghost"
              className="text-[#1f1f1f] hover:bg-primary/5 font-semibold text-base px-6 py-5 transition-all duration-200"
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
