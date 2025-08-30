import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Zap, Trophy } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      title: "Total Distance",
      value: "1,247 km",
      icon: MapPin,
      trend: "+12% from last month",
      color: "text-primary"
    },
    {
      title: "Active Time",
      value: "89h 32m",
      icon: Clock,
      trend: "+8% from last month",
      color: "text-secondary"
    },
    {
      title: "Avg Speed",
      value: "15.8 km/h",
      icon: Zap,
      trend: "+2.3% from last month",
      color: "text-accent"
    },
    {
      title: "Achievements",
      value: "24",
      icon: Trophy,
      trend: "3 new this month",
      color: "text-orange-500"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Performance Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your progress with comprehensive analytics and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border/50 hover:shadow-card transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsOverview;