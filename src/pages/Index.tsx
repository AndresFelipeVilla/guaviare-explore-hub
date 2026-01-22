import { MessageCircle, FileText, Users, Bot, Upload, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ModuleCard from "@/components/ModuleCard";
import Footer from "@/components/Footer";
import TouristSites from "@/components/TouristSites";
import chatbotMockup from "@/assets/chatbot-phone-only.png";
import reportsMockup from "@/assets/reports-dashboard-mockup.png";

import videoSrc from "@/assets/video.mp4";

const Index = () => {
  const handleChatbotAccess = () => {
    window.location.href = "/chatbot";
  };

  const handleReportsAccess = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gradient-nature">
      <Header />
      <Hero />

      <TouristSites />

      {/* Modules Section */}
      <section id="modulos" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1f1f1f] mb-6">
              Módulos del Sistema
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Accede a nuestros servicios digitales diseñados para promover el turismo
              sostenible y mejorar la gestión institucional en el Guaviare
            </p>
          </div>

          <div className="flex flex-col gap-24 max-w-6xl mx-auto">

            {/* Row 1: Sistema de Informes */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  <span>Gestión Institucional</span>
                </div>
                <h3 className="text-3xl font-bold text-[#1f1f1f]">
                  Sistema de Informes
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Plataforma integral para la gestión de informes institucionales con roles diferenciados.
                  Optimiza el flujo de trabajo permitiendo a los funcionarios crear reportes detallados
                  y a los administradores revisarlos y aprobarlos eficientemente.
                </p>
                <ul className="space-y-3 pt-4">
                  {[
                    "Registro y autenticación de usuarios seguros",
                    "Creación y envío de informes verificados",
                    "Flujo de revisión y aprobación administrativa",
                    "Trazabilidad completa de documentos"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <button
                    onClick={handleReportsAccess}
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all hover:-translate-y-1"
                  >
                    Acceder al Sistema
                  </button>
                </div>
              </div>

              {/* Right: Video Visualization */}
              <div className="relative group">
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="relative z-10 w-full max-h-[600px] object-contain mx-auto rounded-2xl shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Row 2: Chatbot de Turismo */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Image Visualization */}
              <div className="relative group">
                <img
                  src={chatbotMockup}
                  alt="Interfaz del Chatbot de Turismo Guaviare"
                  className="relative z-10 w-full max-h-[600px] object-contain mx-auto animate-pulse-scale"
                />
              </div>

              {/* Right: Text Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <MessageCircle className="w-4 h-4" />
                  <span>Asistente Virtual IA</span>
                </div>
                <h3 className="text-3xl font-bold text-[#1f1f1f]">
                  Chatbot de Turismo
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Tu guía personal disponible 24/7. Nuestro asistente inteligente responde preguntas
                  sobre la rica cultura, sitios turísticos y actividades en el Guaviare, basado en
                  una base de conocimiento verificada y actualizable.
                </p>
                <ul className="space-y-3 pt-4">
                  {[
                    "Información sobre sitios turísticos emblemáticos",
                    "Guía cultural y de tradiciones locales",
                    "Recomendaciones personalizadas de viaje",
                    "Respuestas inmediatas en cualquier momento"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <button
                    onClick={handleChatbotAccess}
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all hover:-translate-y-1"
                  >
                    Chatear Ahora
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Features Overview */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center text-[#1f1f1f] mb-12">
              Características Principales
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-primary/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8 group">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-[#1f1f1f] mb-3 text-center">IA Avanzada</h4>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Tecnología de inteligencia artificial para respuestas precisas sobre turismo y cultura local
                </p>
              </div>

              <div className="bg-white border border-primary/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8 group">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-[#1f1f1f] mb-3 text-center">Gestión Colaborativa</h4>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Sistema de roles que facilita la colaboración entre funcionarios y administradores
                </p>
              </div>

              <div className="bg-white border border-primary/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8 group">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-[#1f1f1f] mb-3 text-center">Transparencia</h4>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Seguimiento completo de procesos con notificaciones automáticas y trazabilidad
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
};

export default Index;