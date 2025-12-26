import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

type ResetStep = "request" | "confirm";

const ResetPassword = () => {
  const [step, setStep] = useState<ResetStep>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = useMemo(() => {
    if (step === "request") {
      return !email;
    }
    return !code || !password || !confirmPassword;
  }, [step, email, code, password, confirmPassword]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === "confirm" && password !== confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Verifica que ambas contraseñas sean iguales.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (step === "request") {
        toast({
          title: "Código enviado",
          description: `Hemos enviado un código temporal al correo ${email}.`,
        });
        setStep("confirm");
      } else {
        toast({
          title: "Contraseña actualizada",
          description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
        });
        setEmail("");
        setCode("");
        setPassword("");
        setConfirmPassword("");
        setStep("request");
      }
      setIsSubmitting(false);
    }, 900);
  };

  const steps = [
    {
      id: "request",
      label: "Solicita el código",
      description: "Recibirás un código temporal en tu correo.",
    },
    {
      id: "confirm",
      label: "Actualiza tu contraseña",
      description: "Valida el código y crea una contraseña segura.",
    },
  ] as const;

  const securityTips = [
    {
      icon: ShieldCheck,
      title: "Protección avanzada",
      description: "Todas las solicitudes se validan con múltiples capas de seguridad.",
    },
    {
      icon: Sparkles,
      title: "Requisitos inteligentes",
      description: "Te guiaremos para crear contraseñas robustas y fáciles de recordar.",
    },
    {
      icon: CheckCircle2,
      title: "Estado en tiempo real",
      description: "Recibe alertas y confirmaciones durante todo el proceso.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-nature text-foreground">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu blur-3xl">
          <div className="mx-auto h-[32rem] w-[32rem] rounded-full bg-primary/20 opacity-50" />
        </div>

        <header className="flex items-center justify-between px-6 py-6 md:px-12">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Seguridad institucional</p>
            <h1 className="text-3xl font-semibold text-primary md:text-4xl">Recupera tu acceso</h1>
          </div>

          <Button asChild variant="ghost" className="text-primary hover:text-primary/80">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </header>

        <main className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 md:grid-cols-[1.1fr_0.9fr] md:px-12">
          <section className="space-y-6">
            <Card className="border-primary/20 shadow-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl text-primary">
                  <Lock className="h-8 w-8 text-primary" />
                  Restablece tu contraseña
                </CardTitle>
                <CardDescription className="text-base">
                  Confirma tu identidad y crea una nueva contraseña para reactivar los servicios digitales del Guaviare.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                  {steps.map((currentStep) => (
                    <div
                      key={currentStep.id}
                      className={`rounded-xl border p-4 transition ${step === currentStep.id ? "border-primary bg-primary/5 shadow-card" : "border-border bg-white/60"}`}
                    >
                      <p className="text-sm font-semibold text-primary">{currentStep.label}</p>
                      <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                    </div>
                  ))}
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo institucional</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="turismo@guaviare.gov.co"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {step === "confirm" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="code">Código de verificación</Label>
                        <div className="relative">
                          <RefreshCcw className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60" />
                          <Input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            placeholder="Ingresa el código de 6 dígitos"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            className="pl-10 tracking-[0.4em]"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Nueva contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          minLength={8}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirma tu contraseña</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Repite la nueva contraseña"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          minLength={8}
                          required
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || isSubmitDisabled}
                  >
                    {isSubmitting ? (
                      "Procesando..."
                    ) : step === "request" ? (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Enviar código seguro
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Confirmar nueva contraseña
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="border-primary/10 bg-white/60 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  Consejos de seguridad
                </CardTitle>
                <CardDescription>
                  Aplica estas recomendaciones antes de finalizar el proceso.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityTips.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-3 rounded-lg border border-primary/10 bg-white/70 p-4">
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium text-primary">{title}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-gradient-to-br from-primary/10 via-white to-secondary/10 shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">¿Qué sucede después?</CardTitle>
                <CardDescription>
                  Sigue el flujo recomendado para regresar rápidamente a los servicios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  1. Revisa tu bandeja de entrada y el correo no deseado. El remitente oficial es <strong>no-reply@guaviare.gov.co</strong>.
                </p>
                <p>
                  2. Copia el código de 6 dígitos y escríbelo exactamente como aparece. Tiene una vigencia de 10 minutos.
                </p>
                <p>
                  3. Al finalizar, recibirás una confirmación para iniciar sesión nuevamente en la intranet.
                </p>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default ResetPassword;


