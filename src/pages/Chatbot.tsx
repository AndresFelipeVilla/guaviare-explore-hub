import { MessageCircle, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Chatbot = () => {
  const openChatWidget = () => {
    const widget = document.querySelector('elevenlabs-convai') as any;
    if (widget && widget.open) {
      widget.open();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nature">
      <Header />

      {/* Chatbot Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Asistente Virtual de Turismo
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conversa con nuestro asistente inteligente impulsado por IA para obtener información
              sobre los atractivos turísticos, cultura y tradiciones del Guaviare.
            </p>
          </div>

          <Card className="shadow-nature">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-8">
                {/* Feature Highlights */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">IA Avanzada</h3>
                    <p className="text-sm text-muted-foreground">
                      Respuestas inteligentes sobre turismo y cultura
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Chat por Voz</h3>
                    <p className="text-sm text-muted-foreground">
                      Habla con el asistente de forma natural
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">24/7 Disponible</h3>
                    <p className="text-sm text-muted-foreground">
                      Acceso desde cualquier página del sitio
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-6 border-t">
                  <p className="text-muted-foreground mb-6">
                    Haz clic en el botón de abajo o busca el ícono de chat en la esquina de tu pantalla
                  </p>
                  <Button
                    onClick={openChatWidget}
                    size="lg"
                    className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Abrir Chat Ahora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Chatbot;