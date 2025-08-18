import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              <span className="text-xl font-bold">Guaviare Digital</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Plataforma digital para el desarrollo sostenible del departamento del Guaviare, 
              promoviendo el turismo responsable y la gestión institucional eficiente.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contacto@guaviaredigital.gov.co</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+57 (8) 584-7000</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>San José del Guaviare, Guaviare, Colombia</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <p className="text-sm">© 2024 Gobierno del Guaviare</p>
              <p className="text-sm">Todos los derechos reservados</p>
              <p className="text-sm">Política de privacidad | Términos de uso</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;