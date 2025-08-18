import { MessageCircle, FileText, Users, Bot, Upload, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ModuleCard from "@/components/ModuleCard";
import Footer from "@/components/Footer";

const Index = () => {
  const handleChatbotAccess = () => {
    toast({
      title: "Chatbot de Turismo",
      description: "Esta funcionalidad requiere integración con base de datos. Conecta Supabase para continuar.",
    });
  };

  const handleReportsAccess = () => {
    toast({
      title: "Sistema de Informes", 
      description: "Esta funcionalidad requiere autenticación y base de datos. Conecta Supabase para continuar.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-nature">
      <Header />
      <Hero />
      
      {/* Modules Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Módulos del Sistema
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Accede a nuestros servicios digitales diseñados para promover el turismo 
              sostenible y mejorar la gestión institucional en el Guaviare
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Chatbot Module */}
            <ModuleCard
              title="Chatbot de Turismo"
              description="Asistente virtual inteligente que responde preguntas sobre la rica cultura y las maravillas turísticas del Guaviare, basado en una completa base de conocimiento actualizable."
              features={[
                "Información sobre sitios turísticos emblemáticos",
                "Guía cultural de tradiciones locales",
                "Recomendaciones personalizadas de actividades",
                "Base de conocimiento actualizable por administradores",
                "Respuestas en tiempo real las 24 horas"
              ]}
              icon={MessageCircle}
              buttonText="Chatear Ahora"
              onClick={handleChatbotAccess}
            />

            {/* Reports System Module */}
            <ModuleCard
              title="Sistema de Informes"
              description="Plataforma integral para la gestión de informes institucionales con roles diferenciados, permitiendo el flujo eficiente de documentos entre funcionarios y administradores."
              features={[
                "Registro y autenticación de usuarios con roles",
                "Creación y envío de informes por funcionarios", 
                "Adjuntar archivos PDF e imágenes",
                "Revisión y aprobación por administradores",
                "Sistema de notificaciones por correo electrónico",
                "Historial completo de estados de informes"
              ]}
              icon={FileText}
              buttonText="Acceder al Sistema"
              onClick={handleReportsAccess}
            />
          </div>

          {/* Features Overview */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center text-primary mb-12">
              ¿Por qué elegir Guaviare Digital?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">IA Avanzada</h4>
                <p className="text-muted-foreground">
                  Tecnología de inteligencia artificial para respuestas precisas sobre turismo y cultura local
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">Gestión Colaborativa</h4>
                <p className="text-muted-foreground">
                  Sistema de roles que facilita la colaboración entre funcionarios y administradores
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-primary mb-2">Transparencia</h4>
                <p className="text-muted-foreground">
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