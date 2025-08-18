import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  buttonText: string;
  comingSoon?: boolean;
  onClick?: () => void;
}

const ModuleCard = ({ 
  title, 
  description, 
  features, 
  icon: Icon, 
  buttonText, 
  comingSoon = false,
  onClick 
}: ModuleCardProps) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-card border-primary/10 shadow-card-soft hover:shadow-nature transition-all duration-300 hover:-translate-y-2 p-8 group">
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
          Próximamente
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Icon className="h-8 w-8 text-primary group-hover:text-primary-glow transition-colors" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-primary mb-2">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-semibold text-primary mb-3">Funcionalidades:</h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button 
        variant="module" 
        size="lg" 
        className="w-full font-semibold"
        disabled={comingSoon}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Card>
  );
};

export default ModuleCard;