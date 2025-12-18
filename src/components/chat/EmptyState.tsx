import { Shield, MessageSquare, Lock, Heart } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Safe by Design",
    description: "Built with safety constraints to prevent harmful outputs",
  },
  {
    icon: MessageSquare,
    title: "Clear Communication",
    description: "Provides accurate, practical, and neutral assistance",
  },
  {
    icon: Lock,
    title: "Boundary Aware",
    description: "Maintains defined limits regardless of user requests",
  },
  {
    icon: Heart,
    title: "Respectful",
    description: "Treats all users with dignity and neutrality",
  },
];

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-accent" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        How can I help you today?
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-10">
        I'm a safe AI assistant designed to provide helpful, accurate information while maintaining clear boundaries.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-3 p-4 rounded-xl bg-elevated border border-border/50 transition-smooth hover:border-border hover:shadow-soft"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <feature.icon className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
